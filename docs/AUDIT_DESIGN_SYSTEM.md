# Audit del Design System

Verifica del 25 novembre 2026 su [design_system](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=0-1) e [montaggio_schermate](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=401-975). Il confronto delle schermate usa [il copy ufficiale](../LA_VEGLIA_DI_GOTHAM_COPY_SITO.md) e i flussi del prototipo React.

## Inventario verificato

| Elemento | Risultato |
| --- | --- |
| Variabili | Una raccolta, `token-colore`, con una modalità e 147 colori. Quattro primitivi, 143 valori con alias diretti o con opacità. Tutti gli alias risolvono. |
| Stili | 24 stili di testo, due stili di effetto, nessuno stile locale di riempimento o griglia. Space Grotesk e Poppins, Regular e Bold, condividono le sei coppie tipografiche 80/88, 40/48, 30/36, 20/28, 16/24 e 12/16 px. |
| Libreria | 21 sezioni, 27 set, 201 componenti di cui 125 varianti e 770 istanze. |
| Montaggio | Cinque frame principali da 1920 × 1060, cinque istanze autonome e un documento incorporato. I frame mostrano pausa, home, caricamento, 404 e avviso mobile. Le istanze autonome mostrano i tre pannelli dello showreel, il suo finale e il pannello di transizione. |
| Collegamenti | In entrambe le pagine, zero istanze senza master, zero font mancanti e zero testi non vuoti visibili privi di stile. I riempimenti solidi visibili dei livelli UI sono collegati a variabili o stili. I 26 bordi rilevati senza alias appartengono ai contenitori dei set. |
| Interazione | Zero punti di partenza e zero reazioni di navigazione rilevate. Timer, pause, scroll, media e passaggi checkout si verificano nell’implementazione. |

### Contrasto

Sui pannelli pieni `#010013`, il contrasto calcolato è 14,81:1 per giallo `#FFD700`, 5,07:1 per viola `#A64DFF` e 19,73:1 per bianco `#FAF9F6`. Il nero sui fondi di stato giallo e viola ha gli stessi rapporti. I valori descrivono i colori piatti, mentre sui video e sui fotogrammi la leggibilità dipende dalla scena, dal pannello e dalla transizione. Gli stati disabilitati della libreria usano opacità del 40%.

## Rilievi e azioni

