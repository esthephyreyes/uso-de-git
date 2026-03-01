#!/usr/bin/env node

/**
 * Script para ejecutar los tests y generar un archivo JSON con los resultados
 * Este archivo será utilizado por GitHub Classroom para la calificación automática
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración de puntos por ejercicio (total: 100 puntos)
const EJERCICIOS_CONFIG = [
  { id: 1, nombre: 'git-init', puntos: 15, archivo: '1-git-init.test.js' },
  { id: 2, nombre: 'primer-commit', puntos: 15, archivo: '2-primer-commit.test.js' },
  { id: 3, nombre: 'modificar-commits', puntos: 15, archivo: '3-modificar-commits.test.js' },
  { id: 4, nombre: 'ramas', puntos: 15, archivo: '4-ramas.test.js' },
  { id: 5, nombre: 'github-push', puntos: 15, archivo: '5-github-push.test.js' },
  { id: 6, nombre: 'pull-clone', puntos: 10, archivo: '6-pull-clone.test.js' },
  { id: 7, nombre: 'conflictos', puntos: 15, archivo: '7-conflictos.test.js' }
];

const TOTAL_PUNTOS = 100;

function ejecutarTests() {
  console.log('🧪 Ejecutando tests...\n');
  
  try {
    // Ejecutar Jest con formato JSON
    const output = execSync('npm test -- --json --testLocationInResults', {
      encoding: 'utf8',
      stdio: 'pipe',
      env: { ...process.env, CI: 'true' }
    });
    
    return JSON.parse(output);
  } catch (error) {
    // Jest devuelve error code != 0 cuando hay tests fallidos
    // pero aún así genera el output JSON
    if (error.stdout) {
      try {
        return JSON.parse(error.stdout);
      } catch (e) {
        console.error('❌ Error al parsear resultados de Jest:', e.message);
        return null;
      }
    }
    console.error('❌ Error ejecutando tests:', error.message);
    return null;
  }
}

function procesarResultados(jestResults) {
  if (!jestResults || !jestResults.testResults) {
    return {
      success: false,
      mensaje: 'No se pudieron obtener los resultados de los tests',
      ejercicios: [],
      resumen: { total: 0, aprobados: 0, fallidos: 0, puntos: 0 }
    };
  }

  const resultadosPorEjercicio = [];
  let puntosTotal = 0;

  EJERCICIOS_CONFIG.forEach(ejercicio => {
    // Buscar el archivo de test correspondiente
    const testResult = jestResults.testResults.find(tr => 
      tr.name.includes(ejercicio.archivo)
    );

    if (!testResult) {
      resultadosPorEjercicio.push({
        ejercicio: ejercicio.id,
        nombre: ejercicio.nombre,
        estado: 'no-ejecutado',
        tests_totales: 0,
        tests_aprobados: 0,
        tests_fallidos: 0,
        puntos_posibles: ejercicio.puntos,
        puntos_obtenidos: 0,
        porcentaje: 0
      });
      return;
    }

    const totalTests = testResult.assertionResults.length;
    const testsAprobados = testResult.assertionResults.filter(
      t => t.status === 'passed'
    ).length;
    const testsFallidos = totalTests - testsAprobados;

    // Calcular puntos proporcionalmente
    const porcentajeAprobado = totalTests > 0 ? (testsAprobados / totalTests) : 0;
    const puntosObtenidos = Math.floor(ejercicio.puntos * porcentajeAprobado);
    puntosTotal += puntosObtenidos;

    const estado = testsFallidos === 0 ? 'aprobado' : 
                   testsAprobados > 0 ? 'parcial' : 'fallido';

    resultadosPorEjercicio.push({
      ejercicio: ejercicio.id,
      nombre: ejercicio.nombre,
      estado: estado,
      tests_totales: totalTests,
      tests_aprobados: testsAprobados,
      tests_fallidos: testsFallidos,
      puntos_posibles: ejercicio.puntos,
      puntos_obtenidos: puntosObtenidos,
      porcentaje: Math.floor(porcentajeAprobado * 100),
      detalles: testResult.assertionResults.map(ar => ({
        nombre: ar.title,
        estado: ar.status,
        duracion_ms: ar.duration
      }))
    });
  });

  const totalTests = jestResults.numTotalTests || 0;
  const testsAprobados = jestResults.numPassedTests || 0;
  const testsFallidos = jestResults.numFailedTests || 0;

  return {
    success: jestResults.success,
    fecha_ejecucion: new Date().toISOString(),
    ejercicios: resultadosPorEjercicio,
    resumen: {
      total_ejercicios: EJERCICIOS_CONFIG.length,
      ejercicios_completos: resultadosPorEjercicio.filter(e => e.estado === 'aprobado').length,
      ejercicios_parciales: resultadosPorEjercicio.filter(e => e.estado === 'parcial').length,
      ejercicios_fallidos: resultadosPorEjercicio.filter(e => e.estado === 'fallido').length,
      total_tests: totalTests,
      tests_aprobados: testsAprobados,
      tests_fallidos: testsFallidos,
      puntos_totales: TOTAL_PUNTOS,
      puntos_obtenidos: puntosTotal,
      porcentaje_final: Math.floor((puntosTotal / TOTAL_PUNTOS) * 100)
    }
  };
}

function generarReporte(resultados) {
  console.log('\n' + '='.repeat(70));
  console.log('📊 REPORTE DE RESULTADOS - EJERCICIOS DE GIT');
  console.log('='.repeat(70) + '\n');

  resultados.ejercicios.forEach(ej => {
    const icono = ej.estado === 'aprobado' ? '✅' : 
                  ej.estado === 'parcial' ? '⚠️' : '❌';
    
    console.log(`${icono} Ejercicio ${ej.ejercicio}: ${ej.nombre}`);
    console.log(`   Tests: ${ej.tests_aprobados}/${ej.tests_totales} aprobados`);
    console.log(`   Puntos: ${ej.puntos_obtenidos}/${ej.puntos_posibles} (${ej.porcentaje}%)`);
    console.log('');
  });

  console.log('='.repeat(70));
  console.log('RESUMEN FINAL:');
  console.log('-'.repeat(70));
  console.log(`Tests totales: ${resultados.resumen.tests_aprobados}/${resultados.resumen.total_tests}`);
  console.log(`Ejercicios completos: ${resultados.resumen.ejercicios_completos}/${resultados.resumen.total_ejercicios}`);
  console.log(`\n🎯 PUNTUACIÓN FINAL: ${resultados.resumen.puntos_obtenidos}/${resultados.resumen.puntos_totales} puntos`);
  console.log(`   Porcentaje: ${resultados.resumen.porcentaje_final}%`);
  console.log('='.repeat(70) + '\n');
}

function main() {
  console.log('🚀 Iniciando evaluación de ejercicios de Git\n');

  // Ejecutar tests
  const jestResults = ejecutarTests();
  
  if (!jestResults) {
    console.error('❌ No se pudieron ejecutar los tests correctamente');
    process.exit(1);
  }

  // Procesar resultados
  const resultados = procesarResultados(jestResults);

  // Guardar JSON
  const outputPath = path.join(__dirname, 'test-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(resultados, null, 2));
  console.log(`✅ Resultados guardados en: ${outputPath}\n`);

  // Generar reporte en consola
  generarReporte(resultados);

  // Exit code basado en si todos los tests pasaron
  process.exit(resultados.success ? 0 : 1);
}

// Ejecutar si es el módulo principal
if (require.main === module) {
  main();
}

module.exports = { ejecutarTests, procesarResultados };
