[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=22920915)
# Ejercicios aprendiendo Git - GitHub Classroom

Aquí les dejo una colección completa de ejercicios progresivos para aprender Git y GitHub, diseñados para GitHub Classroom con autocalificación automática.

## 🚀 Inicio Rápido

**¿Primera vez aquí?** Lee la [Guía de Inicio Rápido](QUICKSTART.md) para comenzar inmediatamente.

## 📖 Recursos Adicionales

- [Documentación oficial de Git](https://git-scm.com/doc)
- [GitHub Learning Lab](https://lab.github.com/)
- [Interactive Git Tutorial](https://learngitbranching.js.org/)


## 📚 Descripción del Proyecto

Este repositorio contiene una serie de ejercicios estructurados para que los estudiantes aprendan Git desde lo básico hasta conceptos más avanzados. Cada ejercicio incluye:

- Instrucciones detalladas paso a paso.
- Tests automatizados para verificar el progreso.
- Integración con GitHub Classroom para autocalificación.
- Ejemplos prácticos y casos de uso reales.

## 🎯 Objetivos de Aprendizaje

Al completar estos ejercicios, los estudiantes serán capaces de:

1. **Fundamentos de Git**
   - Inicializar repositorios
   - Configurar Git
   - Realizar commits básicos

2. **Gestión de Archivos**
   - Añadir y modificar archivos
   - Usar el área de staging
   - Entender el flujo de trabajo de Git

3. **Trabajo con Ramas**
   - Crear y gestionar branches
   - Realizar merges
   - Resolver conflictos

4. **Integración con GitHub**
   - Conectar repositorios locales con remotos
   - Realizar push y pull
   - Sincronizar cambios

## 📋 Lista de Ejercicios

| Ejercicio | Descripción | Conceptos Clave |
|-----------|-------------|-----------------|
| **1** | [Inicializar Git](ejercicios/ejercicio-1-git-init.md) | `git init`, `git config`, configuración inicial |
| **2** | [Primer Commit](ejercicios/ejercicio-2-primer-commit.md) | `git add`, `git commit`, `git status` |
| **3** | [Modificar y Commits](ejercicios/ejercicio-3-modificar-commits.md) | `git diff`, commits múltiples, staging selectivo |
| **4** | [Trabajar con Ramas](ejercicios/ejercicio-4-ramas.md) | `git branch`, `git checkout`, `git merge` |
| **5** | [GitHub y Push](ejercicios/ejercicio-5-github-push.md) | `git remote`, `git push`, GitHub integration |
| **6** | [Pull y Clone](ejercicios/ejercicio-6-pull-clone.md) | `git pull`, `git clone`, sincronización |
| **7** | [Conflictos](ejercicios/ejercicio-7-conflictos.md) | Resolución de conflictos, merge conflicts |

## 🚀 Cómo Empezar

### Para Estudiantes

1. **Acepta la asignación** a través del enlace de GitHub Classroom
2. **Clona tu repositorio** generado automáticamente
3. **Instala las dependencias**:
   ```bash
   npm install
   ```
4. **Comienza con el Ejercicio 1** y sigue las instrucciones en `ejercicios/`
5. **Ejecuta los tests** mientras trabajas:
   ```bash
   npm test
   ```
   **✨ Automáticamente** se genera `test-results.json` con tu puntuación
6. **Sube tus resultados a GitHub**:
   ```bash
   git add .
   git commit -m "Completar ejercicios"
   git push origin main
   ```

**⚠️ IMPORTANTE**: El archivo `test-results.json` se genera automáticamente al ejecutar tests. Solo necesitas hacer commit del archivo.

## 📊 Sistema de Autocalificación

Este repositorio incluye un sistema de autocalificación automática. **Puntuación total: 100 puntos**

### ⚡ Flujo de Trabajo Simplificado

1. **Trabaja localmente** en los ejercicios
2. **Ejecuta tests**: `npm test` (genera automáticamente test-results.json)
3. **Haz commit** del archivo generado
4. **Push a GitHub**: GitHub Classroom valida y califica

### Distribución de Puntos

| Ejercicio | Puntos |
|-----------|--------|
| Ejercicio 1: Git Init | 15 |
| Ejercicio 2: Primer Commit | 15 |
| Ejercicio 3: Modificar Commits | 15 |
| Ejercicio 4: Ramas | 15 |
| Ejercicio 5: GitHub Push | 15 |
| Ejercicio 6: Pull y Clone | 10 |
| Ejercicio 7: Conflictos | 15 |
| **TOTAL** | **100** |

### Verificar tu Puntuación

```bash
# Ejecuta los tests - genera automáticamente test-results.json
npm test

# Valida que el archivo de resultados sea correcto
npm run validate
```

El comando `npm test` genera automáticamente un archivo `test-results.json` con tu puntuación detallada.

**⚠️ Recuerda hacer commit de `test-results.json`** para que GitHub Classroom pueda calificarte.

**📖 Para más detalles**, consulta [AUTOGRADING.md](AUTOGRADING.md)

## ⚡ Comandos de Testing

```bash
# Ejecutar todos los tests (genera test-results.json automáticamente)
npm test

# Generar reporte de calificación completo
npm run generate-results

# Ejecutar tests de Git básico (ejercicios 1-3)
npm run test:git

# Ejecutar tests de GitHub (ejercicios 4-7)
npm run test:github

# Ejecutar un ejercicio específico
npm test -- tests/ejercicio/1-git-init.test.js

# Ejecutar tests con detalles
npm run test:verbose

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

## 📁 Estructura del Proyecto

```
├── ejercicios/           # Instrucciones de los ejercicios
├── tests/
│   └── ejercicio/        # Tests automatizados para cada ejercicio
├── coverage/             # Reportes de cobertura (generado)
├── package.json          # Configuración del proyecto
├── jest.config.js        # Configuración de Jest
└── README.md            # Este archivo
```
---

## ✅ Criterios de Evaluación

### Calificación Automática en GitHub Classroom

**Flujo de trabajo del estudiante:**
1. ✅ Completa ejercicios localmente
2. ✅ Ejecuta `npm test` (genera automáticamente test-results.json)
3. ✅ Hace commit del archivo generado
4. ✅ Push a GitHub
5. ✅ GitHub valida y califica automáticamente

**GitHub Classroom verifica:**
- ✅ Existencia del archivo `test-results.json`
- ✅ Estructura y autenticidad del archivo
- ✅ Puntuación de cada ejercicio
- ✅ Fecha de ejecución válida

### Puntuación

- **100 puntos**: Puntuación máxima
- **60+ puntos**: Aprobado
- **Puntuación parcial**: Se otorga por tests individuales aprobados
- **Sin decimales**: Todas las puntuaciones son números enteros

### Cada ejercicio evalúa:

- **Existencia de archivos requeridos**
- **Contenido correcto de los archivos**
- **Historial de commits apropiado**
- **Estado del repositorio Git**
- **Configuración correcta**
- **Sincronización con GitHub**

---

**¡Feliz aprendizaje con Git! 🎉**
