# public/ — pliki widoczne w sieci

Vite kopiuje **całą zawartość tego katalogu** do `dist/` pod adres główny.
Plik `public/lokal.jpg` będzie dostępny jako `https://caffe-martens.com/lokal.jpg`.

Katalog `data/` NIE trafia do sieci — jest wciągany do kodu podczas budowania.
Dlatego zdjęcie musi leżeć tutaj, nie tam.

## Czego potrzebuje og:image (podgląd linku na Facebooku, WhatsAppie, Signalu)

- **własne zdjęcie** — zrobione telefonem albo aparatem, do którego masz prawa.
  Zrzut z Google Street View albo Map to zdjęcie Google, nie nasze.
- **minimum 1200 × 630 px** (mniejsze Facebook pokaże jako mały kafelek albo wcale)
- **poziome**, do ~1 MB, `.jpg`

Wgraj je tutaj pod nazwą `lokal.jpg`, a potem odkomentuj `og:image` w `index.html`.
