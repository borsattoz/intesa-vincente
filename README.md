# intesavincente.it
[intesavincente.it](https://intesavincente.it/) è un simulatore per il browser in TypeScript de "L'intesa vincente", penultimo gioco del programma Rai [Reazione a catena](https://www.raiplay.it/programmi/reazioneacatena).

Il database delle parole (`src/words.txt`) contiene esclusivamente parole presenti in puntate andate in onda.

## Sviluppo
Installare le dipendenze:
```sh
npm i
```
Eseguire in una finestra di terminale:
```sh
npm run build-watch
```
Contemporaneamente, eseguire in un'altra finestra di terminale:
```sh
npm start
```
## Contributi
Pull request sono gradite. Si possono richiedere nuove parole nel database, purchè presenti in puntate andate in onda. Ci sono ancora alcune caratteristiche che non sono implementate, come il "raddoppio" e il "controllo remoto" del pulsante "Prenota".
