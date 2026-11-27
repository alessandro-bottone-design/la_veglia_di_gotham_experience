# Dossier accademico — La Veglia di Gotham Experience

[Indice del progetto](../README.md) · [Guida all’esperienza web](ESPERIENZA.md) · [Sviluppo e manutenzione](SVILUPPO.md) · [Audit Design System](AUDIT_DESIGN_SYSTEM.md)

## Consegna e materiali

| Materiale | Riferimento |
| --- | --- |
| Traccia e consegna | [Google Classroom](https://classroom.google.com/u/1/c/ODA4NDg1NTU3MTQ3/a/Nzk2ODE3Nzk2MTk0/details) |
| Presentazione | [Figma Slides](https://www.figma.com/slides/lawZFub46cZaRJ38nCZN1q) |
| Libreria di progetto | [Figma · design_system](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=0-1) |
| Montaggio | [Figma · montaggio_schermate](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=401-975) |
| Testi del prototipo | [Copy ufficiale](../LA_VEGLIA_DI_GOTHAM_COPY_SITO.md) · [Mappa del copy](TESTI_SITO.md) |
| Materiali di lavoro | [Spazio di progetto ChatGPT](https://chatgpt.com/g/g-p-6a15bf741ef08191ab845e2047c91493-sitowebbatmanstatueexperience/project) |
| Prototipo web | [Sito pubblico](https://lavegliadigothamexperience.vercel.app/) · [Repository GitHub](https://github.com/alessandro-bottone-design/la_veglia_di_gotham_experience) |

## Concept e pubblico

Il progetto risponde alla consegna di un prototipo interattivo di acquisto immersivo su desktop. La Batcaverna introduce una sfida narrativa in prima persona, il superamento degli enigmi porta alla presentazione della statua e il checkout mette in scena l’ordine.

**Marco, 34 anni**, rappresenta il collezionista appassionato di DC. Il progetto assume che voglia osservare con calma forma e finitura di un oggetto da collezione e vedere con chiarezza prezzo e spedizione. La missione propone una motivazione narrativa, lo showreel dedica spazio al prodotto e il riepilogo rende esplicito il totale dimostrativo di **12.900 €** con trasporto incluso.

| Criterio | Risposta progettuale |
| --- | --- |
| Idea progettuale | Percorso desktop con un ambiente investigativo a 360°, uno showreel e un ordine simulato. |
| Buyer persona | Tono ispirato a Gotham, osservazione dei dettagli scultorei e riepilogo dei costi. |
| Bias cognitivi | Timer per l’urgenza, accesso narrativo alla statua dopo la missione, indicatori di avanzamento, presentazione dei dettagli prima del prezzo. |
| Tecniche di attenzione | Rivelazione della carta, giallo e viola con funzioni distinte, aiuti visivi e sonori, alternanza delle card e pause durante lo showreel. |
| Token | Palette e tipografia condivise dai componenti dell’interfaccia. |
| Componenti | Libreria Figma come riferimento per varianti, stati e composizione delle schermate React. |
| Istanze | Corrispondenze con le schermate web documentate nell’audit. |

Le scelte sul comportamento sono ipotesi di design. Il timer e il contatore rendono leggibile la sfida. Nel percorso narrativo lo sforzo precede la presentazione della statua. Le tappe del checkout e il progresso degli indizi indicano quanto resta da fare. La presentazione dei dettagli fornisce il contesto per il prezzo dimostrativo.

## Sistema visivo e interazione

| Token CSS | Funzione |
| --- | --- |
| `--black` | Fondo e superfici scure. |
| `--white` | Testi e contorni neutri. |
| `--yellow` | Azioni primarie, informazioni di avanzamento e feedback positivo. |
| `--purple` | Reperti del Joker, azioni secondarie e feedback di errore. |

I font sono forniti localmente. Space Grotesk caratterizza titoli, controlli e indicatori. Poppins è usato per testi descrittivi e istruzioni. Gli effetti luminosi riprendono giallo e viola con intensità diverse. Le viste della Batcaverna e lo showreel lasciano la navbar trasparente. [Token del sito](../src/styles/base.css) · [Componenti condivisi](../src/components/ui/DesignSystem.tsx)

Il fronte della carta introduttiva invita all’interazione. Il retro mostra il monologo e il pulsante di accettazione. Nella missione le carte fanno parte della scena e il feedback di risposta è associato all’indizio. Nello showreel le card alternano destra, sinistra e destra, con dissolvenze reversibili e intervalli dedicati alla sola sequenza di immagini. La sequenza resta centrata a schermo intero fino al finale.

## Dal Design System alle schermate

La pagina `design_system` contiene le sezioni per fondamenti e componenti. Il montaggio offre riferimenti visivi per le schermate composte. L’audit riporta le associazioni dettagliate e i punti in cui il sito completa i riferimenti Figma con contenuti o interazioni. [Audit Design System](AUDIT_DESIGN_SYSTEM.md)

| Parte dell’esperienza | Sezioni Figma | Implementazione web |
| --- | --- | --- |
| Avvio e introduzione | `start-screen`, `storytelling-screen`, `tutorial-screen` | `StartScreen`, `StorytellingScreen`, `TutorialScreen` |
| Navigazione e avanzamento | `navbar`, `timer`, `button-text`, `icon-button` | `Navbar` e componenti condivisi |
| Missione e stati temporanei | `card-clues`, `skip-transition-card`, `pause-screen`, `victory-defeat-screen` | `GamificationScreen`, `SkipTransitionScreen`, `PauseOverlay`, `MissionResultScreen` |
| Statua, ordine e conferma | `showreel-screen`, `checkout-screen`, `thank-you-screen` | `ShowreelScreen`, `CheckoutScreen`, `ThankYouScreen` |
| Caricamento, touch ed errore | `loading-scren`, `mobile-card-advisor`, `404-error-screen` | `LoadingScreen`, `MobileNotice`, `NotFoundScreen` |

Il checkout è una simulazione locale. Le verifiche Playwright coprono il percorso, i componenti e scenari di accessibilità selezionati con axe. La [guida tecnica](SVILUPPO.md) descrive come eseguire le verifiche e quali parti del sistema riguardano.
