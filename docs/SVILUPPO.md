# Sviluppo e manutenzione

[Indice del progetto](../README.md) · [Guida all’esperienza](ESPERIENZA.md) · [Procedura di rilascio](PUBBLICAZIONE.md) · [Audit Design System](AUDIT_DESIGN_SYSTEM.md)

## Mappa del repository

| Percorso | Contenuto |
| --- | --- |
| [`src/main.tsx`](../src/main.tsx), [`src/App.tsx`](../src/App.tsx) | Ingresso React, pagina 404, compatibilità desktop, composizione e navigazione dell’esperienza. |
| [`src/features/`](../src/features) | Schermate per introduzione, missione, showreel, checkout e 404. |
| [`src/components/`](../src/components) | Elementi condivisi di layout e interfaccia, inclusi navbar, fondale della Batcaverna e componenti del Design System. |
| [`src/lib/`](../src/lib), [`src/hooks/`](../src/hooks) | Macchina a stati, audio, dati del prodotto e compatibilità del dispositivo. Il timer vive con la [missione](../src/features/mission/useMissionTimer.ts). |
| [`src/index.css`](../src/index.css), [`src/styles/`](../src/styles) | Ingresso CSS condiviso tra sito e fixture, con token, componenti, layout e stili delle schermate in fogli separati. |
| [`public/assets/`](../public/assets) | Media statici serviti agli URL `/assets/…`. |
| [`tests/`](../tests) | Test unitari, test Playwright e fixture del Design System. |
| [`scripts/`](../scripts) | Avvio della build locale su macOS e manutenzione dei fotogrammi statici delle panoramiche. |
| [`docs/`](.) | Guide, dossier, audit e inventario degli asset Figma. |
| [`LA_VEGLIA_DI_GOTHAM_COPY_SITO.md`](../LA_VEGLIA_DI_GOTHAM_COPY_SITO.md) | Testi ufficiali visibili e accessibili, messaggi di errore e metadati. |
| [`.github/workflows/`](../.github/workflows), [`vercel.json`](../vercel.json) | Verifiche GitHub Actions e impostazioni di build e rilascio. |

`node_modules/`, `dist/`, `artifacts/`, `playwright-report/` e `test-results/` sono directory generate. I file `.env*` e la configurazione locale `.vercel/` sono esclusi da Git.

## Architettura

- **Navigazione**. React e TypeScript gestiscono una sola esperienza lato client. L’[experience reducer](../src/lib/experience.ts) definisce le transizioni di missione e conserva l’ordine demo in memoria. Le sole destinazioni dirette del percorso sono `/`, `/#statua`, `/#checkout` e `/#conferma`, con conferma subordinata a un ordine valido. [`404.html`](../404.html) è un ingresso dedicato di Vite per gli URL inesistenti.
- **Scena 3D**. Three.js proietta le panoramiche all’interno di una sfera, con una camera prospettica. Il fondale decorativo usa un’inquadratura fissa e la missione usa React Three Fiber per la camera interattiva e le carte nello spazio. La navbar trasparente è sovrapposta alla scena. Le [regole di rendering](../AGENTS.md) valgono anche quando si modifica un fallback.
- **Media della missione**. I JPG equirettangolari di `textures/` mostrano subito la scena nella sfera. I video H.264 a 25 fps subentrano quando partono. Con movimento ridotto o riproduzione indisponibile resta la texture JPG. Il canvas aggiorna la proiezione al movimento della camera, all’arrivo di un fotogramma o quando cambia il viewport. `BatCaverna_BatcomputerPerspective.jpg` è il fondale statico dell’interfaccia su touch o quando il contesto WebGL è assente. Se il rendering interattivo non si avvia, la missione offre un recupero e sospende il timer.
- **Showreel**. [`scrollSequence.ts`](../src/features/showreel/scrollSequence.ts) carica i fotogrammi e li disegna in un canvas 2D con ritaglio centrato. La scena resta fissata alla viewport durante lo scroll. [`ShowreelScreen.tsx`](../src/features/showreel/ShowreelScreen.tsx) usa la progressione per le dissolvenze, mostra il poster statico e gestisce gli stati di caricamento. Gli 800 WebP sono numerati da `0001.webp` a `0800.webp`. La riproduzione omette `0651.webp`–`0734.webp` per evitare il passaggio quasi vuoto tra il dettaglio e la ripresa finale. Il caricatore limita le richieste concorrenti a sei, conserva fino a 48 immagini e ripiega sul fotogramma disponibile più vicino nel capitolo o sull’ultima immagine già disegnata.
- **Missione**. Il timer misura un minuto effettivo e si ferma durante caricamenti, pausa manuale e transizioni. Conta la raccolta delle carte fino all’atterraggio della quinta. Gli aiuti del Joker seguono soglie di 20, 30 e 40 secondi di ricerca della carta da trovare. La scena e il contenuto degli enigmi sono definiti in [`GamificationScreen.tsx`](../src/features/mission/GamificationScreen.tsx). [Timer](../src/features/mission/useMissionTimer.ts) · [Aiuti del Joker](../src/features/mission/useJokerHint.ts)
- **Checkout**. I valori di esempio sono in sola lettura. [`statue.ts`](../src/lib/statue.ts) fornisce prezzo, titolo e formattazione condivisi da presentazione, riepilogo e conferma. Il checkout simula quattro secondi di elaborazione, previene invii ripetuti e annulla l’attesa quando si lascia la pagina. L’ordine in memoria contiene quantità e totale. La scelta del metodo di pagamento rimane nello stato della schermata. Vercel Analytics è montato a livello applicazione. [Checkout](../src/features/checkout/CheckoutScreen.tsx) · [Conferma](../src/features/checkout/ThankYouScreen.tsx)

