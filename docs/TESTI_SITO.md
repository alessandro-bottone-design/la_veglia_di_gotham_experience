# Mappa del copy del sito

[Copy ufficiale](../LA_VEGLIA_DI_GOTHAM_COPY_SITO.md) · [Guida all’esperienza](ESPERIENZA.md) · [Audit Design System](AUDIT_DESIGN_SYSTEM.md)

Il copy ufficiale raccoglie stringhe visibili, nomi accessibili, annunci ed esempi di contenuto. Figma fornisce i riferimenti visivi per la loro integrazione. Usa questa mappa per risalire al punto del codice che mostra o annuncia ciascuna sezione del copy.

| Sezione del copy | Dove interviene nel sito |
| --- | --- |
| 1. Home e navigazione | Titolo e ingresso in [StartScreen](../src/features/intro/StartScreen.tsx), loghi e comandi in [Navbar](../src/components/layout/Navbar.tsx), link rapido in [App](../src/App.tsx). |
| 2. Carta del Joker | Istruzione, battute, nomi accessibili e CTA in [StorytellingScreen](../src/features/intro/StorytellingScreen.tsx). I testi illustrati fanno parte delle immagini della carta. |
| 3. Tutorial e gioco | Schede in [TutorialScreen](../src/features/intro/TutorialScreen.tsx), timer e contatore nei [componenti condivisi](../src/components/ui/DesignSystem.tsx), enigmi e opzioni in [GamificationScreen](../src/features/mission/GamificationScreen.tsx), feedback in [JokerCard](../src/features/mission/JokerCard.tsx), suggerimenti in [JokerHintSystem](../src/features/mission/JokerHintSystem.tsx) e comando video in [SkipTransitionScreen](../src/features/mission/SkipTransitionScreen.tsx). |
| 4. Pausa ed esito | Titolo in [PauseOverlay](../src/components/ui/PauseOverlay.tsx), battute, tempo residuo e azioni in [MissionResultScreen](../src/features/mission/MissionResultScreen.tsx). |
| 5. Presentazione della statua | Card, istruzione di scorrimento, testo alternativo e nomi accessibili in [ShowreelScreen](../src/features/showreel/ShowreelScreen.tsx). Titolo, descrittore, dimensioni e CTA condivisa in [statue.ts](../src/lib/statue.ts). |
| 6. Preordine | Tappe, dati demo, opzioni e riepilogo in [CheckoutScreen](../src/features/checkout/CheckoutScreen.tsx). Dati d’ordine e pulsante finale in [ThankYouScreen](../src/features/checkout/ThankYouScreen.tsx). Importo condiviso in [statue.ts](../src/lib/statue.ts). |
| 7. Caricamento, dispositivi ed errori | Schermate condivise in [DesignSystem](../src/components/ui/DesignSystem.tsx), annunci di missione in [GamificationScreen](../src/features/mission/GamificationScreen.tsx), recupero in [ErrorBoundary](../src/components/ui/ErrorBoundary.tsx) e [ShowreelScreen](../src/features/showreel/ShowreelScreen.tsx), pagina sconosciuta in [NotFoundScreen](../src/features/not-found/NotFoundScreen.tsx) e [404.html](../404.html). |
| 8. Anteprima della pagina | Titolo, descrizione per la ricerca e dati per la condivisione in [index.html](../index.html). Il titolo della 404 è impostato anche dall’ingresso [main.tsx](../src/main.tsx). |

Per una modifica al copy che riguarda importi, timer, indizi o valori del prodotto, controlla anche le rispettive sorgenti e le aspettative dei test. Verifica in browser i nomi accessibili e il formato dei valori dinamici, inclusi il tempo in formato `MM.SS`, il contatore su cinque e il prezzo visualizzato nel riepilogo e nella conferma.
