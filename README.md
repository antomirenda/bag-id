# Digital Bag ID per GitHub Pages

Progetto statico, bilingue e privacy-first per una targhetta fisica con QR code destinata a una valigia. Il sito permette a chi trova la valigia di inviare un messaggio al proprietario senza vedere dati personali del proprietario.

## Privacy

GitHub Pages è pubblico: chi possiede l'URL può visitare la pagina. Per questo motivo il repository non deve contenere data di nascita, indirizzo, numero di telefono, WhatsApp, email personale, credenziali, token o altri dati sensibili del proprietario.

Il file `assets/js/config.js` contiene solo dati pubblici:

```js
const CONFIG = {
  bagId: "AM-7K42",
  siteUrl: "https://antomirenda.github.io/bag-id/bag/?id=AM-7K42",
  formEndpoint: "INSERIRE_ENDPOINT_FORMSPREE",
  defaultLanguage: "it"
};
```

Il Bag ID non viene mostrato come testo nella pagina principale o sulla targhetta stampabile. Rimane nel file di configurazione, nell'URL del QR e nei dati inviati dal form, così il proprietario può riconoscere la segnalazione ricevuta.

## Struttura del progetto

```text
/
├── index.html
├── tag.html
├── 404.html
├── robots.txt
├── manifest.json
├── README.md
├── .gitignore
├── bag/
│   └── index.html
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── app.js
    │   ├── config.js
    │   ├── qrcode.min.js
    │   └── tag.js
    └── icons/
        └── suitcase.svg
```

## 1. Crea il repository GitHub

1. Accedi a GitHub.
2. Crea un nuovo repository.
3. Scegli un nome generico, ad esempio `bag-id`.
4. Lascia il repository pubblico se vuoi usare GitHub Pages gratuito.
5. Non aggiungere dati personali nel nome del repository.

## 2. Carica i file

Carica tutti i file e le cartelle di questo progetto nel repository, mantenendo la stessa struttura.

## 3. Attiva GitHub Pages

1. Apri il repository su GitHub.
2. Vai su `Settings`.
3. Apri `Pages`.
4. In `Build and deployment`, scegli `Deploy from a branch`.
5. Seleziona il branch principale, di solito `main`.
6. Seleziona la cartella `/root`.
7. Salva.

## 4. Ottieni l'URL finale

Dopo qualche minuto GitHub mostra l'URL pubblico del sito:

```text
https://antomirenda.github.io/bag-id/
```

Per il QR usa l'URL con percorso dedicato e identificativo in query string:

```text
https://antomirenda.github.io/bag-id/bag/?id=AM-7K42
```

## 5. Modifica `siteUrl`

`assets/js/config.js` è già impostato con:

```js
siteUrl: "https://antomirenda.github.io/bag-id/bag/?id=AM-7K42"
```

Il QR in `tag.html` viene generato da questo valore.

## 6. Configura Formspree

1. Vai su Formspree.
2. Crea un nuovo form.
3. Imposta nel pannello Formspree l'email personale del proprietario come destinatario delle notifiche.
4. Non inserire l'email personale nel repository, nei file HTML, nel CSS, nel JavaScript o nei commenti.

## 7. Recupera l'endpoint Formspree

Formspree fornisce un endpoint simile a:

```text
https://formspree.io/f/ID_DEL_FORM
```

Questo endpoint può essere pubblico perché non contiene direttamente l'email personale.

## 8. Inserisci l'endpoint in `config.js`

Apri `assets/js/config.js` e sostituisci:

```js
formEndpoint: "INSERIRE_ENDPOINT_FORMSPREE"
```

con l'endpoint ricevuto da Formspree:

```js
formEndpoint: "https://formspree.io/f/ID_DEL_FORM"
```

## 9. Testa il form

1. Apri la pagina pubblica del sito.
2. Seleziona `Tipo di luogo`.
3. Compila `Dove hai trovato la valigia?`.
4. Compila `Messaggio`.
5. Compila `Nome di chi ha trovato la valigia`.
6. Seleziona `Come preferisci essere ricontattato?`.
7. Compila `Contatto di chi ha trovato la valigia`.
8. Spunta la checkbox privacy.
9. Premi `INVIA AL PROPRIETARIO`.
10. Verifica nel pannello Formspree e nella casella configurata che il messaggio sia arrivato.

## 10. Testa la geolocalizzazione

1. Apri il sito da telefono o da browser desktop.
2. Premi `CONDIVIDI POSIZIONE DEL RITROVAMENTO`.
3. Autorizza la posizione solo per il test.
4. Verifica che nella pagina compaiano le coordinate condivise.
5. Verifica che compaia il link `Apri posizione su Google Maps`.
6. Invia un messaggio di test.
7. Verifica che nel messaggio ricevuto su Formspree compaiano latitudine, longitudine e link Google Maps.
8. Ripeti negando il permesso e verifica che il form resti utilizzabile senza posizione.

La posizione riguarda esclusivamente chi trova la valigia e decide di condividerla.

## 11. Apri `tag.html`

Apri:

```text
https://antomirenda.github.io/bag-id/tag.html
```

La pagina mostra fronte e retro della targhetta. Il fronte contiene il QR generato da `CONFIG.siteUrl`, senza stampare il Bag ID come testo.

## 12. Verifica il QR

1. Prima di stampare, assicurati che `siteUrl` punti alla pagina pubblica corretta.
2. Apri `tag.html`.
3. Inquadra il QR con un telefono.
4. Verifica che apra l'URL:

```text
https://antomirenda.github.io/bag-id/bag/?id=AM-7K42
```

## 13. Stampa il portanome

1. Apri `tag.html`.
2. Premi `STAMPA PORTANOME`.
3. Nella finestra di stampa scegli scala 100%.
4. Disattiva intestazioni e piè di pagina del browser.
5. Stampa su supporto adatto o su carta da inserire in una targhetta.

Le dimensioni iniziali sono 85 mm × 54 mm. Puoi cambiarle in `assets/css/style.css` modificando:

```css
:root {
  --tag-width: 85mm;
  --tag-height: 54mm;
}
```

## 14. Testa con iPhone e Android

1. Apri la fotocamera del telefono.
2. Inquadra il QR stampato o visualizzato su schermo.
3. Tocca il link rilevato.
4. Verifica che la pagina sia leggibile, che il selettore IT/EN funzioni e che il form si possa compilare.

## 15. Dominio personalizzato

Puoi collegare un dominio personalizzato da `Settings` → `Pages` → `Custom domain`. Dopo aver configurato il dominio, aggiorna `siteUrl` in `assets/js/config.js` usando il nuovo URL completo del percorso Bag ID.

## WhatsApp

Non è stato inserito alcun link WhatsApp nel frontend, perché un link diretto esporrebbe il numero nel codice pubblico.

Per un contatto WhatsApp realmente privato serve un backend o una funzione serverless che riceva la segnalazione dal browser e inoltri il messaggio senza restituire il numero al frontend. Anche in quel caso il numero deve essere salvato solo come segreto del backend, mai nel repository pubblico.

## Checklist prima della stampa

1. `siteUrl` contiene l'URL finale con `/bag/?id=AM-7K42`.
2. `formEndpoint` contiene l'endpoint Formspree.
3. Il form invia correttamente un messaggio.
4. Il QR apre la pagina corretta.
5. La pagina funziona in italiano e inglese.
6. La geolocalizzazione funziona solo dopo pressione del pulsante.
7. La geolocalizzazione gestisce anche il permesso negato.
8. La stampa mantiene la targhetta a 85 mm × 54 mm.
9. Nessun dato personale del proprietario è presente nel repository.