| Priorità | Schermata o componente | Rilievo e azione |
| --- | --- | --- |
| Alta | Riferimenti Figma del sito | Dei 50 ID distinti precedentemente usati nel codice, 34 non risolvono più. Dopo l’aggiornamento, tutti i 59 ID distinti del codice e del catalogo asset risolvono. |
| Alta | [Specifica incorporata](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=402-990) | La specifica riporta il nome, vari testi e nodi di una revisione precedente. Il sito usa il copy ufficiale, mentre la [mappa del codice](TESTI_SITO.md) e i riferimenti in questo audit seguono il file attuale. |
| Alta | [Tutorial](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=389-8587) | I tre stati Figma riuniscono titolo, istruzione e controlli nella stessa card. Il sito usa una card in quattro tappe, con avanti all’inizio, entrambe le frecce nelle tappe intermedie e avvio della missione in fondo. Il focus segue il controllo disponibile. |
| Alta | [Checkout](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=395-14438), [carta selezionata](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=392-14025) | Le card Figma contengono segnaposto. Il sito usa le tre varianti per quattro tappe, con valori di esempio in sola lettura, PayPal preselezionato, carta simulata e riepilogo a 12.900 €. La scelta della carta amplia il pannello e dispone i campi su due colonne quando c’è spazio. Entrando dallo showreel, il focus resta sul titolo della prima tappa. |
| Media | [Navbar](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=395-14599), [progressione](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=395-14486) | Altezza di riferimento a 146 px e scheda indizi a 191 × 93 px. La navbar usa overlay trasparente, mentre gli adattamenti a larghezza ridotta ridimensionano la barra in base al contenuto. Il titolo adotta il copy «INDIZI RACCOLTI». |
| Media | [Storytelling](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=389-10414) | Fronte e retro sono varianti separate. L’illustrazione già locale corrisponde alle esportazioni Figma. La carta del racconto riprende le proporzioni dei nuovi master e il testo in Poppins Regular 16/24. Gli indizi in scena mantengono le proprie varianti. |
| Media | [Showreel](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=395-14838) | I pannelli tornano al contorno da 2 px, al raggio da 25 px, al bagliore giallo e a testi di riferimento in Space Grotesk Bold e Poppins Bold. I tre slot e il finale puntano al montaggio corrente. Il contenuto effettivo, le dissolvenze e il percorso a movimento ridotto si verificano nel sito. |
| Media | [Transizione](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=406-3223) | Il controllo riprende raggio, pannello e colori viola della card. Usa l’unico testo visibile approvato, «Vai alla prossima area». La descrizione dell’area resta accessibile e il flusso può proseguire se il video non parte. |
| Media | [Conferma](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=243-3817), [404](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=401-976), [avviso mobile](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=402-2762) | Allineate le dimensioni di riferimento delle card e i contorni. La conferma usa i cinque dettagli del copy e l’impaginazione si adatta al testo e alla finestra. |
| Bassa | [Caricamento](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=395-14845) | La sezione ha un refuso nel nome. I due effetti locali senza stile rilevati sono sul vettore animato e sulla relativa istanza. Sul sito il vettore usa il giallo del Design System e il caricamento rispetta la preferenza di movimento ridotto. |
| Bassa | [Selezione pagamento](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=392-14027), [montaggio](https://www.figma.com/design/HNqMZbAGUnygNJu9kVJzOc/la_veglia_di_gotham_experience_design_system?node-id=401-975) | Il set della carta di credito ha uno spazio di tabulazione iniziale nel nome. I cinque frame principali hanno nomi generici. I collegamenti dal sito usano gli ID verificati. |

## Mappa dei componenti

Gli ID si possono aprire nel file Figma come parametro `node-id`, sostituendo i due punti con un trattino.

| Area | Sezioni e riferimenti |
| --- | --- |
| Basi | Colori `395:14601`, tipografia `395:14600`, pulsanti `239:3234`, pulsanti icona `11:314`, icone `22:265`, cursore `49:499` |
| Ingresso | Home `403:2924` e stack `402:2773`, racconto `395:15070`, retro/fronte `389:10412` e `389:10413`, tutorial `395:14910` e varianti `389:8586`, `389:8585`, `389:8584` |
| Missione | Barra `395:14599`, timer `239:3081`, progresso `395:14486`, indizi `395:14849`, pulsanti risposta `239:3359`, pausa `402:2857`, vittoria `302:1252`, sconfitta `302:1251`, transizione `406:3223` |
| Prodotto | Card `241:3517`, montaggi `404:3118`, `404:3133`, `404:3140` e finale `404:3125` |
| Preordine | Checkout `395:15069`, dati `395:14435`, pagamento `395:14436`, riepilogo `395:14437`, input `246:3963`, conferma `243:3817` |
| Stato e recupero | Caricamento `395:14845` e stack `359:3826`, errore `401:976`, avviso mobile `402:2762` |

L’[inventario degli asset](figma/assets.json) registra i file web e le dimensioni originali. Le scene 3D, i filmati, la sequenza a scorrimento e le schermate di recupero seguono le specifiche del prototipo e i limiti del browser.

## Verifiche sul prototipo

Sono stati confrontati con le esportazioni correnti i checksum di 12 asset attivi, tra loghi, icone, cursore e illustrazioni della carta. Le misure del tutorial, delle card di preordine e dell’area showreel sono state controllate nella viewport desktop da 1920 × 1060. La carta selezionata mantiene avanti visibile su desktop e passa a una colonna a 520 px.

La verifica locale ha coperto 78 casi su Chromium, Firefox e WebKit. Dopo l’ultimo adeguamento del layout carta sono stati ripetuti il controllo statico, la build del sito e della fixture, e nove esecuzioni mirate su checkout e conferma.
