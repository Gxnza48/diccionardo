# Diccionardo

La enciclopedia no oficial del chat: diccionario comunitario de la Coscu Army, con estética de wiki retro argentina.

## Ejecutar

Requiere Node.js 22.12 o posterior.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

## Publicar en Vercel

1. En Vercel, elegí **Add New → Project** e importá `Gxnza48/diccionardo`.
2. Seleccioná **Vite** si no se detecta automáticamente.
3. Build command: `npm run build`. Output directory: `dist`.
4. Presioná **Deploy**. No hay variables de entorno, base de datos ni secretos que configurar.

Cada push a la rama principal actualiza el sitio conectado. La aplicación es estática y usa enlaces `#palabra/nashe` para compartir entradas; funcionan también al abrirlos directamente. Las vistas de palabras comparten los metadatos sociales generales del sitio.

## Aportes de la comunidad

El formulario prepara un **issue público de GitHub**. La persona debe iniciar sesión en GitHub y confirmar su envío. El sitio no afirma que una propuesta ya se haya enviado ni la publica automáticamente. No se guardan propuestas en el navegador ni hay una base de datos ficticia.

El repositorio debe ser público y tener Issues habilitados. No publiques información personal en las propuestas.

Para aprobar una propuesta:

1. Revisá el significado, contexto y fuente en el issue.
2. Agregá el registro a `src/data.js`; cada `slug` debe ser único y `related` debe apuntar a slugs existentes.
3. Agregá las referencias a `sources`, o usá `source: null` para señalar que falta documentarla.
4. Ejecutá `npm test` y `npm run build`, subí el cambio y cerrá el issue con referencia al commit.

Para un futuro envío sin cuenta de GitHub se necesitará un backend persistente con moderación y protección contra spam; esta primera versión usa GitHub deliberadamente para mantener el lanzamiento simple y sin servicios adicionales.

## Contenido

Las definiciones y ejemplos son redacción editorial propia. Los ejemplos no son citas atribuidas a Coscu. Las fuentes de referencia están enlazadas en cada entrada y en «Acerca del proyecto». Las entradas sin fuente están identificadas; no se afirma que todas las palabras hayan sido inventadas por Coscu. «Nazi» se documenta con contexto histórico y queda fuera de la selección aleatoria.

Proyecto independiente: no está afiliado ni aprobado por Coscu, Wikipedia ni Wikimedia.

## Estructura

- `src/data.js`: palabras, referencias y búsqueda.
- `src/community-words.js`: 70 términos aportados por el dueño del proyecto, con variantes, época y origen indicado. Se combinan por término normalizado con las entradas iniciales, sin duplicarlas. Los orígenes aportados se muestran como no verificados; las entradas nuevas no inventan ejemplos ni fuentes.
- `src/main.js`: interfaz, navegación, filtros y propuestas.
- `src/style.css`: diseño adaptable y estilos.
- `.github/ISSUE_TEMPLATE/`: propuestas y correcciones.

La interfaz usa Arial y Georgia del sistema, sin fuentes externas. No hay analítica ni rastreadores integrados.
