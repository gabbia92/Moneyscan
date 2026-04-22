# BudgetFlow 💰

App di finanza personale — gestione spese, investimenti IWDA e patrimonio totale.

## Struttura del progetto

```
budgetflow/
├── index.html      → Entry point HTML + carica React via CDN
├── app.jsx         → Tutta la logica e UI dell'app (JSX)
├── style.css       → Stili base, PWA, safe-area iOS
├── manifest.json   → Configurazione PWA (icona, colori, nome)
├── sw.js           → Service Worker per offline support
├── vercel.json     → Configurazione deploy Vercel
└── icons/
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-180.png   ← Apple Touch Icon
    ├── icon-192.png   ← Android / PWA
    └── icon-512.png   ← Splash screen PWA
```

## Deploy su Vercel (3 passi)

### Opzione A — Drag & Drop (più semplice)
1. Vai su [vercel.com](https://vercel.com) e accedi
2. Clicca **"Add New → Project"**
3. Trascina l'intera cartella `budgetflow/` nella finestra di upload
4. Clicca **Deploy** → in 30 secondi l'app è online

### Opzione B — GitHub + Vercel (consigliato per aggiornamenti)
```bash
# 1. Crea repo su GitHub e carica i file
git init
git add .
git commit -m "BudgetFlow v1"
git remote add origin https://github.com/TUO_UTENTE/budgetflow.git
git push -u origin main

# 2. Su vercel.com: "Add New Project" → importa da GitHub → Deploy
```

### Opzione C — Vercel CLI
```bash
npm install -g vercel
cd budgetflow
vercel
# Segui le istruzioni → URL pronto
```

## Installazione come app sul tuo iPhone

1. Apri Safari sul tuo iPhone
2. Vai all'URL Vercel (es. `https://budgetflow-xxx.vercel.app`)
3. Tocca il tasto **Condividi** (quadrato con freccia su)
4. Scorri e tocca **"Aggiungi a schermata Home"**
5. Conferma con **"Aggiungi"**

L'app si aprirà a schermo intero, senza barre Safari, come una app nativa.

## Note tecniche

- **Nessun build step**: l'app usa Babel Standalone per transpilare JSX nel browser.
  Prima apertura ~2 secondi più lenta (compilazione). Poi tutto in cache.
- **Dati locali**: tutti i dati sono salvati nel `localStorage` del browser.
  Se vuoi persistenza multi-dispositivo, considera di aggiungere un backend (es. Supabase).
- **Prezzo IWDA live**: usa Yahoo Finance API gratuita.
  Funziona online; offline mostra l'ultimo prezzo in cache.
- **Framework**: React 18 via CDN unpkg. Nessuna dipendenza da npm.

## Aggiornare l'app

Per aggiornare il codice:
1. Modifica `app.jsx`
2. Se usi GitHub: `git add . && git commit -m "update" && git push`
   Vercel fa il redeploy automaticamente
3. Se usi drag & drop: ricarica il progetto su Vercel

## Supporto browser

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | ✅ | ✅ |
| Safari | ✅ | ✅ (iOS 14+) |
| Firefox | ✅ | ✅ |
| Edge | ✅ | ✅ |

## Personalizzazione dominio

Su Vercel → Settings → Domains → aggiungi il tuo dominio personalizzato.
SSL è incluso e automatico.
