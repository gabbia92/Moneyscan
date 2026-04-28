/**
 * alphaVantageService.js
 * Servizio prezzi ETF via Alpha Vantage API.
 *
 * - Endpoint: GLOBAL_QUOTE
 * - Cache prezzi in localStorage (chiave: "bf_prices")
 * - Rate limiting: max 5 req/min (piano gratuito)
 * - Fallback automatico all'ultimo prezzo salvato
 *
 * API Key: inseriscila in Impostazioni → API Key Alpha Vantage
 * Ottieni la tua chiave gratuita su: https://www.alphavantage.co/support/#api-key
 */

var AlphaVantageService = (function () {

  var LS_KEY_PRICES = "bf_prices";
  var LS_KEY_APIKEY = "bf_av_key";
  var INTERVAL_MS   = 15 * 60 * 1000; // 15 minuti
  var MIN_GAP_MS    = 13 * 1000;       // ~13 sec tra richieste (< 5/min)

  var _lastRequestTime = 0;
  var _queue = [];
  var _processing = false;

  // ── Storage ───────────────────────────────────────────────────────────────

  function loadSavedPrices() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY_PRICES) || "{}");
    } catch (e) {
      return {};
    }
  }

  function savePrice(ticker, data) {
    try {
      var all = loadSavedPrices();
      all[ticker] = data;
      localStorage.setItem(LS_KEY_PRICES, JSON.stringify(all));
    } catch (e) {}
  }

  function getApiKey() {
    try {
      return localStorage.getItem(LS_KEY_APIKEY) || "";
    } catch (e) {
      return "";
    }
  }

  function setApiKey(key) {
    try {
      localStorage.setItem(LS_KEY_APIKEY, key.trim());
    } catch (e) {}
  }

  // ── Rate limiting queue ────────────────────────────────────────────────────

  function processQueue() {
    if (_processing || _queue.length === 0) return;
    _processing = true;

    var item = _queue.shift();
    var now = Date.now();
    var wait = Math.max(0, MIN_GAP_MS - (now - _lastRequestTime));

    setTimeout(function () {
      _lastRequestTime = Date.now();
      item.fn()
        .then(item.resolve)
        .catch(item.reject)
        .finally(function () {
          _processing = false;
          processQueue();
        });
    }, wait);
  }

  function enqueue(fn) {
    return new Promise(function (resolve, reject) {
      _queue.push({ fn: fn, resolve: resolve, reject: reject });
      processQueue();
    });
  }

  // ── API call ───────────────────────────────────────────────────────────────

  function fetchFromAlphaVantage(ticker) {
    var key = getApiKey();
    if (!key) {
      return Promise.reject({ code: "NO_KEY", message: "API key non configurata" });
    }

    var url =
      "https://www.alphavantage.co/query" +
      "?function=GLOBAL_QUOTE" +
      "&symbol=" + encodeURIComponent(ticker) +
      "&apikey=" + encodeURIComponent(key);

    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw { code: "HTTP_" + r.status, message: "HTTP " + r.status };
        return r.json();
      })
      .then(function (data) {
        // Rate limit exceeded
        if (data["Note"] || data["Information"]) {
          throw {
            code: "RATE_LIMIT",
            message: "Limite API raggiunto (5 req/min). Riprova tra un minuto.",
          };
        }

        var quote = data["Global Quote"];
        if (!quote || !quote["05. price"]) {
          throw { code: "NO_DATA", message: "Ticker non trovato: " + ticker };
        }

        var price  = parseFloat(quote["05. price"]);
        var prev   = parseFloat(quote["08. previous close"] || quote["05. price"]);
        var change = prev > 0 ? ((price - prev) / prev) * 100 : null;
        var ts     = new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

        var result = {
          price:  price,
          change: change,
          prev:   prev,
          ticker: ticker,
          ts:     ts,
          savedAt: Date.now(),
        };

        savePrice(ticker, result);
        return result;
      });
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Ottieni prezzo per un ticker.
   * Ritorna Promise<{ price, change, prev, ticker, ts, savedAt, fromCache? }>
   * Se l'API fallisce e c'è un prezzo salvato, lo ritorna con fromCache=true.
   */
  function getPrice(ticker) {
    if (!ticker || !ticker.trim()) {
      return Promise.reject({ code: "NO_TICKER", message: "Ticker non specificato" });
    }

    var t = ticker.trim().toUpperCase();

    return enqueue(function () {
      return fetchFromAlphaVantage(t);
    }).catch(function (err) {
      // Fallback: ultimo prezzo salvato
      var saved = loadSavedPrices()[t];
      if (saved && saved.price) {
        return Object.assign({}, saved, { fromCache: true, cacheError: err.message || String(err) });
      }
      throw err;
    });
  }

  /**
   * Ottieni prezzi per più ticker in sequenza (rispetta rate limit).
   * Ritorna Promise<{ [ticker]: result | error }>
   */
  function getPrices(tickers) {
    var results = {};
    var chain = Promise.resolve();

    tickers.forEach(function (ticker) {
      chain = chain.then(function () {
        return getPrice(ticker).then(function (data) {
          results[ticker] = data;
        }).catch(function (err) {
          // Fallback già gestito in getPrice; se arriviamo qui è un errore senza cache
          var saved = loadSavedPrices()[ticker.toUpperCase()];
          results[ticker] = saved
            ? Object.assign({}, saved, { fromCache: true, cacheError: err.message || String(err) })
            : { error: err.message || String(err), code: err.code || "UNKNOWN" };
        });
      });
    });

    return chain.then(function () { return results; });
  }

  /**
   * Ottieni tutti i prezzi in cache senza chiamare l'API.
   */
  function getCachedPrices() {
    return loadSavedPrices();
  }

  /**
   * Controlla se un prezzo è abbastanza recente (< INTERVAL_MS).
   */
  function isPriceFresh(ticker) {
    var saved = loadSavedPrices()[ticker.toUpperCase()];
    if (!saved || !saved.savedAt) return false;
    return (Date.now() - saved.savedAt) < INTERVAL_MS;
  }

  /**
   * Salva/leggi API key.
   */
  function saveApiKey(key) { setApiKey(key); }
  function readApiKey()    { return getApiKey(); }

  /**
   * Aggiorna prezzi solo se non freschi.
   * Ritorna Promise<{ [ticker]: result }>
   */
  function refreshIfStale(tickers) {
    var stale = tickers.filter(function (t) { return !isPriceFresh(t); });
    if (stale.length === 0) {
      // Tutti freschi: ritorna dalla cache
      var cached = loadSavedPrices();
      var result = {};
      tickers.forEach(function (t) { result[t] = cached[t.toUpperCase()] || null; });
      return Promise.resolve(result);
    }
    return getPrices(stale).then(function (fresh) {
      var cached = loadSavedPrices();
      var result = {};
      tickers.forEach(function (t) {
        result[t] = fresh[t] || cached[t.toUpperCase()] || null;
      });
      return result;
    });
  }

  return {
    getPrice:       getPrice,
    getPrices:      getPrices,
    getCachedPrices:getCachedPrices,
    isPriceFresh:   isPriceFresh,
    refreshIfStale: refreshIfStale,
    saveApiKey:     saveApiKey,
    readApiKey:     readApiKey,
    INTERVAL_MS:    INTERVAL_MS,
  };

})();
