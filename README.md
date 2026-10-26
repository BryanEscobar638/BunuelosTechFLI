# Buñuelos Tech 🍩

Calendario responsivo para saber **a quién le toca traer buñuelos** los martes y viernes.

Hecho con HTML, CSS y JavaScript puro (sin dependencias ni build). Basta con abrir `index.html`.

## Cómo funciona

- La rotación es de 5 personas: **Alejandro → Isaac → Bryan → Solano → Jorge**.
- Solo cuentan los **martes y viernes**.
- La asignación no está escrita a mano: se calcula por fecha ancla, así el ciclo se va
  desfasando solo con el paso de las semanas (2 eventos por semana, 5 personas → el patrón
  cambia cada mes).
- Arriba se muestra siempre **“El próximo en traer es …”** con la fecha y la cuenta regresiva.

## Cambiar nombres o la fecha de inicio

Al inicio del `<script>` de `index.html` está el objeto `CONFIG`:

```js
const CONFIG = {
  people: [
    { name: 'Alejandro', color: '#D9480F' },
    // ...
  ],
  anchor: { year: 2026, month: 10, day: 27 }, // martes 27 oct 2026
  anchorPersonIndex: 3,                        // 0=Alejandro … 3=Solano
  eventWeekdays: [2, 5],                       // 2=martes, 5=viernes
  upcomingCount: 6,
};
```

Si alguien entra o sale del equipo, actualiza `people` y ajusta `anchor`/`anchorPersonIndex`
a una fecha en la que sepas con certeza a quién le tocaba.

## Paleta

Base cálida tipo buñuelo (crema `#FDF6EC`, canela `#C2410C`) y un color por persona:

| Persona   | Color           |
| --------- | --------------- |
| Alejandro | `#D9480F`       |
| Isaac     | `#0C8599`       |
| Bryan     | `#5F3DC4`       |
| Solano    | `#C2255C`       |
| Jorge     | `#2F9E44`       |

## Publicar en GitHub Pages

`Settings → Pages → Source: Deploy from a branch → main / (root)`.
El sitio queda en `https://bryanescobar638.github.io/BunuelosTechFLI/`.
