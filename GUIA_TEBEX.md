# GUÍA DE INSTALACIÓN EN TEBEX

Para aplicar el diseño de DrakesCraft en tu tienda Tebex, sigue estos pasos copiando los archivos que he generado en la carpeta `basetebex`.

## 1. Subir Archivos (Assets)
En el editor de Tebex, ve a la sección **Assets** (columna izquierda) y sube los siguientes archivos (arrástralos o usa el botón Add). Asegúrate de que tengan estos nombres exactos:

*   **Imágenes:**
    *   `logodrakescraft.png`
    *   `dragon_fly.png` (El dragón volador)
    *   `bannerdrakes.jpg` (O la imagen que uses de banner)
*   **Sonidos:**
    *   `hover.mp3`
    *   `click.mp3`

## 2. Configurar CSS (Estilos)
1.  En el editor de Tebex, busca en **Assets** el archivo **`shared.css`** (o `generic.css` si prefieres).
2.  Ábrelo y borra todo su contenido.
3.  Abre en tu PC el archivo `k:\Pagina web\basetebex\tebex_global.css`.
4.  Copia todo el contenido y pégalo en el editor de Tebex (`shared.css`).
5.  Guarda.

## 3. Configurar JavaScript (Funcionalidad)
1.  En el editor de Tebex, busca en **Assets** el archivo **`main.js`**.
2.  Ábrelo y borra todo su contenido.
3.  Abre en tu PC el archivo `k:\Pagina web\basetebex\tebex_script.js`.
4.  Copia todo el contenido y pégalo en `main.js`.
5.  Guarda.

## 4. Configurar Plantilla Principal (Layout)
1.  En el editor de Tebex, ve a **Webstore -> Pages** y abre **`layout.html`**.
2.  Borra todo el contenido actual.
3.  Abre en tu PC el archivo `k:\Pagina web\basetebex\tebex_layout.html`.
4.  Copia todo el contenido y pégalo en `layout.html`.
5.  **Importante:** Este archivo ya está configurado para cargar `shared.css` y `main.js` automáticamente.

## 5. Publicar
Haz clic en **Publish** en el editor de Tebex para que los cambios se vean en tu tienda.

---
**Nota:** Si alguna imagen no carga, asegúrate de haberla subido a "Assets" con el nombre correcto. El código usa `{{ 'nombre.png' | asset_url }}` para encontrarlas automáticamente.
