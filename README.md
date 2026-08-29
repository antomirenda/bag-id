# Bag ID Recovery

Sito statico per GitHub Pages collegato a un piccolo backend con database. Chi trova la valigia scansiona il QR, compila il modulo e la segnalazione viene salvata in un archivio consultabile dal proprietario.

## Link principali

- Pagina pubblica del QR: `https://antomirenda.github.io/bag-id/bag/?id=AM-7K42`
- Portanome stampabile: `https://antomirenda.github.io/bag-id/tag.html`
- Pannello segnalazioni: `https://antomirenda.github.io/bag-id/admin.html`
- Servizio privato segnalazioni/notifiche: configurato in `assets/js/config.js`

## Privacy

Il repository GitHub Pages è pubblico. Per questo motivo non contiene email, telefono, WhatsApp, indirizzo, data di nascita, credenziali, token o altri dati personali del proprietario.

Il Bag ID non viene mostrato come testo nella pagina pubblica o sulla targhetta. Rimane nel file di configurazione, nell'URL del QR e nei dati inviati dal form, così la segnalazione può essere associata alla valigia.

Il codice privato del pannello admin non è salvato in questo repository. È configurato come segreto del backend.

Il modulo contiene un controllo anti-bot visibile e un campo honeypot nascosto. Il backend verifica il controllo anti-bot prima di accettare una segnalazione.

I dati personali delle segnalazioni vengono eliminati automaticamente dopo 7 giorni: nome, contatto, messaggio e coordinate vengono sovrascritti in modo definitivo dal backend.

## Licenza e responsabilità

Questo progetto è pubblico solo per permettere il funzionamento di GitHub Pages. Non è open source.

Tutti i diritti sono riservati. Nessuno può usare, copiare, modificare, distribuire, vendere, pubblicare, ospitare o riutilizzare il codice, il design, i testi o gli asset senza autorizzazione scritta del proprietario.

Il progetto è fornito senza garanzie e il proprietario non si assume responsabilità per usi impropri, copie non autorizzate, interruzioni, errori, perdite di dati, incidenti di sicurezza o conseguenze derivanti dall'uso o dalla consultazione del codice e del sito.

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
  formEndpoint: "PRIVATE_REPORTS_ENDPOINT",
  pushEndpoint: "PRIVATE_PUSH_ENDPOINT",
  scanEndpoint: "PRIVATE_SCAN_ENDPOINT",
  pushPublicKey: "PUBLIC_WEB_PUSH_KEY",
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

Il primo accesso crea una sessione privata sul dispositivo, così non è necessario reinserire il codice a ogni apertura. Il pulsante `ESCI` elimina l'accesso salvato da quel dispositivo.

Ogni messaggio ricevuto può essere eliminato definitivamente dal pannello con `ELIMINA CONTATTO`.

Il pannello può essere installato come app sul telefono. Dopo averlo aperto con il codice privato, il pulsante `ATTIVA NOTIFICHE` registra solo quel dispositivo. Le notifiche sono generiche e non mostrano il messaggio o il contatto sulla schermata bloccata.

Il pannello si aggiorna automaticamente ogni 30 secondi mentre è aperto.

## Scansioni QR

Quando qualcuno apre il link del QR viene registrata una scansione tecnica minimale: data, dispositivo/browser, lingua, fuso orario e area approssimativa quando disponibile dal provider. Non identifica nome e cognome della persona.

Le scansioni vengono mostrate nel pannello admin e possono generare una notifica push sul dispositivo autorizzato. Le scansioni ripetute dallo stesso visitatore in pochi minuti vengono raggruppate per evitare notifiche inutili.

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
