/**
 * Custom Jest Reporter para Autograding
 * Genera automáticamente test-results.json después de ejecutar los tests
 */

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

class AutogradingReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunComplete(contexts, results) {
    // Solo generar si se ejecutaron tests de ejercicios
    const hasEjercicioTests = results.testResults.some(tr => 
      tr.testFilePath.includes('tests/ejercicio')
    );

    if (!hasEjercicioTests) {
      return; // No generar para otros tests
    }

    const resultados = this.procesarResultados(results);
    const outputPath = path.join(process.cwd(), 'test-results.json');
    
    try {
      fs.writeFileSync(outputPath, JSON.stringify(resultados, null, 2));
      console.log('\n' + '='.repeat(70));
      console.log('📊 ARCHIVO DE RESULTADOS GENERADO AUTOMÁTICAMENTE');
      console.log('='.repeat(70));
      console.log(`✅ Guardado en: test-results.json`);
      console.log(`🎯 Puntuación: ${resultados.resumen.puntos_obtenidos}/${TOTAL_PUNTOS} puntos`);
      console.log('\n⚠️  IMPORTANTE: Haz commit de este archivo para tu calificación:');
      console.log('   git add test-results.json');
      console.log('   git commit -m "Actualizar resultados de tests"');
      console.log('='.repeat(70) + '\n');
    } catch (error) {
      console.error('❌ Error al guardar resultados:', error.message);
    }
  }

  procesarResultados(jestResults) {
    if (!jestResults || !jestResults.testResults) {
      return this.resultadosVacios();
    }

    const resultadosPorEjercicio = [];
    let puntosTotal = 0;

    EJERCICIOS_CONFIG.forEach(ejercicio => {
      const testResult = jestResults.testResults.find(tr => 
        tr.testFilePath.includes(ejercicio.archivo)
      );

      if (!testResult) {
        resultadosPorEjercicio.push(this.ejercicioNoEjecutado(ejercicio));
        return;
      }

      const totalTests = testResult.testResults.length;
      const testsAprobados = testResult.testResults.filter(
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
        detalles: testResult.testResults.map(tr => ({
          nombre: tr.title,
          estado: tr.status,
          duracion_ms: tr.duration || 0
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

  ejercicioNoEjecutado(ejercicio) {
    return {
      ejercicio: ejercicio.id,
      nombre: ejercicio.nombre,
      estado: 'no-ejecutado',
      tests_totales: 0,
      tests_aprobados: 0,
      tests_fallidos: 0,
      puntos_posibles: ejercicio.puntos,
      puntos_obtenidos: 0,
      porcentaje: 0,
      detalles: []
    };
  }

  resultadosVacios() {
    return {
      success: false,
      fecha_ejecucion: new Date().toISOString(),
      ejercicios: EJERCICIOS_CONFIG.map(e => this.ejercicioNoEjecutado(e)),
      resumen: {
        total_ejercicios: EJERCICIOS_CONFIG.length,
        ejercicios_completos: 0,
        ejercicios_parciales: 0,
        ejercicios_fallidos: EJERCICIOS_CONFIG.length,
        total_tests: 0,
        tests_aprobados: 0,
        tests_fallidos: 0,
        puntos_totales: TOTAL_PUNTOS,
        puntos_obtenidos: 0,
        porcentaje_final: 0
      }
    };
  }
}

module.exports = AutogradingReporter;
