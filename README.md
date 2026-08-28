# Bag ID Recovery

Sito statico per GitHub Pages collegato a un piccolo backend con database. Chi trova la valigia scansiona il QR, compila il modulo e la segnalazione viene salvata in un archivio consultabile dal proprietario.

## Link principali

- Pagina pubblica del QR: `https://antomirenda.github.io/bag-id/bag/?id=AM-7K42`
- Portanome stampabile: `https://antomirenda.github.io/bag-id/tag.html`
- Pannello segnalazioni: `https://antomirenda.github.io/bag-id/admin.html`
- Backend segnalazioni: `https://bag-id-recovery.pro-loco-san-2036.chatgpt.site/api/reports`

## Privacy

Il repository GitHub Pages è pubblico. Per questo motivo non contiene email, telefono, WhatsApp, indirizzo, data di nascita, credenziali, token o altri dati personali del proprietario.

Il Bag ID non viene mostrato come testo nella pagina pubblica o sulla targhetta. Rimane nel file di configurazione, nell'URL del QR e nei dati inviati dal form, così la segnalazione può essere associata alla valigia.

Il codice privato del pannello admin non è salvato in questo repository. È configurato come segreto del backend.

## Struttura

```text
/
├── index.html
├── bag/
│   └── index.html
├── admin.html
├── tag.html
├── 404.html
├── manifest.json
├── robots.txt
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── icons/
│   │   └── suitcase.svg
│   └── js/
│       ├── admin.js
│       ├── app.js
│       ├── config.js
│       ├── qrcode.min.js
│       └── tag.js
└── README.md
```

## Come funziona

1. Il QR apre sempre `https://antomirenda.github.io/bag-id/bag/?id=AM-7K42`.
2. Chi trova la valigia compila i campi obbligatori: luogo, messaggio, nome, metodo di contatto e contatto.
3. La posizione GPS viene aggiunta solo se la persona preme il pulsante e autorizza il browser.
4. Il modulo salva la segnalazione nel backend.
5. Il proprietario apre `admin.html`, inserisce il codice privato e vede le segnalazioni ricevute.

## Configurazione pubblica

Il file `assets/js/config.js` contiene solo valori pubblici:

```js
const CONFIG = {
  bagId: "AM-7K42",
  siteUrl: "https://antomirenda.github.io/bag-id/bag/?id=AM-7K42",
  formEndpoint: "https://bag-id-recovery.pro-loco-san-2036.chatgpt.site/api/reports",
  defaultLanguage: "it"
};
```

## Pannello admin

Da `admin.html` si possono vedere:

- data della segnalazione;
- luogo;
- messaggio;
- nome di chi ha trovato la valigia;
- metodo di contatto;
- contatto;
- posizione Google Maps, se condivisa;
- stato della segnalazione: nuova, vista o risolta.

Il pannello richiede il codice privato impostato nel backend. Non pubblicare questo codice nel repository.

## Stampa del portanome

1. Apri `tag.html`.
2. Premi `STAMPA PORTANOME`.
3. Stampa al 100%.
4. Disattiva intestazioni e piè di pagina del browser.
5. Inquadra il QR con un telefono e verifica che apra la pagina pubblica del QR.

Le dimensioni iniziali sono 85 mm x 54 mm e sono definite in `assets/css/style.css`.

## Controlli finali

- Il QR continua a usare lo stesso link.
- Il Bag ID non è visibile nella pagina o sulla targhetta.
- Il form salva le segnalazioni nel backend.
- Il pannello admin legge le segnalazioni solo con codice privato.
- La geolocalizzazione resta opzionale e su richiesta.
