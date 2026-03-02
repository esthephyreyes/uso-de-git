#!/usr/bin/env node

/**
 * Validador de resultados para GitHub Classroom
 * Este script valida el archivo test-results.json generado localmente
 * y asigna la calificación correspondiente
 */

const fs = require('fs');
const path = require('path');

const RESULTADOS_PATH = path.join(__dirname, '..', 'test-results.json');
const TOTAL_PUNTOS_ESPERADOS = 100;
const EJERCICIOS_ESPERADOS = 7;

// Configuración de puntos esperados por ejercicio
const PUNTOS_POR_EJERCICIO = {
  1: 15,
  2: 15,
  3: 15,
  4: 15,
  5: 15,
  6: 10,
  7: 15
};

class ValidadorResultados {
  constructor() {
    this.errores = [];
    this.advertencias = [];
    this.resultados = null;
  }

  validar() {
    console.log('🔍 Validando archivo de resultados...\n');

    // 1. Verificar existencia del archivo
    if (!this.verificarExistencia()) {
      return this.finalizarConError();
    }

    // 2. Cargar y parsear el archivo
    if (!this.cargarArchivo()) {
      return this.finalizarConError();
    }

    // 3. Validar estructura
    if (!this.validarEstructura()) {
      return this.finalizarConError();
    }

    // 4. Validar contenido
    if (!this.validarContenido()) {
      return this.finalizarConError();
    }

    // 5. Validar puntuación
    if (!this.validarPuntuacion()) {
      return this.finalizarConError();
    }

    // 6. Verificar autenticidad básica
    if (!this.verificarAutenticidad()) {
      return this.finalizarConError();
    }

    return this.finalizarConExito();
  }

  verificarExistencia() {
    if (!fs.existsSync(RESULTADOS_PATH)) {
      this.errores.push('❌ Archivo test-results.json no encontrado');
      this.errores.push('   Debes ejecutar: npm test');
      this.errores.push('   El archivo se generará automáticamente');
      this.errores.push('   Y luego hacer commit del archivo generado');
      return false;
    }
    console.log('✅ Archivo test-results.json encontrado');
    return true;
  }

  cargarArchivo() {
    try {
      const contenido = fs.readFileSync(RESULTADOS_PATH, 'utf8');
      this.resultados = JSON.parse(contenido);
      console.log('✅ Archivo JSON válido');
      return true;
    } catch (error) {
      this.errores.push('❌ Error al leer el archivo test-results.json');
      this.errores.push(`   ${error.message}`);
      return false;
    }
  }

  validarEstructura() {
    const camposRequeridos = ['ejercicios', 'resumen', 'fecha_ejecucion'];
    const faltantes = camposRequeridos.filter(campo => !(campo in this.resultados));

    if (faltantes.length > 0) {
      this.errores.push('❌ Estructura del archivo incorrecta');
      this.errores.push(`   Campos faltantes: ${faltantes.join(', ')}`);
      return false;
    }

    console.log('✅ Estructura del archivo correcta');
    return true;
  }

  validarContenido() {
    // Validar array de ejercicios
    if (!Array.isArray(this.resultados.ejercicios)) {
      this.errores.push('❌ El campo "ejercicios" debe ser un array');
      return false;
    }

    if (this.resultados.ejercicios.length !== EJERCICIOS_ESPERADOS) {
      this.errores.push(`❌ Se esperan ${EJERCICIOS_ESPERADOS} ejercicios, encontrados ${this.resultados.ejercicios.length}`);
      return false;
    }

    // Validar cada ejercicio
    for (const ej of this.resultados.ejercicios) {
      if (!this.validarEjercicio(ej)) {
        return false;
      }
    }

    console.log('✅ Contenido de ejercicios válido');
    return true;
  }

  validarEjercicio(ejercicio) {
    const camposRequeridos = [
      'ejercicio', 'nombre', 'estado', 
      'tests_totales', 'tests_aprobados', 'tests_fallidos',
      'puntos_posibles', 'puntos_obtenidos', 'porcentaje'
    ];

    const faltantes = camposRequeridos.filter(campo => !(campo in ejercicio));
    if (faltantes.length > 0) {
      this.errores.push(`❌ Ejercicio ${ejercicio.ejercicio || '?'} tiene campos faltantes: ${faltantes.join(', ')}`);
      return false;
    }

    // Validar que los puntos posibles sean correctos
    const puntosEsperados = PUNTOS_POR_EJERCICIO[ejercicio.ejercicio];
    if (ejercicio.puntos_posibles !== puntosEsperados) {
      this.errores.push(`❌ Ejercicio ${ejercicio.ejercicio}: puntos posibles incorrectos (esperados: ${puntosEsperados}, encontrados: ${ejercicio.puntos_posibles})`);
      return false;
    }

    // Validar que los puntos obtenidos no excedan los posibles
    if (ejercicio.puntos_obtenidos > ejercicio.puntos_posibles) {
      this.errores.push(`❌ Ejercicio ${ejercicio.ejercicio}: puntos obtenidos (${ejercicio.puntos_obtenidos}) exceden los posibles (${ejercicio.puntos_posibles})`);
      return false;
    }

    return true;
  }

