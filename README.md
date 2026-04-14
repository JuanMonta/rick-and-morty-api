# Rick and Morty API Explorer - Angular SPA

Una Single Page Application (SPA) robusta desarrollada en **Angular 12**, diseñada para consumir y presentar datos de la API pública de Rick and Morty. .

## ✨ Características Principales y Arquitectura

* **Gestión de Estado Centralizada:** Usando `BehaviorSubject` de RxJS para la comunicación entre componentes hermanos (Lista, Header y Detalles) sin depender de `@Input()` o `@Output()` (evitando el *prop drilling*).

* **Programación Reactiva Avanzada (RxJS):** * Implementación de **Formularios Reactivos** acoplados a observables (`debounceTime`, `distinctUntilChanged`, `switchMap`) para búsquedas en tiempo real optimizadas, evitando la saturación del servidor.
  * Uso de `forkJoin` y `switchMap` para orquestar peticiones HTTP anidadas y paralelas (extrayendo datos complejos de Origen, Localización y Episodios).

* **Carga Progresiva y Control de Concurrencia:** Implementación de `concatMap`, `bufferCount` y `scan` para descargar toda la base de datos de forma progresiva por lotes, protegiendo la API de errores `429 Too Many Requests`.

* **Caché Inteligente (TTL):** Sistema de almacenamiento en `localStorage` con caducidad de 24 horas para operaciones matemáticas pesadas (cálculo de totales globales de la base de datos de la API), reduciendo las peticiones de red a 0 en recargas posteriores.

* **Diseño UI/UX Inmutable:** Maquetación construida 100% con CSS Flexbox y Grid. La pantalla se mantiene anclada (sin scroll global), permitiendo desplazamientos independientes en tablas de datos y paneles.

## 🛠️ Stack Tecnológico

* **Framework:** Angular 12
* **Librerías:** RxJS
* **Estilos:** CSS3 puro (Flexbox, CSS Grid)
* **Fuente de Datos:** [The Rick and Morty REST API](https://rickandmortyapi.com/)

## 🚀 Instalación y Ejecución Local

Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

1. Clona este repositorio:
```bash
git clone https://github.com/JuanMonta/rick-and-morty-api.git
```
2. Navega al directorio del proyecto.

```bash
cd rick-and-morty-api
```

3. Instala las dependencias necesarias:
```bash
npm install
```

4. Levanta el servidor de desarrollo:
```bash
ng serve
```

5. Abre el navegador y visita `http://localhost:4200` que por lo general es la dirección con el puerto por defecto, si por alguna razón no estas seguro, héchale un vistazo a la terminal cuando levantes el servidor con `ng serve`

```bash
http://localhost:4200
```
##
##  👤 Autor: Juan Monta
