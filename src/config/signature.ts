/**
 * TEMPORARY signature placeholder — an original, hand-built flourish, NOT Sameer's real signature.
 * To replace: paste the real signature's SVG <path d="..."> strings into `strokes`, in drawing order,
 * and set `viewBox` to the SVG's viewBox. The loader reads only this file.
 */
export const SIGNATURE = {
  viewBox: '0 0 520 260',
  strokes: [
    'M118 62 C96 34 54 48 62 80 C70 110 124 118 112 158 C102 190 56 192 38 164',
    'M200 128 C176 110 146 128 148 156 C150 184 186 180 196 140 C194 166 198 180 218 172',
    'M226 176 C228 150 232 130 240 130 C250 130 244 168 250 168 C258 168 258 134 268 134 C278 134 270 170 278 170 C288 170 290 150 300 150',
    'M318 156 C348 150 352 124 330 126 C306 128 304 176 332 176 C346 176 354 166 358 160',
    'M372 156 C402 150 406 124 384 126 C360 128 358 176 386 176 C400 176 408 166 414 156',
    'M424 176 C426 152 430 134 436 134 C440 134 438 150 450 142 C460 136 468 130 480 128',
    // final accent stroke (underline flourish)
    'M30 214 C150 196 330 232 490 204',
  ],
  accentStrokes: [] as number[],
} as const
