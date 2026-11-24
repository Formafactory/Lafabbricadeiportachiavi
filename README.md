# La Fabbrica dei Portachiavi

Sito monopagina (italiano) per **La Fabbrica dei Portachiavi, powered by Vir3D**:
portachiavi personalizzati stampati in 3D, ordine minimo 100 pezzi.
Dominio previsto: lafabbricaportachiavi.it.

Stesso approccio di bomboniere3dart.it: Vite + React + TypeScript, build statica
con prerender, pubblicata su **Cloudflare Pages** con `_headers` e `_redirects`.
Progetto e repository separati da Vir3D e da Bomboniere 3D Art.

## Comandi

```bash
npm install
npm run dev      # sviluppo locale
npm test         # test su listino e calcolo totali
npm run build    # tsc + vite build + prerender  ->  dist/
npm run preview  # serve dist/ in locale
```

## Cloudflare Pages (impostazioni)

| Campo | Valore |
|---|---|
| Framework preset | nessuno |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Variabile `NODE_VERSION` | `22` |
| Branch di produzione | `main` (ogni altro branch ha un'anteprima automatica) |

Il progetto usa npm: non committare `bun.lock`/`bun.lockb` (Cloudflare sceglierebbe bun e la build fallirebbe).

## Dove si cambiano le cose

- **Prezzi, spedizione, consegna, testo IVA, contatti, limiti file:** solo `shared/config.ts`.
  Il testo sull'IVA (`IVA.suffisso`) è da confermare con il commercialista: si cambia in quel punto solo.
- **Segnaposto da sostituire** (punto 11 del brief): foto (`FOTO` in `src/App.tsx`), partita IVA e
  contatti (`CONTATTI` in config), colori filamento (campo "Colori"), testi di Privacy e Cookie
  (`privacy.html`, `cookie.html`).
- **Immagine social:** `public/og-image.png` è provvisoria.

## Stato

- [x] Passo 1: pagina statica con listino letto dalla configurazione, selettore quantità, anteprima.
- [ ] Passo 2: moduli, database, file, email (l'invio oggi mostra solo un messaggio di anteprima).
- [ ] Passo 3: area riservata `/admin`.
- [ ] Passo 4: dominio, DNS, posta.
- [ ] Passo 5: produzione.