  validarPuntuacion() {
    const resumen = this.resultados.resumen;

    // Validar campos del resumen
    if (typeof resumen.puntos_obtenidos !== 'number' || 
        typeof resumen.puntos_totales !== 'number') {
      this.errores.push('❌ Puntuación en formato incorrecto');
      return false;
    }

    // Validar que la suma de puntos sea correcta
    const sumaPuntos = this.resultados.ejercicios.reduce(
      (sum, ej) => sum + ej.puntos_obtenidos, 0
    );

    if (sumaPuntos !== resumen.puntos_obtenidos) {
      this.errores.push(`❌ La suma de puntos no coincide (esperado: ${sumaPuntos}, reportado: ${resumen.puntos_obtenidos})`);
      return false;
    }

    // Validar total de puntos
    if (resumen.puntos_totales !== TOTAL_PUNTOS_ESPERADOS) {
      this.errores.push(`❌ Total de puntos incorrecto (esperado: ${TOTAL_PUNTOS_ESPERADOS}, encontrado: ${resumen.puntos_totales})`);
      return false;
    }

    // Validar que no haya puntos negativos
    if (resumen.puntos_obtenidos < 0 || resumen.puntos_obtenidos > TOTAL_PUNTOS_ESPERADOS) {
      this.errores.push(`❌ Puntuación fuera de rango (0-${TOTAL_PUNTOS_ESPERADOS}): ${resumen.puntos_obtenidos}`);
      return false;
    }

    console.log('✅ Puntuación válida');
    return true;
  }

  verificarAutenticidad() {
    // Verificar que la fecha de ejecución sea reciente (últimos 30 días)
    const fechaEjecucion = new Date(this.resultados.fecha_ejecucion);
    const ahora = new Date();
    const diferenciaDias = (ahora - fechaEjecucion) / (1000 * 60 * 60 * 24);

    if (isNaN(fechaEjecucion.getTime())) {
      this.advertencias.push('⚠️  Fecha de ejecución inválida');
    } else if (diferenciaDias > 30) {
      this.advertencias.push(`⚠️  Los resultados tienen más de 30 días (${Math.floor(diferenciaDias)} días)`);
    } else if (diferenciaDias < 0) {
      this.errores.push('❌ Fecha de ejecución en el futuro - posible manipulación');
      return false;
    }

    // Verificar coherencia de datos
    const totalTests = this.resultados.ejercicios.reduce(
      (sum, ej) => sum + ej.tests_totales, 0
    );

    if (this.resultados.resumen.total_tests !== totalTests) {
      this.advertencias.push('⚠️  El total de tests no coincide con la suma de ejercicios');
    }

    console.log('✅ Verificación de autenticidad completada');
    return true;
  }

  finalizarConError() {
    console.log('\n' + '='.repeat(70));
    console.log('❌ VALIDACIÓN FALLIDA');
    console.log('='.repeat(70));
    
    this.errores.forEach(error => console.log(error));
    
    if (this.advertencias.length > 0) {
      console.log('\nAdvertencias:');
      this.advertencias.forEach(adv => console.log(adv));
    }
    
    console.log('\n📝 Para generar un archivo válido, ejecuta:');
    console.log('   npm test');
    console.log('   git add test-results.json');
    console.log('   git commit -m "Agregar resultados de tests"');
    console.log('   git push');
    console.log('='.repeat(70) + '\n');
    
    return {
      valido: false,
      puntos: 0,
      errores: this.errores,
      advertencias: this.advertencias
    };
  }

  finalizarConExito() {
    const puntos = this.resultados.resumen.puntos_obtenidos;
    const porcentaje = this.resultados.resumen.porcentaje_final;

    console.log('\n' + '='.repeat(70));
    console.log('✅ VALIDACIÓN EXITOSA');
    console.log('='.repeat(70));
    
    if (this.advertencias.length > 0) {
      console.log('\nAdvertencias:');
      this.advertencias.forEach(adv => console.log(adv));
      console.log('');
    }

    console.log('📊 RESUMEN DE CALIFICACIÓN:');
    console.log('-'.repeat(70));
    
    this.resultados.ejercicios.forEach(ej => {
      const icono = ej.estado === 'aprobado' ? '✅' : 
                    ej.estado === 'parcial' ? '⚠️' : '❌';
      console.log(`${icono} Ejercicio ${ej.ejercicio}: ${ej.nombre.padEnd(20)} ${ej.puntos_obtenidos}/${ej.puntos_posibles} pts`);
    });

    console.log('-'.repeat(70));
    console.log(`🎯 PUNTUACIÓN FINAL: ${puntos}/${TOTAL_PUNTOS_ESPERADOS} puntos (${porcentaje}%)`);
    
    if (puntos >= 60) {
      console.log('🎉 ¡APROBADO!');
    } else {
      console.log('📚 Continúa trabajando en los ejercicios');
    }
    
    console.log('='.repeat(70) + '\n');

    return {
      valido: true,
      puntos: puntos,
      porcentaje: porcentaje,
      ejercicios: this.resultados.ejercicios,
      errores: [],
      advertencias: this.advertencias
    };
  }

  generarSalidaGitHub() {
    if (!this.resultados) return;

    const puntos = this.resultados.resumen.puntos_obtenidos;
    
    // Generar output para GitHub Actions
    console.log('\n📤 Información para GitHub Actions:');
    console.log(`::set-output name=puntos::${puntos}`);
    console.log(`::set-output name=porcentaje::${this.resultados.resumen.porcentaje_final}`);
    console.log(`::set-output name=aprobado::${puntos >= 60}`);
  }
}

function main() {
  const validador = new ValidadorResultados();
  const resultado = validador.validar();

  // Generar outputs para GitHub Actions
  if (resultado.valido) {
    validador.generarSalidaGitHub();
  }

  // Exit code basado en validación
  process.exit(resultado.valido ? 0 : 1);
}

// Ejecutar si es el módulo principal
if (require.main === module) {
  main();
}

module.exports = { ValidadorResultados };
