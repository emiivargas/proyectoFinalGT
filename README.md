# Proyecto Gen‑T: e‑commerce de autos y motos

Este repositorio contiene la base para un sitio web de comercio electrónico desarrollado con **Vite** y **React**. La idea es tener un catálogo de vehículos, un carrito de compras y autenticación de usuarios usando **Supabase** como backend.

## Estructura del proyecto

- `src/` — Contiene el código fuente de React.
  - `App.jsx` configura las rutas principales con React Router.
  - `pages/` incluye las páginas de catálogo (`Home`), carrito (`Cart`) y login (`Login`).
  - `supabaseClient.js` centraliza la inicialización del cliente de Supabase usando variables de entorno.
- `index.html` — Punto de entrada HTML que monta la aplicación React.
- `vite.config.js` — Configuración de Vite con el plugin de React.
- `package.json` — Lista de dependencias y scripts comunes (`dev`, `build`, `preview`).
- `.env.example` — Plantilla para tus credenciales de Supabase. Debes copiar este archivo a `.env` y completar los valores.

## Pasos para comenzar

1. **Instalación de dependencias**

   En tu máquina local (no es necesario ejecutarlo en este entorno), navegá a la carpeta del proyecto y ejecutá:

   ```bash
   npm install
   ```

   Esto descargará las dependencias listadas en `package.json`.

2. **Configuración de Supabase**

   - Creá un proyecto en [Supabase](https://supabase.io/).
   - En la sección "Project Settings → API" encontrarás la **URL** y la **anon key**. Copiá estos valores.
   - Renombrá `.env.example` a `.env` y rellená:

     ```
     VITE_SUPABASE_URL=tu_url_de_supabase
     VITE_SUPABASE_ANON_KEY=tu_anon_key
     ```

   - Dentro de Supabase, creá una tabla `products` con al menos las columnas:
     - `id` (UUID o integer, primary key)
     - `name` (text)
     - `price` (numeric)
     - `created_at` (timestamp, opcional)
   - También podés crear una tabla `users` si necesitás guardar información adicional de los usuarios.

3. **Ejecución en modo desarrollo**

   Una vez instaladas las dependencias y configuradas las variables de entorno, iniciá el servidor de desarrollo con:

   ```bash
   npm run dev
   ```

   Esto levantará un servidor en `http://localhost:5173` (o el puerto que Vite elija). Al entrar verás el catálogo conectado a la tabla `products` de Supabase.

4. **Compilar para producción**

   Para generar una versión optimizada:

   ```bash
   npm run build
   ```

   El resultado quedará en la carpeta `dist/`.

## Notas importantes

- **Autenticación:** Actualmente solo se implementa el inicio de sesión por email y contraseña. Podés expandirlo para registrar usuarios o usar otros proveedores que ofrece Supabase.
- **Carrito de compras:** El componente del carrito es un simple placeholder. Será necesario implementar la lógica para agregar/quitar productos y posiblemente almacenar el carrito en una base de datos o en el almacenamiento local.
- **GitHub:** Este proyecto no realiza ningún `git init` ni `npm install` en este entorno porque la red de este contenedor restringe el acceso a npm. Ejecutá esos comandos en tu máquina y luego podés subir los cambios al repositorio `gen‑t` en GitHub.

Con esta base deberías poder comenzar a desarrollar y ampliar la aplicación según las necesidades de tu equipo. ¡Éxitos!