### Asset e stili

| Directory sotto `public/assets/` | Contenuto e uso |
| --- | --- |
| `textures/` | Copertina della home e media per Batcomputer, Armeria e Batmobile. Le sorgenti a 360° sono equirettangolari e richiedono proiezione sferica. |
| `videos/` | Due video di passaggio tra le aree della missione. |
| `showreel/` | Sequenza WebP della statua, compreso il fotogramma finale usato come poster. |
| `audio/` | Sigla e risata del Joker, usate dal gestore Web Audio per musica e feedback. |
| `ds/` e `fonts/` | Loghi, icone, carte, indicatori e font locali del Design System. |

L’ingresso CSS mantiene l’ordine della cascata. Modifica i token e il reset in `base.css`, i componenti condivisi in `design-system.css` e le regole della schermata nel foglio corrispondente. `responsive.css` raccoglie gli adattamenti trasversali. Gli attributi `data-figma-node` collegano il codice a un riferimento Figma. Per il percorso completo consulta anche l’audit e l’inventario degli asset. [Audit](AUDIT_DESIGN_SYSTEM.md) · [Inventario degli asset esportati](figma/assets.json)

Per aggiornare il testo di una schermata usa il copy ufficiale per messaggi, metadati e nomi accessibili. La mappa del copy indica dove intervenire e quali contenuti sono composti a runtime. [Copy ufficiale](../LA_VEGLIA_DI_GOTHAM_COPY_SITO.md) · [Mappa del copy](TESTI_SITO.md)

## Comandi e verifiche

GitHub Actions usa Node.js 24 e Playwright su Chromium, Firefox e WebKit. Parti con `npm ci`.

| Comando | Uso |
| --- | --- |
| `npm run dev` | Sviluppo su `http://127.0.0.1:3000`. |
| `npm run check` | TypeScript, ESLint, test unitari e build Vite. |
| `npm run build` e `npm run preview` | Build in `dist/` e anteprima HTTP su `http://127.0.0.1:4173`. |
| `npm run build:ds-fixture` | Build della pagina isolata per i test dei componenti in `artifacts/fixtures/ds/`. |
| `./node_modules/.bin/playwright install` | Installa i browser Playwright. In CI sono installati con le dipendenze di sistema. |
| `npm run test:e2e` | Test di flusso e componenti. Esegui prima build del sito e della fixture. |
| `npm run test:e2e -- --project=chromium` | Esegue un solo motore per una verifica mirata. |

Playwright può avviare autonomamente i server delle build. Per puntare a un’anteprima già in esecuzione, imposta `BASE_URL` con l’origine HTTP desiderata. La fixture rimane separata sulla porta 4300. Trovi i report in `artifacts/playwright-report/` e le evidenze dei fallimenti in `artifacts/test-results/`. In CI i risultati vengono allegati al workflow.

### Diagnostica rapida

- Se **la build aperta da Finder resta vuota**, avviala via HTTP con `npm run preview` o con il launcher macOS. [Strumenti di manutenzione](../scripts/README.md)
- Per un **percorso di sviluppo con `:` nel nome**, la configurazione rilassa il controllo del filesystem di Vite per quella copia locale. Il server di sviluppo è accessibile su `127.0.0.1`.
- Se **la missione non carica**, prova un browser desktop con WebGL 2 e accelerazione grafica. Controlla nel pannello Network che video e JPG della scena rispondano. Il caricamento e l’errore sospendono il timer.
- Se **lo showreel non parte**, verifica che `/assets/showreel/0001.webp` e i file adiacenti siano presenti. Prova anche un salto a fine sequenza e il ritorno all’inizio.
- Se **i test non trovano la fixture**, esegui `npm run build:ds-fixture`. Controlla che le porte 4173 e 4300 siano libere e che i browser Playwright siano installati.
- Per **aggiornare i JPG**, `node scripts/extract-frame.mjs` rigenera le tre texture statiche e la vista prospettica del Batcomputer. Usa FFmpeg con il filtro `v360` e verifica la proiezione in gioco. [Strumenti di manutenzione](../scripts/README.md)
