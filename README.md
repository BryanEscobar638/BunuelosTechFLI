# Buñuelos Tech 🍩

Calendario responsivo para saber **a quién le toca traer buñuelos** los martes y viernes.

HTML, CSS y JavaScript puro. Sin dependencias, sin build, sin frameworks: abres `index.html` y ya.

## Estructura

```
.
├── index.html   → estructura y contenido
├── styles.css   → estilos, paleta y responsive
├── app.js       → CONFIG, cálculo de la rotación y render
└── README.md
```

## Cómo funciona

- La rotación es de 6 personas: **Alejandro → Isaac → Bryan → Solano → Jorge → Frank**.
- Solo cuentan los **martes y viernes** (2 eventos por semana).
- La asignación no está escrita a mano: sale de una **fecha ancla** (martes 27 de octubre
  de 2026 → Solano) y se calcula por semanas. Como son 6 personas y 2 días por semana,
  el patrón se va desfasando solo mes con mes.
- Arriba siempre se ve **“El próximo en traer es …”** con fecha y cuenta regresiva
  (`mañana`, `en 3 días`, `¡es hoy!`).
- Debajo va la **tira de turnos**: el orden empezando por quien sigue, con el chip de color
  relleno para el próximo turno y un `↺` al final que indica que el ciclo se repite.
  En móvil se desliza horizontalmente.
- El calendario resalta **hoy** (borde naranja) y marca el **próximo evento** con un punto.

## Cambiar nombres o la fecha de inicio

Todo vive en el objeto `CONFIG` al inicio de `app.js`:

```js
const CONFIG = {
  people: [
    { name: 'Alejandro', color: '#D9480F' },
    { name: 'Isaac',     color: '#0C8599' },
    { name: 'Bryan',     color: '#5F3DC4' },
    { name: 'Solano',    color: '#C2255C' },
    { name: 'Jorge',     color: '#2F9E44' },
    { name: 'Frank',     color: '#1971C2' },
  ],
  anchor: { year: 2026, month: 10, day: 27 }, // martes 27 oct 2026
  anchorPersonIndex: 3,                        // 0=Alejandro … 3=Solano
  eventWeekdays: [2, 5],                       // 2=martes, 5=viernes
  upcomingCount: 6,                            // filas en "Próximas fechas"

  // Excepciones: un día suelto que se mueve de fecha
  overrides: {
    '2026-11-23': 'Isaac', // lunes 23 nov (en lugar del martes 24)
    '2026-11-25': 'Bryan', // miércoles 25 nov (en lugar del viernes 27)
  },
  // Días sin buñuelos porque su turno se movió
  skipped: ['2026-11-24', '2026-11-27'],
};
```

Si alguien entra o sale del equipo, actualiza `people` y ajusta `anchor` +
`anchorPersonIndex` a una fecha en la que sepas con certeza a quién le tocaba.
El número de integrantes puede cambiar: el ciclo se adapta solo.

## Fechas movidas

`overrides` sirve para días que no caen en martes/viernes o que se recorren por vacaciones,
puentes o eventos. Van con formato `'AAAA-MM-DD': 'Nombre'`.

- El día se pinta en el calendario con **borde punteado y la etiqueta “movido”**, y en
  “Próximas fechas” aparece con el badge **TURNO MOVIDO**.
- `skipped` quita los días originales para que nadie traiga dos veces esa semana.
- **La rotación no se altera**: el ciclo de martes y viernes sigue igual la semana
  siguiente. Los turnos movidos no consumen lugar en el ciclo, así que la persona que
  habría tocado ese martes/viernes simplemente no trae esa semana.

> Con 6 personas, el turno natural de esa semana sería de Frank (mar 24) y Alejandro
> (vie 27). Como los días movidos quedaron asignados a Isaac y Bryan a mano, ellos
> vuelven a aparecer el 1 y el 4 de diciembre. Si prefieres que la semana se mueva
> siguiendo la rotación, cambia `overrides` a `Frank` y `Alejandro`.

## Paleta

Base cálida tipo buñuelo (crema `#FDF6EC`, canela `#C2410C`) y un color por persona
para reconocerlos de un vistazo:

| Persona   | Color     | Hex       |
| --------- | --------- | --------- |
| Alejandro | naranja   | `#D9480F` |
| Isaac     | teal      | `#0C8599` |
| Bryan     | violeta   | `#5F3DC4` |
| Solano    | frambuesa | `#C2255C` |
| Jorge     | verde     | `#2F9E44` |
| Frank     | azul      | `#1971C2` |

## Responsive

- **Escritorio / tablet:** nombre completo en cada día del calendario.
- **Móvil:** el chip se vuelve un círculo con la inicial (A, I, B, S, J) para que
  quepan las 7 columnas; la lista de próximas fechas conserva el nombre completo.

## Publicar en GitHub Pages

`Settings → Pages → Source: Deploy from a branch → main / (root)`.

Queda en `https://bryanescobar638.github.io/BunuelosTechFLI/`.
