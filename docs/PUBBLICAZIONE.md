# Pubblicazione su GitHub e Vercel

[Indice del progetto](../README.md) · [Sviluppo e manutenzione](SVILUPPO.md)

Il repository GitHub conserva il codice e i risultati della CI. Il dominio pubblico su Vercel punta al deployment promosso. La configurazione disattiva i deploy Git automatici da `main`. Il merge precede quindi il rilascio sul dominio pubblico. [Repository](https://github.com/alessandro-bottone-design/la_veglia_di_gotham_experience) · [Dashboard Vercel](https://vercel.com/abd-esign1/la_veglia_di_gotham_experience) · [Configurazione Git di Vercel](https://vercel.com/docs/project-configuration/git-configuration#gitdeploymentenabled)

## 1. Pull request e merge su GitHub

1. Crea un branch da `main`, committa le modifiche del progetto e apri una PR verso `main`. Escludi credenziali, configurazione locale, build e report generati.
2. Esegui `npm run check`, `npm run build:ds-fixture` e `npm run test:e2e`. Attendi il completamento dei tre job Chromium, Firefox e WebKit sulla PR. [Workflow Quality and browser regression](../.github/workflows/quality.yml)
3. Completa la revisione e il merge. Annota lo SHA di `main` risultante dal merge e attendi i controlli sul commit integrato.

## 2. Build candidata su Vercel

Usa un checkout pulito dello SHA integrato su GitHub. Verifica `git rev-parse HEAD`, `git status --short` e il collegamento della Vercel CLI al progetto `la_veglia_di_gotham_experience` del team `abd-esign1`. Registra l’ID servito dal dominio prima del rilascio per un eventuale ripristino. Vercel installa con `npm ci`, esegue `npm run build` e serve `dist/`. [Configurazione Vercel](../vercel.json)

```sh
vercel deploy --prod --skip-domain
```

Il comando prepara un deployment di produzione con URL proprio. Il dominio pubblico resta sul deployment precedente fino alla promozione. Verifica in dashboard che la candidata sia `Ready` e registra il suo URL o ID insieme allo SHA verificato prima dell’upload. [Riferimento Vercel CLI per il deploy](https://vercel.com/docs/cli/deploy#skip-domain)

## 3. Verifiche e promozione

Sull’URL della candidata verifica questi scenari.

- La home risponde `200` e **Entra nella Batcaverna** avvia il percorso verso il tutorial. Una pagina sconosciuta risponde `404` e mostra **Torna alla home**.
- Un video panoramico, un video di transizione e alcuni fotogrammi WebP sono serviti correttamente. Su desktop il Batcomputer conserva la prospettiva e la navbar rimane trasparente.
- `/#statua` mostra lo showreel a schermo intero. Le card si dissolvono durante lo scroll e il preordine finale apre `/#checkout`.
- Il checkout mostra i dati di Bruce Wayne in sola lettura, PayPal preselezionato e **12.900 €** con trasporto incluso. La carta alternativa mostra i dettagli mascherati. **Conferma il preordine** arriva a `/#conferma`. L’indirizzo di conferma aperto in una sessione nuova riconduce allo showreel.
- La compatibilità touch e la preferenza di movimento ridotto mostrano le alternative previste.

Dopo le verifiche, promuovi quella stessa candidata con `vercel promote <URL-o-ID-della-candidata>`. Ripeti i controlli essenziali sul [dominio pubblico](https://batman-statue-experience.vercel.app/) e verifica in dashboard che il dominio punti all’ID promosso. Conserva link alla PR, SHA, ID Vercel ed esito delle verifiche nel resoconto di rilascio. [Riferimento Vercel CLI per la promozione](https://vercel.com/docs/cli/promote)

## Ripristino

Se la regressione emerge dopo la promozione, identifica in dashboard il deployment di produzione precedente noto come funzionante e usa `vercel rollback <URL-o-ID-del-deployment-precedente>`. Ricontrolla il dominio dopo il ripristino. Il rollback Vercel sposta il dominio. Per correggere il codice apri una PR separata su GitHub. [Riferimento Vercel CLI per il rollback](https://vercel.com/docs/cli/rollback)
