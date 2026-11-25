# Guida all’esperienza

[Indice del progetto](../README.md) · [Dossier di progetto](DOCUMENTAZIONE_PROGETTO.md) · [Copy ufficiale](../LA_VEGLIA_DI_GOTHAM_COPY_SITO.md)

## Accesso e comandi

Apri il sito in un browser desktop con mouse o tastiera. L’esperienza mostra un avviso dedicato su smartphone, tablet e dispositivi rilevati con puntatore primario touch. Una finestra stretta su un desktop può comunque mostrare il sito completo.

| Comando | Uso |
| --- | --- |
| Mouse | Nella missione, sposta il puntatore verso i bordi per ruotare la visuale. Avvicinati a un indizio per fermarti e selezionarlo. |
| Frecce | Nella missione orientano la camera con il focus sulla scena. Nel checkout **←** torna alla tappa precedente e **→** avanza quando il focus è fuori dai campi. |
| Tab e Maiusc + Tab | Spostano il focus. Durante la missione puoi raggiungere gli indizi e orientare la camera verso la carta con la tastiera. |
| Invio o Spazio | Attiva il controllo a fuoco. Nel checkout **Spazio** avanza quando il focus è sul titolo della tappa. |
| Esc | Chiude la carta di un enigma aperto. Negli stati che prevedono la pausa, apre o chiude la pausa se l’evento non è già gestito dalla carta. |
| Rotella, trackpad o scorrimento da tastiera | Percorrono avanti o indietro lo showreel. |
| Pulsante audio | Attiva o silenzia musica ed effetti. L’audio può richiedere una prima interazione perché il browser ne consenta la riproduzione. |

La pausa è disponibile nelle fasi introduttive, nella missione, durante i passaggi tra le aree e nelle schermate di esito. Nello showreel, nel checkout e nella conferma resta disponibile il comando audio.

## Dalla carta del Joker alla statua

1. In home scegli **Entra nella Batcaverna**. Seleziona **Gira la carta** per rivelare il messaggio sul retro e premi **Accetta la sfida**.
2. Leggi le quattro schede del tutorial e poi premi **Inizia la missione**.
3. Cerca due carte al Batcomputer, una in Armeria e due al Batmobile. Seleziona una carta per leggere l’enigma al centro. Puoi riprovare dopo una risposta errata. Una risposta corretta fa arrivare la carta alla barra **INDIZI RACCOLTI**. Gli aiuti del Joker indicano la carta da cercare se la ricerca si prolunga.
4. Il timer parte da tre minuti di gioco effettivo. Il caricamento, la pausa, la raccolta di un indizio e i filmati di passaggio sospendono il conto alla rovescia. I filmati si possono saltare. Risolvere i primi due indizi entro 45 secondi di gioco assegna una sola volta 60 secondi aggiuntivi.
5. Al quinto indizio, **Scopri la statua** porta allo showreel. Se il tempo termina, **Riprova la missione** riporta alla schermata iniziale.

Il percorso narrativo presenta la statua dopo la vittoria. Per consultare la parte di prodotto separatamente, apri `/#statua`.

## Showreel

Lo scroll pilota una sequenza di immagini. La superficie resta centrata a schermo intero dietro la navbar trasparente, mantenendo la stessa geometria fino al finale. Per riempire la finestra, la sequenza può essere ritagliata ai bordi. Le card si alternano a destra, sinistra e destra. Fino a 760 px si allineano in basso al centro.

| Contenuto | Entrata | Piena visibilità | Uscita |
| --- | --- | --- | --- |
| Bronzo a cera persa | 3–7% | 7–24% | 24–29% |
| La posa sul gargoyle | 34–38% | 38–54% | 54–59% |
| Patina bruna | 65–69% | 69–84% | 84–89% |
| La veglia di Gotham | 93–97% | 97–100% | — |

Le percentuali si riferiscono alla corsa di scroll dello showreel. Le dissolvenze si invertono risalendo e tra una card e l’altra si vede la sequenza. **Preordina la statua** è sempre disponibile nella navbar. Nel finale diventa attivo quando il media è pronto e la dissolvenza è completa. Con movimento ridotto lo showreel mostra il fotogramma finale statico e rende subito disponibile il preordine. I testi delle tre card sono accessibili al lettore di schermo anche nella versione statica.

## Checkout dimostrativo

Da **Preordina la statua** o `/#checkout` si accede ai quattro passaggi del preordine dimostrativo. Usa i pulsanti a schermo oppure **←** e **→** per cambiare tappa quando il focus è fuori dai campi. **Spazio** avanza dal titolo della tappa.

1. **Dati personali** mostra telefono, nome, email, data di nascita e password mascherata di Bruce Wayne. I campi sono già compilati e in sola lettura.
2. **Dati di spedizione** mostra regione, provincia, città, CAP e indirizzo di esempio, sempre in sola lettura.
3. **Metodo di pagamento** propone **PayPal** come prima scelta. Seleziona **Carta di credito o debito** per vedere l’intestatario di esempio, il numero parzialmente mascherato, la scadenza e il CVV mascherati.
4. In **Riepilogo** verifica il totale di **12.900 €**, con trasporto incluso, e premi **Conferma il preordine**.

Il browser simula l’elaborazione e conserva l’ordine demo in memoria. La pagina `/#conferma` mostra il numero di esempio `ord-bw-4019`, una statua e la consegna **Da concordare**. Se apri o ricarichi `/#conferma` senza un ordine in memoria, torni allo showreel. **Torna alla home** chiude il percorso.

## Recupero

Se la missione non può inizializzare il rendering 3D, prova **Riprova** o passa alla presentazione della statua dal messaggio di recupero. Se la sequenza dello showreel non è disponibile, puoi ritentare il caricamento o proseguire dalla navbar. Da una pagina inesistente, **Torna alla home** riporta a `/`.
