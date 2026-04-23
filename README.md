# BudgetFlow 💰

App di finanza personale — spese, investimenti IWDA, fondo pensione, patrimonio totale.

## File del progetto

```
budgetflow/
├── index.html      → Entry point HTML
├── app.jsx         → Tutta l'app (React + JSX)
├── style.css       → Stili base + PWA safe-area iOS
├── manifest.json   → Configurazione PWA
├── sw.js           → Service Worker (offline)
├── vercel.json     → Config deploy Vercel
└── icons/
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-180.png
    ├── icon-192.png
    └── icon-512.png
```

## Deploy su Vercel (2 minuti)

### Metodo A — Drag & Drop (più semplice)
1. Vai su [vercel.com](https://vercel.com) → Login
2. **"Add New → Project"**
3. Trascina l'intera cartella `budgetflow/` nella finestra
4. Clicca **Deploy** → URL pronto in 30 secondi

### Metodo B — GitHub
```bash
git init && git add . && git commit -m "BudgetFlow"
git remote add origin https://github.com/TUO_UTENTE/budgetflow.git
git push -u origin main
# Su vercel.com: importa da GitHub → Deploy
```

## Installare come app su iPhone

1. Apri **Safari** (non Chrome) sul tuo iPhone
2. Vai all'URL Vercel
3. Tocca **Condividi** (icona quadrato con freccia)
4. **"Aggiungi a schermata Home"** → Aggiungi
5. Si apre a schermo intero come app nativa ✓

## Note

- **Dati**: salvati nel localStorage del browser del dispositivo
- **Backup**: usa Impostazioni → Esporta JSON per fare backup
- **IWDA**: prezzo live da Yahoo Finance (funziona solo online)
- **Offline**: l'app funziona offline grazie al Service Worker
