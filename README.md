# Rick and Morty API Explorer - Enterprise Architecture

Una Single Page Application (SPA) de alto rendimiento desarrollada en **Angular 12**, diseñada bajo principios de **Clean Architecture** y **Programación Reactiva Avanzada**.

## 🏗️ Arquitectura y Patrones de Diseño

El proyecto ha sido refactorizado para garantizar escalabilidad y mantenibilidad mediante:

* **Patrón Facade:** Centralización de la lógica de negocio y gestión de estado en capas de abstracción (`Facades`), desacoplando totalmente los componentes de los servicios de datos.
* **Componentización Smart & Dumb:** 
  * **Smart Components (Containers):** Manejan el flujo de datos y se comunican con los Facades.
  * **Dumb Components (Presentational):** Componentes 100% reutilizables en la carpeta `Shared` (ej. `Pagination`, `Avatar`) que reciben datos vía `@Input` y emiten eventos vía `@Output`.
* **Gestión de Estado Reactiva:** Uso de `BehaviorSubject` y flujos asíncronos para una sincronización en tiempo real entre componentes hermanos.

## 🚀 Optimizaciones con RxJS

Se implementaron flujos complejos para maximizar el rendimiento y la experiencia de usuario:

* **Cancelación de Peticiones:** Uso de `switchMap` en los detalles de personajes para abortar peticiones HTTP pendientes cuando el usuario cambia de selección rápidamente.
* **Carga Paralela Eficiente:** Implementación de `forkJoin` para disparar peticiones simultáneas (Origen, Localización, Episodios) reduciendo el tiempo de carga total.
* **Búsqueda Optimizada:** Estrategia de filtrado mediante `debounceTime`, `distinctUntilChanged` y validación de longitud mínima (3 caracteres) para minimizar el tráfico de red.
* **Manejo de Errores Resiliente:** Uso de `catchError` con respuestas por defecto para evitar que la UI se rompa ante fallos de la API externa.

## ✨ Características de UX/UI (Grado Empresarial)

* **Dynamic Pagination:** Sistema matemático de paginación con elipsis (`...`) y rangos dinámicos.
* **Image Fallback System:** Componente `Avatar` personalizado que detecta errores de carga y muestra iniciales del personaje con un diseño estilizado.
* **Performance Loading:** Overlays semi-transparentes con **Spinners de CSS puro** (High Performance) y *Lazy Loading* nativo para imágenes.
* **Feedback Visual:** Filas de tabla con efecto *Zebra* y resaltado persistente de selección.

## 🛠️ Stack Tecnológico

* **Framework:** Angular 12 (Core, Forms, Common).
* **Reactividad:** RxJS 6+.
* **Estilos:** CSS3 (Flexbox y CSS Grid para layouts inmutables).
* **Git:** Estándar de *Conventional Commits* para un historial de versiones profesional.

## 🚀 Instalación y Ejecución

1.  Clone el repositorio: `git clone https://github.com/JuanMonta/rick-and-morty-api.git`
2.  Instale dependencias: `npm install`
3.  Inicie el servidor: `ng serve`

## ⚠️ Troubleshooting: Error de Compatibilidad con Node.js
Este proyecto está construido de forma estable en `Angular 12`. Sin embargo, si tu máquina local cuenta con una versión reciente de `Node.js (v17 o superior)`, es probable que al ejecutar ng serve te encuentres con el error `ERR_OSSL_EVP_UNSUPPORTED`.

**Contexto Técnico:** Las versiones de Node.js 17+ utilizan OpenSSL 3.0, el cual introdujo restricciones criptográficas más estrictas que entran en conflicto con las dependencias de empaquetado de Angular 12 (Webpack 4).

**Solución Rápida:**
Debes indicar a Node.js que permita el uso de proveedores legacy (antiguos) de `OpenSSL`. Esto se logra seteando una variable de entorno temporal en tu terminal antes de correr el servidor. Utiliza el comando correspondiente a tu terminal:

* **En Windows (Powershell)**
```bash
$env:NODE_OPTIONS="--openssl-legacy-provider"
ng serve
```

* **En Windows (CMD Clásico)**
```bash
set NODE_OPTIONS=--openssl-legacy-provider
ng serve
```

* **En Mac / Linux (Bash o Zsh)**
```bash
export NODE_OPTIONS=--openssl-legacy-provider
ng serve
```

**Nota:** Esta configuración es temporal por sesión de terminal. Si cierras el editor o reinicias la PC, deberás volver a ejecutar el comando la próxima vez que desees levantar el proyecto.
