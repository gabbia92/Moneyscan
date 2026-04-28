var useState=React.useState,useEffect=React.useEffect,useRef=React.useRef,useCallback=React.useCallback,useMemo=React.useMemo;

var MONTHS_S = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
var MONTHS_F = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
var CURRENCIES = [{code:"EUR",symbol:"€"},{code:"USD",symbol:"$"},{code:"GBP",symbol:"£"},{code:"CHF",symbol:"Fr"}];

var ICONS = {
  food:"🍔",grocery:"🛒",transport:"🚗",fuel:"⛽",health:"💊",sport:"🏋️",travel:"✈️",
  clothing:"👗",electronics:"💻",phone:"📱",home:"🏠",rent:"🔑",utilities:"💡",
  subscriptions:"📺",coffee:"☕",restaurant:"🍽️",bar:"🍺",cinema:"🎬",gift:"🎁",pet:"🐾",
  beauty:"💄",tax:"🧾",insurance:"🛡️",education:"📚",
  salary:"💼",freelance:"💡",bonus:"🎯",dividend:"💰",investment:"📈",savings:"🏛️",
  transfer:"↔️",other:"💸",
};

var COLORS = {
  food:"#FF6B6B",grocery:"#FF8C42",transport:"#FFD93D",fuel:"#F4A261",health:"#E63946",
  sport:"#06D6A0",travel:"#118AB2",clothing:"#C77DFF",electronics:"#48CAE4",phone:"#00B4D8",
  home:"#52B788",rent:"#40916C",utilities:"#F9C74F",subscriptions:"#B5179E",coffee:"#BC6C25",
  restaurant:"#E76F51",bar:"#E9C46A",cinema:"#264653",gift:"#E9C46A",pet:"#74B72E",
  beauty:"#FF85A1",tax:"#6D6875",insurance:"#457B9D",education:"#3A86FF",
  salary:"#06D6A0",freelance:"#38B000",bonus:"#FFD60A",dividend:"#4CC9F0",
  investment:"#06D6A0",savings:"#2EC4B6",transfer:"#4361EE",other:"#ADB5BD",
};

var PM = [
  {id:"cash",label:"Contanti",icon:"💵"},
  {id:"card",label:"Carta",icon:"💳"},
  {id:"debit",label:"Bancomat",icon:"🏧"},
  {id:"bank",label:"Bonifico",icon:"🏦"},
  {id:"paypal",label:"PayPal",icon:"🅿️"},
  {id:"satispay",label:"Satispay",icon:"📲"},
];

var EXP_CATS = ["food","grocery","transport","fuel","health","sport","travel","clothing","electronics","phone","home","rent","utilities","subscriptions","coffee","restaurant","bar","cinema","gift","pet","beauty","tax","insurance","education","other"];

var INC_CATS = ["salary","freelance","bonus","dividend","investment","savings","gift","other"];

var EXTRA_EMOJI = ["🍕","🍣","☕","🍺","⚽","✈️","🏠","💻","📱","🐶","🌸","🔥","⭐","🎵","🎮","💎","🎁","💰","🎯","🌴","🌊","🎨","🚀","🏆","🎪","🧘","🦋","🌈","❄️","🔮"];

var ACCENTS = [
  {id:"blue",  label:"Blu",    a:"#4361EE",b:"#7209B7"},
  {id:"violet",label:"Viola",  a:"#8B5CF6",b:"#4361EE"},
  {id:"teal",  label:"Teal",   a:"#06D6A0",b:"#118AB2"},
  {id:"cyan",  label:"Cyan",   a:"#00B4D8",b:"#0077B6"},
  {id:"orange",label:"Arancio",a:"#F9844A",b:"#F72585"},
  {id:"rose",  label:"Rosa",   a:"#FB7185",b:"#E11D48"},
  {id:"amber", label:"Ambra",  a:"#F59E0B",b:"#D97706"},
  {id:"lime",  label:"Lime",   a:"#84CC16",b:"#16A34A"},
];
var BG_COLORS = [
  {hex:"#050508",label:"Abisso"},{hex:"#0a0a12",label:"Notte"},{hex:"#0d0d1a",label:"Dark"},
  {hex:"#111118",label:"Carbone"},{hex:"#18181f",label:"Grafite"},{hex:"#060b18",label:"Oceano"},
  {hex:"#0a1128",label:"Navy"},{hex:"#0f172a",label:"Slate"},{hex:"#0d0718",label:"Porpor."},
  {hex:"#160d2a",label:"Indaco"},{hex:"#030f08",label:"Muschio"},{hex:"#0a1f0f",label:"Bosco"},
  {hex:"#120306",label:"Rubino"},{hex:"#030f0e",label:"Teal"},
];

var DEFAULT_ACCOUNTS = [
  {id:"acc1",name:"Conto Principale",icon:"🏦",color:"#4361EE",balance:0},
  {id:"acc2",name:"Investimenti",icon:"📈",color:"#06D6A0",balance:0,type:"investment",ticker:"IWDA",avTicker:"IWDA.AS",isin:"IE00B4L5Y983",shares:0,buyCommission:2,annualFee:0.2},
  {id:"acc3",name:"Fondo Pensione",icon:"🏛️",color:"#F9844A",balance:0,type:"pension",fund:"Allianz Insieme",comparto:"Linea Azionaria",shares:0,navManual:0,annualFee:0.1},
];

var SAMPLE = [
  {id:"s1",type:"expense",amount:1200,category:"rent",description:"Affitto",date:"2025-04-01",payment:"bank",account:"acc1"},
  {id:"s2",type:"income",amount:2800,category:"salary",description:"Stipendio",date:"2025-04-05",payment:"bank",account:"acc1"},
  {id:"s3",type:"expense",amount:280,category:"grocery",description:"Spesa",date:"2025-04-10",payment:"card",account:"acc1"},
];

function gid() { return Math.random().toString(36).substr(2,9); }

function cardStyle(settings) {
  var op = (((settings && settings.cardOpacity) || 5) / 12 * 0.12).toFixed(3);
  return {
    background:"rgba(255,255,255,"+op+")",
    border:"1px solid rgba(255,255,255,0.07)",
    borderRadius:20,
    padding:20,
    backdropFilter:"blur(20px)",
  };
}

function useFmt(cur) {
  return useCallback(function(n) {
    return new Intl.NumberFormat("it-IT",{style:"currency",currency:cur||"EUR",maximumFractionDigits:2}).format(n||0);
  },[cur]);
}

function DonutChart(props) {
  var income=props.income, expenses=props.expenses, fmt=props.fmt;
  var size=220,r=80,cx=110,cy=110;
  var circ=2*Math.PI*r;
  var total=income+expenses;
  var incR=total>0?income/total:0.5;
  var expR=total>0?expenses/total:0.5;
  var gap=0.025;
  var incD=Math.max(0,(incR-gap)*circ);
  var expD=Math.max(0,(expR-gap)*circ);
  var incOff=circ*0.25;
  var expOff=incOff-incD-gap*circ;
  var bal=income-expenses;
  return (
    React.createElement("div",{style:{position:"relative",width:size,height:size}},
      React.createElement("svg",{width:size,height:size,style:{transform:"rotate(-90deg)"}},
        React.createElement("defs",null,
          React.createElement("linearGradient",{id:"dg1",x1:"0%",y1:"0%",x2:"100%",y2:"100%"},
            React.createElement("stop",{offset:"0%",stopColor:"#06D6A0"}),
            React.createElement("stop",{offset:"100%",stopColor:"#00F5C3"})
          ),
          React.createElement("linearGradient",{id:"dg2",x1:"0%",y1:"0%",x2:"100%",y2:"100%"},
            React.createElement("stop",{offset:"0%",stopColor:"#FF416C"}),
            React.createElement("stop",{offset:"100%",stopColor:"#FF4B2B"})
          )
        ),
        React.createElement("circle",{cx:cx,cy:cy,r:r,fill:"none",stroke:"rgba(255,255,255,0.06)",strokeWidth:"22"}),
        total>0&&React.createElement("g",null,
          React.createElement("circle",{cx:cx,cy:cy,r:r,fill:"none",stroke:"url(#dg2)",strokeWidth:"22",strokeLinecap:"round",strokeDasharray:expD+" "+circ,strokeDashoffset:-expOff}),
          React.createElement("circle",{cx:cx,cy:cy,r:r,fill:"none",stroke:"url(#dg1)",strokeWidth:"22",strokeLinecap:"round",strokeDasharray:incD+" "+circ,strokeDashoffset:-incOff})
        )
      ),
      React.createElement("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}},
        React.createElement("div",{style:{fontSize:10,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",marginBottom:3}},"Bilancio"),
        React.createElement("div",{style:{fontSize:22,fontWeight:800,color:bal>=0?"#06D6A0":"#FF416C",lineHeight:1.1}},fmt(bal)),
        React.createElement("div",{style:{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:3}},total>0?(Math.round(incR*100)+"% entrate"):"nessun dato")
      )
    )
  );
}

function BudgetFlow() {
  var storedTxs = null, storedAccs = null, storedSett = null;
  try { storedTxs = JSON.parse(localStorage.getItem("bf_txs")||"null"); } catch(e){}
  try { storedAccs = JSON.parse(localStorage.getItem("bf_accs")||"null"); } catch(e){}
  try { storedSett = JSON.parse(localStorage.getItem("bf_sett")||"null"); } catch(e){}

  var [txs, setTxs] = useState(storedTxs||SAMPLE);
  var [accounts, setAccounts] = useState(storedAccs||DEFAULT_ACCOUNTS);
  var [settings, setSettings] = useState(storedSett||{bgColor:"#0d0d1a",accentA:"#4361EE",accentB:"#7209B7",cardOpacity:5,currency:"EUR"});
  var [tab, setTab] = useState("dashboard");
  var [viewMonth, setViewMonth] = useState(new Date(2025,3));
  var [showModal, setShowModal] = useState(false);
  var [txType, setTxType] = useState("expense");
  var [form, setForm] = useState({amount:"",category:"grocery",description:"",date:new Date().toISOString().split("T")[0],payment:"card",account:"acc1",toAccount:"acc2"});
  var [filterType, setFilterType] = useState("all");
  var [filterAcc, setFilterAcc] = useState("all");
  var [filterPeriod, setFilterPeriod] = useState("month");
  var [expandedCat, setExpandedCat] = useState(null);
  var [chartPeriod, setChartPeriod] = useState("6m");
  var [chartYear, setChartYear] = useState(new Date().getFullYear());
  var [historyYear, setHistoryYear] = useState(new Date().getFullYear());
  var [editingMonth, setEditingMonth] = useState(null);
  var [showNewAcc, setShowNewAcc] = useState(false);
  var [expandedAcc, setExpandedAcc] = useState(null);
  var [buyForm, setBuyForm] = useState(null);
  var [baseForm, setBaseForm] = useState(null);
  var [liqForm, setLiqForm] = useState(null);
    var [priceMap, setPriceMap] = useState(function(){
    try{var c=AlphaVantageService.getCachedPrices();var m={};
    Object.keys(c).forEach(function(k){m[k]=c[k];});return m;}catch(e){return {};}
  });
  var [priceLoading, setPriceLoading] = useState(false);
  var [priceError, setPriceError] = useState({});
  var [editTicker, setEditTicker] = useState(null);
  var [avApiKey, setAvApiKey] = useState(function(){return AlphaVantageService.readApiKey();});
  var [backupMsg, setBackupMsg] = useState("");
  var [confirmReset, setConfirmReset] = useState(false);
  var [jsonModal, setJsonModal] = useState(null);

  var fmt = useFmt(settings.currency);
  var acA = settings.accentA||"#4361EE";
  var acB = settings.accentB||"#7209B7";
  var bg = settings.bgColor||"#0d0d1a";
  var curYear = viewMonth.getFullYear();
  var curMonth = viewMonth.getMonth();
  var cs = cardStyle(settings);

  function saveTxs(arr) { setTxs(arr); try{localStorage.setItem("bf_txs",JSON.stringify(arr));}catch(e){} }
  function saveAccounts(arr) { setAccounts(arr); try{localStorage.setItem("bf_accs",JSON.stringify(arr));}catch(e){} }

  function fetchPriceForAcc(acc) {
    var ticker=(acc.avTicker||acc.ticker||"").trim().toUpperCase();
    if(!ticker)return;
    var aid=acc.id;
    setPriceLoading(true);
    AlphaVantageService.getPrice(ticker)
      .then(function(data){
        setPriceMap(function(m){return Object.assign({},m,{[aid]:data});});
        setPriceError(function(e){return Object.assign({},e,{[aid]:data.fromCache?"cache":false});});
        setPriceLoading(false);
      })
      .catch(function(err){
        setPriceError(function(e){return Object.assign({},e,{[aid]:err.message||String(err)});});
        setPriceLoading(false);
      });
  }

  function fetchAllPrices(){
    var invAccs=accounts.filter(function(a){return a.type==="investment"&&(a.avTicker||a.ticker);});
    if(!invAccs.length)return;
    setPriceLoading(true);
    var tickers=invAccs.map(function(a){return (a.avTicker||a.ticker).trim().toUpperCase();});
    AlphaVantageService.refreshIfStale(tickers)
      .then(function(results){
        setPriceMap(function(m){
          var next=Object.assign({},m);
          invAccs.forEach(function(a){
            var t=(a.avTicker||a.ticker).trim().toUpperCase();
            if(results[t])next[a.id]=results[t];
          });
          return next;
        });
        setPriceLoading(false);
      })
      .catch(function(){setPriceLoading(false);});
  }

  // Backward compat alias
  var fetchIwdaPrice=fetchAllPrices;

  useEffect(function(){
    if(accounts.some(function(a){return a.type==="investment";})){
      fetchAllPrices();
      var iv=setInterval(fetchAllPrices,AlphaVantageService.INTERVAL_MS);
      return function(){clearInterval(iv);};
    }
  },[]);
  function saveSett(s) { setSettings(s); try{localStorage.setItem("bf_sett",JSON.stringify(s));}catch(e){} }

  var monthTxs = useMemo(function() {
    return txs.filter(function(t) { var d=new Date(t.date); return d.getFullYear()===curYear&&d.getMonth()===curMonth; });
  },[txs,curYear,curMonth]);

  var monthIncome = useMemo(function() {
    return monthTxs.filter(function(t){return t.type==="income";}).reduce(function(s,t){return s+t.amount;},0);
  },[monthTxs]);

  var monthExpenses = useMemo(function() {
    return monthTxs.filter(function(t){return t.type==="expense";}).reduce(function(s,t){return s+t.amount;},0);
  },[monthTxs]);

  var catBreak = useMemo(function() {
    var map = {};
    monthTxs.filter(function(t){return t.type==="expense";}).forEach(function(t){map[t.category]=(map[t.category]||0)+t.amount;});
    return Object.entries(map).sort(function(a,b){return b[1]-a[1];}).slice(0,8);
  },[monthTxs]);

  var chartData = useMemo(function() {
    if(chartPeriod==="year"){
      return Array.from({length:12},function(_,m){
        var ts=txs.filter(function(t){var dd=new Date(t.date);return dd.getFullYear()===chartYear&&dd.getMonth()===m;});
        return {
          label:MONTHS_S[m],
          income:ts.filter(function(t){return t.type==="income";}).reduce(function(s,t){return s+t.amount;},0),
          expenses:ts.filter(function(t){return t.type==="expense";}).reduce(function(s,t){return s+t.amount;},0),
          transfers:ts.filter(function(t){return t.type==="transfer";}).reduce(function(s,t){return s+t.amount;},0),
        };
      });
    }
    var n = chartPeriod==="3m"?3:chartPeriod==="6m"?6:12;
    return Array.from({length:n},function(_,i){
      var d=new Date(curYear,curMonth-(n-1-i),1);
      var y=d.getFullYear(),m=d.getMonth();
      var ts=txs.filter(function(t){var dd=new Date(t.date);return dd.getFullYear()===y&&dd.getMonth()===m;});
      return {
        label:MONTHS_S[m],
        income:ts.filter(function(t){return t.type==="income";}).reduce(function(s,t){return s+t.amount;},0),
        expenses:ts.filter(function(t){return t.type==="expense";}).reduce(function(s,t){return s+t.amount;},0),
        transfers:ts.filter(function(t){return t.type==="transfer";}).reduce(function(s,t){return s+t.amount;},0),
      };
    });
  },[txs,curYear,curMonth,chartPeriod,chartYear]);

  var filteredTxs = useMemo(function() {
    var list = txs.slice().sort(function(a,b){return new Date(b.date)-new Date(a.date);});
    if(filterType!=="all") list=list.filter(function(t){return t.type===filterType;});
    if(filterAcc!=="all") list=list.filter(function(t){return t.account===filterAcc||t.toAccount===filterAcc;});
    if(filterPeriod==="month") list=list.filter(function(t){var d=new Date(t.date);return d.getFullYear()===curYear&&d.getMonth()===curMonth;});
    return list;
  },[txs,filterType,filterAcc,filterPeriod,curYear,curMonth]);

  var allExpCats = useMemo(function() {
    return EXP_CATS.concat(customCats.filter(function(c){return c.type==="expense";}).map(function(c){return c.id;}));
  },[customCats]);
  var allIncCats = useMemo(function() {
    return INC_CATS.concat(customCats.filter(function(c){return c.type==="income";}).map(function(c){return c.id;}));
  },[customCats]);
  var catIcons = useMemo(function() {
    var m = Object.assign({},ICONS);
    customCats.forEach(function(c){m[c.id]=c.icon;});
    return m;
  },[customCats]);

  function getMonthsForYear(year) {
    return Array.from({length:12},function(_,m){
      var ts=txs.filter(function(t){var d=new Date(t.date);return d.getFullYear()===year&&d.getMonth()===m;});
      return {
        month:m,
        income:ts.filter(function(t){return t.type==="income";}).reduce(function(s,t){return s+t.amount;},0),
        expenses:ts.filter(function(t){return t.type==="expense";}).reduce(function(s,t){return s+t.amount;},0),
        txCount:ts.filter(function(t){return t.type!=="transfer";}).length,
      };
    });
  }

  function addTx() {
    if(!form.amount||isNaN(form.amount)) return;
    var t = {id:gid(),type:txType,amount:parseFloat(form.amount),category:txType==="transfer"?"transfer":form.category,description:form.description,date:form.date,payment:form.payment,account:form.account};
    if(txType==="transfer") t.toAccount=form.toAccount;
    saveTxs([t].concat(txs));
    setShowModal(false);
    setForm(function(f){return Object.assign({},f,{amount:"",description:"",date:new Date().toISOString().split("T")[0]});});
  }

  function delTx(id) { saveTxs(txs.filter(function(t){return t.id!==id;})); }

  function addAccount() {
    if(!accForm.name.trim()) return;
    saveAccounts(accounts.concat([{id:gid(),name:accForm.name,icon:accForm.icon,color:accForm.color,balance:parseFloat(accForm.balance)||0}]));
    setAccForm({name:"",icon:"🏦",color:"#4361EE",balance:""});
    setShowNewAcc(false);
  }

  function addCustomCat() {
    if(!newCatForm.name.trim()) return;
    var id = newCatForm.name.toLowerCase().replace(/\s+/g,"-")+"-"+gid().slice(0,4);
    setCustomCats(function(p){return p.concat([Object.assign({},newCatForm,{id:id})]);});
    setNewCatForm({name:"",icon:"🎯",type:"expense"});
    setShowCustomCat(false);
    setForm(function(f){return Object.assign({},f,{category:id});});
  }

  function importCSV(e) {
    var file = e.target.files[0]; if(!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      var raw = ev.target.result;
      var delim = raw.split("\n")[0].includes(";") ? ";" : ",";
      var rows = raw.split("\n").map(function(l){return l.trim();}).filter(Boolean);
      if(rows.length<2){setCsvMsg("File vuoto");return;}
      var parseAmt = function(r){return parseFloat(r.replace(/"/g,"").replace(/\u2212/g,"-").replace(/\s/g,"").replace(/\.(?=\d{3})/g,"").replace(",","."));};
      var parseDate=function(r){
if(!r)return new Date().toISOString().split("T")[0];
r=r.replace(/"/g,"").trim();
var dm=r.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
if(dm){var y=parseInt(dm[3]);if(y<100)y+=2000;return y+"-"+dm[2].padStart(2,"0")+"-"+dm[1].padStart(2,"0");}
if(/^\d{4}-\d{2}-\d{2}/.test(r))return r.slice(0,10);
return new Date().toISOString().split("T")[0];
};
      var headers = rows[0].split(delim).map(function(h){return h.toLowerCase().replace(/"/g,"").trim();});
      var catMap={"ristorante":"restaurant","palestra":"sport","carburante":"fuel","abbigliamento":"clothing","farmaci":"health","abbonamenti":"subscriptions","mutuo/affitto":"rent","utenze":"utilities","stipendio":"salary","trasferimenti monetari":"transfer","trasferimenti monetari inviati":"transfer"};
      var payMap = {"contanti":"cash","carta di credito":"card","carta credito":"card","carta di debito":"debit","bancomat":"debit","bonifico":"bank","paypal":"paypal","satispay":"satispay","altro":"cash"};
      var iDate=headers.indexOf("data"),iCat=headers.indexOf("categorie"),iMain=headers.indexOf("categoria principale"),iTx=headers.indexOf("transazioni"),iNote=headers.indexOf("nota"),iAmt=headers.indexOf("importo"),iPay=headers.findIndex(function(h){return h.includes("pagamento");}),iAcc=headers.indexOf("conto");
      if(iAmt<0)iAmt=7;if(iDate<0)iDate=2;if(iMain<0)iMain=3;if(iCat<0)iCat=4;if(iTx<0)iTx=5;if(iNote<0)iNote=6;if(iPay<0)iPay=8;if(iAcc<0)iAcc=1;
      var imported=0,newTxs=[];
      for(var i=1;i<rows.length;i++){
        var cols=rows[i].split(delim).map(function(c){return c.replace(/"/g,"").trim();});
        if(cols.length<2)continue;
        var amount=parseAmt(cols[iAmt]||"");if(isNaN(amount)||amount===0)continue;
        var subCat=(cols[iCat]||"").toLowerCase().trim();
        var mainCat=(cols[iMain]||"").toLowerCase().trim();
        var catKey=subCat||mainCat||"other";
        var mappedCat=catMap[catKey]||catMap[mainCat]||"other";
        var type=amount>0?"income":"expense";
        if(mappedCat==="transfer"||mainCat.includes("trasfer"))type="transfer";
        var rawPay=(cols[iPay]||"").toLowerCase();
        var payment=payMap[rawPay]||"card";
        var desc=cols[iTx]||cols[iNote]||"";
        var rawAcc=cols[iAcc]||"";
        var matchAcc=accounts.find(function(a){return rawAcc&&a.name.toLowerCase().includes(rawAcc.toLowerCase().split(" ")[0]);});
        newTxs.push({id:gid(),type:type,amount:Math.abs(amount),category:mappedCat,description:desc,date:parseDate(cols[iDate]||""),payment:payment,account:matchAcc?matchAcc.id:"acc1"});
        imported++;
      }
      if(imported===0){setCsvMsg("Nessuna transazione riconosciuta");}
      else{saveTxs(newTxs.concat(txs));setCsvMsg("Importate "+imported+" transazioni");}
      setTimeout(function(){setCsvMsg("");},5000);
    };
    reader.readAsText(file,"UTF-8");
    e.target.value="";
  }

  function exportBackup() {
    var data={version:1,exportedAt:new Date().toISOString(),txs:txs,accounts:accounts,settings:settings};
    var json=JSON.stringify(data,null,2);
    var filename="budgetflow-"+new Date().toISOString().split("T")[0]+".json";
    var downloaded=false;
    // Tentativo download diretto (funziona su Vercel, Chrome, Firefox)
    try {
      var blob=new Blob([json],{type:"application/json"});
      var url=URL.createObjectURL(blob);
      var a=document.createElement("a");
      a.href=url;a.download=filename;a.style.display="none";
      document.body.appendChild(a);a.click();
      setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url);},500);
      downloaded=true;
    } catch(e){}
    // Sempre mostra il modal JSON come backup affidabile
    setJsonModal({json:json,filename:filename,downloaded:downloaded});
  }

  function importBackup(e) {
    var file=e.target.files[0];if(!file)return;
    var reader=new FileReader();
    reader.onload=function(ev){
      try{
        var data=JSON.parse(ev.target.result);
        if(!data.txs||!data.accounts){setBackupMsg("File non valido: mancano txs o accounts");setTimeout(function(){setBackupMsg("");},5000);return;}
        saveTxs(data.txs);saveAccounts(data.accounts);
        if(data.settings)saveSett(data.settings);
        setBackupMsg("✓ "+data.txs.length+" transazioni ripristinate");
        setTimeout(function(){setBackupMsg("");},6000);
      }catch(err){setBackupMsg("Errore: file non valido o corrotto");setTimeout(function(){setBackupMsg("");},5000);}
    };
    reader.readAsText(file,"UTF-8");e.target.value="";
  }

  function onTouchStart(e) { startY.current=e.touches[0].clientY; setDragY(0); }
  function onTouchMove(e) {
    var dy=e.touches[0].clientY-startY.current;
    if(dy>0){setDragY(dy);if(modalRef.current)modalRef.current.style.transform="translateY("+dy+"px)";}
  }
  function onTouchEnd() {
    if(dragY>100){setShowModal(false);}
    else if(modalRef.current){modalRef.current.style.transform="translateY(0)";}
    setDragY(0);
  }

  var activeAccount = accounts.find(function(a){return a.id===filterAcc;})||null;
  var inp = {width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,color:"#fff",padding:"11px 13px",fontSize:14,outline:"none",boxSizing:"border-box"};
  var navBtn = {background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",borderRadius:11,padding:"7px 14px",cursor:"pointer",fontSize:18};
  var hBtn = {background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",borderRadius:9,padding:"6px 12px",cursor:"pointer",fontSize:16};
  var finp = {width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:9,color:"#fff",padding:"9px 11px",outline:"none",boxSizing:"border-box"};
  var lbl = {fontSize:11,color:"rgba(255,255,255,0.45)",marginBottom:5,display:"block"};
  var flbl = {fontSize:9,color:"rgba(255,255,255,0.4)",marginBottom:4};
  var sHdr = {fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.55)",textTransform:"uppercase",marginBottom:12};
  var sHdr10 = {fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.55)",textTransform:"uppercase",marginBottom:10};
  var tUp9 = {fontSize:9,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",marginBottom:3};
  var outBtn = {padding:"8px 13px",borderRadius:10,border:"1px solid rgba(255,255,255,0.15)",cursor:"pointer",fontSize:12,fontWeight:600,background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.6)"};
  var statBox = {background:"rgba(255,255,255,0.06)",borderRadius:10,padding:"9px 7px",textAlign:"center"};
  var pnlBox = function(p){return {background:p>=0||p===null?"rgba(6,214,160,0.1)":"rgba(255,65,108,0.1)",border:"1px solid "+(p>=0||p===null?"rgba(6,214,160,0.2)":"rgba(255,65,108,0.2)"),borderRadius:10,padding:"9px 7px",textAlign:"center"};};
  var accBox = function(a){return {background:a.color+"18",border:"1px solid "+a.color+"33",borderRadius:10,padding:"9px 7px",textAlign:"center"};};
  var sHdr14 = {fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.55)",textTransform:"uppercase",marginBottom:14};
  var tUp10 = {fontSize:10,color:"rgba(255,255,255,0.38)",marginBottom:5,textTransform:"uppercase"};
  var fbtn = {flex:1,padding:"10px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:800};
  var fcnl = {padding:"10px 14px",borderRadius:10,border:"1px solid rgba(255,255,255,0.15)",cursor:"pointer",fontSize:13,background:"transparent",color:"rgba(255,255,255,0.5)"};
  var frow = {display:"flex",gap:8,marginBottom:8};
  var fgrid = {display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8};
  var fbox_inv = {background:"rgba(6,214,160,0.06)",border:"1px solid rgba(6,214,160,0.2)",borderRadius:13,padding:"14px",marginBottom:10};
  var fbox_pens = {background:"rgba(249,132,74,0.07)",border:"1px solid rgba(249,132,74,0.25)",borderRadius:13,padding:"14px",marginBottom:10};
  var fbox_base = {background:"rgba(67,97,238,0.08)",border:"1px solid rgba(67,97,238,0.25)",borderRadius:13,padding:"14px",marginBottom:10};
  var fbox_liq = {background:"rgba(255,214,10,0.06)",border:"1px solid rgba(255,214,10,0.2)",borderRadius:13,padding:"14px",marginBottom:10};

  var tabs = [
    {id:"dashboard",label:"Home",emoji:"⚡"},
    {id:"transactions",label:"Movimenti",emoji:"📋"},
    {id:"accounts",label:"Conti",emoji:"🏦"},
    {id:"analytics",label:"Grafici",emoji:"📊"},
    {id:"history",label:"Storico",emoji:"📅"},
  ];

  return (
    <div style={{minHeight:"100vh",background:bg,color:"#f1f5f9",fontFamily:"system-ui,-apple-system,sans-serif",position:"relative",overflow:"hidden"}}>

      <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,background:"radial-gradient(ellipse at 15% 15%,"+acA+"18 0%,transparent 55%),radial-gradient(ellipse at 85% 85%,"+acB+"12 0%,transparent 55%)"}}/>

      <div style={{maxWidth:500,margin:"0 auto",position:"relative",zIndex:1}}>

            <div style={{padding:"18px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <button onClick={function(){setViewMonth(function(d){return new Date(d.getFullYear(),d.getMonth()-1);});}} style={navBtn}>&#8249;</button>
          <div style={{textAlign:"center",flex:1}}>
            {activeAccount
              ? <div style={{fontSize:11,color:activeAccount.color,fontWeight:600,marginBottom:2}}>{activeAccount.icon} {activeAccount.name}</div>
              : <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:2,fontWeight:600}}>TUTTI I CONTI</div>
            }
            <div style={{fontSize:22,fontWeight:800,letterSpacing:-0.5,color:"#fff"}}>{MONTHS_F[curMonth]} {curYear}</div>
          </div>
          <button onClick={function(){setViewMonth(function(d){return new Date(d.getFullYear(),d.getMonth()+1);});}} style={navBtn}>&#8250;</button>
        </div>



            <div style={{display:"flex",gap:3,background:"rgba(255,255,255,0.04)",borderRadius:18,padding:4,margin:"14px 20px 18px"}}>
          <button onClick={function(){setShowModal(true);}} style={{flex:1,padding:"9px 2px",borderRadius:13,border:"none",cursor:"pointer",fontSize:28,fontWeight:300,background:"linear-gradient(135deg,"+acA+","+acB+")",color:"#fff",boxShadow:"0 4px 14px "+acA+"55",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>+</button>
          {tabs.map(function(t){
            var active=tab===t.id;
            return (
              <button key={t.id} onClick={function(){setTab(t.id);}} style={{flex:1,padding:"9px 2px",borderRadius:13,border:"none",cursor:"pointer",fontSize:9,fontWeight:700,minWidth:0,background:active?"linear-gradient(135deg,"+acA+","+acB+")":"transparent",color:active?"#fff":"rgba(255,255,255,0.38)",boxShadow:active?"0 4px 14px "+acA+"44":"none",textAlign:"center",overflow:"hidden"}}>
                <div style={{fontSize:14,marginBottom:2}}>{t.emoji}</div>
                <div style={{whiteSpace:"nowrap",overflow:"visible",fontSize:9}}>{t.label}</div>
              </button>
            );
          })}
        </div>

        {tab==="dashboard"&&(
          <div style={{padding:"0 20px",paddingBottom:80}}>
            <div style={{...cs,textAlign:"center",marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
                <DonutChart income={monthIncome} expenses={monthExpenses} fmt={fmt}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div style={{background:"rgba(6,214,160,0.08)",border:"1px solid rgba(6,214,160,0.18)",borderRadius:14,padding:14}}>
                  <div style={{fontSize:10,color:"rgba(6,214,160,0.7)",textTransform:"uppercase",marginBottom:3}}>Entrate</div>
                  <div style={{fontSize:19,fontWeight:800,color:"#06D6A0"}}>{fmt(monthIncome)}</div>
                </div>
                <div style={{background:"rgba(255,65,108,0.08)",border:"1px solid rgba(255,65,108,0.18)",borderRadius:14,padding:14}}>
                  <div style={{fontSize:10,color:"rgba(255,65,108,0.7)",textTransform:"uppercase",marginBottom:3}}>Uscite</div>
                  <div style={{fontSize:19,fontWeight:800,color:"#FF416C"}}>{fmt(monthExpenses)}</div>
                </div>
              </div>
            </div>

            {catBreak.length>0&&(
              <div style={{...cs,marginBottom:14}}>
                <div style={sHdr}>Categorie</div>
                {catBreak.map(function(item){
                  var cat=item[0],amt=item[1];
                  var pct=monthExpenses>0?(amt/monthExpenses)*100:0;
                  var color=COLORS[cat]||"#aaa";
                  var isOpen=expandedCat===cat;
                  var catTxs=monthTxs.filter(function(t){return t.type==="expense"&&t.category===cat;}).sort(function(a,b){return new Date(b.date)-new Date(a.date);});
                  return (
                    <div key={cat} style={{marginBottom:10}}>
                      <div onClick={function(){setExpandedCat(isOpen?null:cat);}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",borderRadius:11,cursor:"pointer",background:isOpen?color+"18":"rgba(255,255,255,0.03)",border:"1px solid "+(isOpen?color+"44":"rgba(255,255,255,0.06)"),marginBottom:4}}>
                        <div style={{display:"flex",alignItems:"center",gap:9}}>
                          <div style={{width:32,height:32,borderRadius:9,background:color+"22",border:"1px solid "+color+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{catIcons[cat]||"💸"}</div>
                          <div>
                            <div style={{fontSize:13,fontWeight:600,textTransform:"capitalize",color:"#f1f5f9"}}>{cat}</div>
                            <div style={{fontSize:10,color:"rgba(255,255,255,0.32)"}}>{catTxs.length} {catTxs.length===1?"movimento":"movimenti"}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{color:color,fontWeight:700,fontSize:14}}>{fmt(amt)}</span>
                          <span style={{fontSize:9,color:"rgba(255,255,255,0.35)",display:"inline-block",transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▾</span>
                        </div>
                      </div>
                      <div style={{height:3,borderRadius:2,background:"rgba(255,255,255,0.07)",marginBottom:2}}>
                        <div style={{height:"100%",borderRadius:2,background:color,width:pct+"%"}}/>
                      </div>
                      <div style={{overflow:"hidden",maxHeight:isOpen?(catTxs.length*56+12)+"px":"0px",opacity:isOpen?1:0,transition:"max-height 0.3s ease,opacity 0.25s ease"}}>
                        <div style={{paddingLeft:12,paddingTop:6,borderLeft:"2px solid "+color+"44"}}>
                          {catTxs.map(function(t){
                            var acc2=accounts.find(function(a){return a.id===t.account;});
                            return (
                              <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 8px",marginBottom:2}}>
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{fontSize:12,fontWeight:500,color:"rgba(255,255,255,0.65)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.description||cat}</div>
                                  <div style={{fontSize:10,color:"rgba(255,255,255,0.28)"}}>{t.date}{acc2?" · "+acc2.icon+" "+acc2.name:""}</div>
                                </div>
                                <div style={{fontSize:12,fontWeight:600,color:color,flexShrink:0,marginLeft:8}}>-{fmt(t.amount)}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab==="transactions"&&(
          <div style={{padding:"0 20px",paddingBottom:80}}>
            <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
              {[["all","Tutti"],["income","Entrate"],["expense","Uscite"],["transfer","Trasfer."]].map(function(x){
                var active=filterType===x[0];
                return <button key={x[0]} onClick={function(){setFilterType(x[0]);}} style={{padding:"6px 12px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:600,border:"1px solid "+(active?acA:"rgba(255,255,255,0.14)"),background:active?acA+"22":"transparent",color:active?acA:"rgba(255,255,255,0.45)"}}>{x[1]}</button>;
              })}
            </div>
            <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
              <button onClick={function(){setFilterPeriod(function(p){return p==="month"?"all":"month";});}} style={{padding:"6px 12px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:600,border:"1px solid "+(filterPeriod==="month"?acA:"rgba(255,255,255,0.14)"),background:filterPeriod==="month"?acA+"22":"transparent",color:filterPeriod==="month"?acA:"rgba(255,255,255,0.45)"}}>{filterPeriod==="month"?"Questo mese":"Tutti i mesi"}</button>
              {accounts.map(function(a){
                var active=filterAcc===a.id;
                return <button key={a.id} onClick={function(){setFilterAcc(function(f){return f===a.id?"all":a.id;});}} style={{padding:"6px 12px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:600,border:"1px solid "+(active?a.color:"rgba(255,255,255,0.14)"),background:active?a.color+"22":"transparent",color:active?a.color:"rgba(255,255,255,0.45)"}}>{a.icon} {a.name}</button>;
              })}
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:10}}>{filteredTxs.length} transazioni</div>
            {filteredTxs.map(function(t){
              var isInc=t.type==="income",isTrf=t.type==="transfer";
              var color=isTrf?"#94a3b8":isInc?"#06D6A0":"#FF416C";
              var sign=isTrf?"=":isInc?"+":"-";
              var pm2=PM.find(function(p){return p.id===t.payment;});
              var fromAcc=accounts.find(function(a){return a.id===t.account;});
              var toAcc=accounts.find(function(a){return a.id===t.toAccount;});
              return (
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:11,padding:"11px 14px",borderRadius:14,background:"rgba(255,255,255,0.035)",border:"1px solid rgba(255,255,255,0.055)",marginBottom:6}}>
                  <div style={{width:38,height:38,borderRadius:11,background:color+"1a",border:"1px solid "+color+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{catIcons[t.category]||"💸"}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#f1f5f9",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.description||t.category}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.38)",display:"flex",gap:6,flexWrap:"wrap"}}>
                      <span>{t.date}</span>
                      {pm2&&<span>· {pm2.icon} {pm2.label}</span>}
                      {isTrf&&fromAcc&&toAcc&&<span>· {fromAcc.icon}→{toAcc.icon}</span>}
                      {!isTrf&&fromAcc&&<span>· {fromAcc.icon} {fromAcc.name}</span>}
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:14,fontWeight:700,color:color}}>{sign}{fmt(t.amount)}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.28)",textTransform:"capitalize"}}>{t.category}</div>
                  </div>
                  <button onClick={function(){delTx(t.id);}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.2)",cursor:"pointer",fontSize:18,padding:"0 2px",lineHeight:1}}>×</button>
                </div>
              );
            })}
          </div>
        )}

        {tab==="accounts"&&(
          <div style={{padding:"0 20px",paddingBottom:80}}>

            {(function(){
              var ti=0,tp=0;
              accounts.forEach(function(acc){
                var at=txs.filter(function(t){return t.account===acc.id||t.toAccount===acc.id;});
                var b=at.reduce(function(s,t){if(t.type==="income"&&t.account===acc.id)return s+t.amount;if(t.type==="expense"&&t.account===acc.id)return s-t.amount;if(t.type==="transfer"&&t.toAccount===acc.id)return s+t.amount;if(t.type==="transfer"&&t.account===acc.id)return s-t.amount;return s;},acc.balance);
                if(acc.type==="investment"){var txI=at.filter(function(t){return t.toAccount===acc.id&&t.type==="transfer";}).reduce(function(s,t){return s+t.amount;},0);var v=txI+(acc.balance||0)+(acc.baseInvested||0);var pm3=(priceMap[acc.id]||{}).price;var m=pm3&&acc.shares?acc.shares*pm3+(acc.balance||0):acc.baseInvested?(acc.baseInvested+(acc.basePnl||0)):v;ti+=v;tp+=m-v;}
                else if(acc.type==="pension"){var txP2=at.filter(function(t){return t.toAccount===acc.id&&t.type==="transfer";}).reduce(function(s,t){return s+t.amount;},0);var v2=txP2+(acc.balance||0)+(acc.baseInvested||0);var m2=acc.shares&&acc.navManual?acc.shares*acc.navManual+(acc.balance||0):acc.baseInvested?(acc.baseInvested+(acc.basePnl||0)):v2;ti+=v2;tp+=m2-v2;}
                else{ti+=b;}
              });
              var tot=ti+tp,pct=ti>0?(tp/ti*100):0;
              return (
                <div style={{background:"linear-gradient(135deg,"+acA+"18,"+acB+"0a)",border:"1px solid "+acA+"33",borderRadius:20,padding:"18px 20px",marginBottom:20}}>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",marginBottom:14}}>Patrimonio Totale</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                    <div style={{background:"rgba(255,255,255,0.04)",borderRadius:13,padding:"12px 14px"}}>
                      <div style={tUp10}>Investito / Depositato</div>
                      <div style={{fontSize:20,fontWeight:800,color:"#f1f5f9"}}>{fmt(ti)}</div>
                    </div>
                    <div style={{background:tp>=0?"rgba(6,214,160,0.08)":"rgba(255,65,108,0.08)",border:"1px solid "+(tp>=0?"rgba(6,214,160,0.2)":"rgba(255,65,108,0.2)"),borderRadius:13,padding:"12px 14px"}}>
                      <div style={tUp10}>{tp>=0?"+P/L":"-P/L"}</div>
                      <div style={{fontSize:20,fontWeight:800,color:tp>=0?"#06D6A0":"#FF416C"}}>{tp>=0?"+":""}{fmt(tp)}</div>
                      <div style={{fontSize:11,fontWeight:600,color:tp>=0?"rgba(6,214,160,0.7)":"rgba(255,65,108,0.7)",marginTop:2}}>{pct>=0?"+":""}{pct.toFixed(2)}%</div>
                    </div>
                  </div>
                  <div style={{paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:600}}>Valore Totale</div>
                    <div style={{fontSize:22,fontWeight:800,color:acA}}>{fmt(tot)}</div>
                  </div>
                </div>
              );
            })()}

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:18,fontWeight:800}}>I tuoi Conti</div>
              <button onClick={function(){setShowNewAcc(function(s){return !s;});}} style={{padding:"7px 16px",borderRadius:12,border:"none",cursor:"pointer",fontSize:13,fontWeight:700,background:"linear-gradient(135deg,"+acA+","+acB+")",color:"#fff"}}>+ Nuovo</button>
            </div>

            {accounts.map(function(acc){
              var atxs=txs.filter(function(t){return t.account===acc.id||t.toAccount===acc.id;});
              var bal=atxs.reduce(function(s,t){
                if(t.type==="income"&&t.account===acc.id)return s+t.amount;
                if(t.type==="expense"&&t.account===acc.id)return s-t.amount;
                if(t.type==="transfer"&&t.toAccount===acc.id)return s+t.amount;
                if(t.type==="transfer"&&t.account===acc.id)return s-t.amount;
                return s;
              },acc.balance);
              var isOpen=expandedAcc===acc.id;
              var versato=0, mktVal=null, pnl=null, pnlPct=null;
              if(acc.type==="investment"){
                var txIn=atxs.filter(function(t){return t.toAccount===acc.id&&t.type==="transfer";}).reduce(function(s,t){return s+t.amount;},0);
                versato=txIn+(acc.balance||0)+(acc.baseInvested||0);
                mktVal=(priceMap[acc.id]&&priceMap[acc.id].price)&&acc.shares?acc.shares*priceMap[acc.id].price+(acc.balance||0):null;
                if(mktVal===null&&acc.baseInvested){mktVal=acc.baseInvested+(acc.basePnl||0);}
                pnl=mktVal!==null?mktVal-versato:null;
                pnlPct=versato>0&&pnl!==null?(pnl/versato*100):null;
              }
              if(acc.type==="pension"){
                var txP=atxs.filter(function(t){return t.toAccount===acc.id&&t.type==="transfer";}).reduce(function(s,t){return s+t.amount;},0);
                versato=txP+(acc.balance||0)+(acc.baseInvested||0);
                mktVal=acc.shares&&acc.navManual?acc.shares*acc.navManual+(acc.balance||0):null;
                if(mktVal===null&&acc.baseInvested){mktVal=acc.baseInvested+(acc.basePnl||0);}
                pnl=mktVal!==null?mktVal-versato:null;
                pnlPct=versato>0&&pnl!==null?(pnl/versato*100):null;
              }
              return (
                <div key={acc.id} style={{marginBottom:10}}>
                  <div onClick={function(){setExpandedAcc(isOpen?null:acc.id);}} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",cursor:"pointer",borderRadius:isOpen?"14px 14px 0 0":14,background:isOpen?acc.color+"1a":"rgba(255,255,255,0.04)",border:"1px solid "+(isOpen?acc.color+"44":"rgba(255,255,255,0.07)"),borderLeft:"4px solid "+acc.color}}>
                    <div style={{width:42,height:42,borderRadius:12,background:acc.color+"22",border:"1px solid "+acc.color+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{acc.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:700}}>{acc.name}</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>{acc.type==="investment"?"ETF · "+acc.ticker:acc.type==="pension"?acc.fund:atxs.filter(function(t){return t.type!=="transfer";}).length+" movimenti"}</div>
                    </div>
                    {(acc.type==="investment"||acc.type==="pension")?(
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>Versato</div>
                        <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{fmt(versato)}</div>
                        {pnl!==null&&<div style={{fontSize:12,fontWeight:700,color:pnl>=0?"#06D6A0":"#FF416C"}}>{pnl>=0?"+":""}{fmt(pnl)}</div>}
                        {mktVal!==null&&<div style={{fontSize:14,fontWeight:800,color:acc.color}}>{fmt(mktVal)}</div>}
                      </div>
                    ):(
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:18,fontWeight:800,color:bal>=0?"#06D6A0":"#FF416C"}}>{fmt(bal)}</div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>saldo</div>
                      </div>
                    )}
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▾</div>
                  </div>
                  <div style={{overflow:"hidden",maxHeight:isOpen?"600px":"0",opacity:isOpen?1:0,transition:"max-height 0.4s ease,opacity 0.3s ease",background:"rgba(0,0,0,0.2)",border:isOpen?"1px solid "+acc.color+"33":"none",borderTop:"none",borderRadius:"0 0 14px 14px"}}>
                    <div style={{padding:"14px 16px 16px"}}>
                      {acc.type==="investment"&&(
                        <div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                            <div style={statBox}>
                              <div style={tUp9}>Versato</div>
                              <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>{fmt(versato)}</div>
                            </div>
                            <div style={pnlBox(pnl)}>
                              <div style={tUp9}>{pnl===null||pnl>=0?"Plusval.":"Minusval."}</div>
                              <div style={{fontSize:13,fontWeight:800,color:pnl!==null&&pnl>=0?"#06D6A0":"#FF416C"}}>{pnl!==null?(pnl>=0?"+":"")+fmt(pnl):"---"}</div>
                              {pnlPct!==null&&<div style={{fontSize:9,color:"rgba(255,255,255,0.5)"}}>{pnlPct>=0?"+":""}{pnlPct.toFixed(1)}%</div>}
                            </div>
                            <div style={accBox(acc)}>
                              <div style={tUp9}>Totale</div>
                              <div style={{fontSize:13,fontWeight:800,color:acc.color}}>{mktVal!==null?fmt(mktVal):"---"}</div>
                            </div>
                          </div>
                          {(function(){var pd=priceMap[acc.id]||{};var perr=priceError[acc.id];var avt=acc.avTicker||acc.ticker||"";var noKey=!AlphaVantageService.readApiKey();return (
                              <div style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 12px",marginBottom:10}}>
                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                                  <div style={{flex:1}}>
                                    <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",marginBottom:3,display:"flex",gap:5}}>
                                      <span>Ticker:</span>
                                      {editTicker===acc.id?(
                                        <input autoFocus defaultValue={avt} placeholder="es. IWDA.AS" onBlur={function(e){var t=e.target.value.trim();if(t){var na=accounts.map(function(a){return a.id===acc.id?Object.assign({},a,{avTicker:t}):a;});saveAccounts(na);fetchPriceForAcc(Object.assign({},acc,{avTicker:t}));}setEditTicker(null);}} onKeyDown={function(e){if(e.key==="Enter")e.target.blur();}} style={{background:"rgba(255,255,255,0.12)",border:"1px solid "+acA,borderRadius:6,color:"#fff",padding:"2px 8px",fontSize:11,outline:"none",width:110}}/>
                                      ):(
                                        <span onClick={function(e){e.stopPropagation();setEditTicker(acc.id);}} style={{color:acA,fontWeight:700,cursor:"pointer"}}>{avt||"—"} <span style={{opacity:0.5}}>✏</span></span>
                                      )}
                                    </div>
                                    {noKey?(
                                      <div style={{fontSize:11,color:"#FFD60A",fontWeight:600}}>⚠ Imposta API Key in Impostazioni</div>
                                    ):perr&&perr!=="cache"?(
                                      <div>
                                        <div style={{fontSize:11,color:"#FF416C",fontWeight:600}}>❌ {typeof perr==="string"?perr:"Errore"}</div>
                                        {pd.price&&<div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:2}}>Ultimo noto: €{pd.price.toFixed(2)}</div>}
                                      </div>
                                    ):(
                                      <div>
                                        <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                                          <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>{pd.price?"€"+pd.price.toFixed(2):"---"}</div>
                                          {pd.change!=null&&<div style={{fontSize:11,fontWeight:700,color:pd.change>=0?"#06D6A0":"#FF416C"}}>{pd.change>=0?"+":""}{pd.change.toFixed(2)}%</div>}
                                        </div>
                                        {pd.fromCache&&<div style={{fontSize:9,color:"rgba(255,255,255,0.35)"}}>📦 Cache · aggiorna con 🔄</div>}
                                      </div>
                                    )}
                                    {pd.ts&&<div style={{fontSize:9,color:"rgba(255,255,255,0.25)"}}>⏱ {pd.ts}</div>}
                                  </div>
                                  <button onClick={function(e){e.stopPropagation();fetchPriceForAcc(acc);}} style={{padding:"6px 10px",borderRadius:9,border:"1px solid rgba(255,255,255,0.15)",cursor:"pointer",fontSize:12,background:"transparent",color:"rgba(255,255,255,0.6)",flexShrink:0,marginLeft:8}}>{priceLoading?"⏳":"🔄"}</button>
                                </div>
                              </div>
                            );})()}

                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                            <div style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"8px 12px"}}>
                              <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",marginBottom:3}}>Quote detenute</div>
                              <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>{acc.shares||0}</div>
                              {acc.annualFee>0&&<div style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginTop:2}}>TER {acc.annualFee}%</div>}
                            </div>
                            <div style={{background:(acc.balance||0)>0?"rgba(255,214,10,0.1)":"rgba(255,255,255,0.04)",border:(acc.balance||0)>0?"1px solid rgba(255,214,10,0.25)":"none",borderRadius:10,padding:"8px 12px"}}>
                              <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",marginBottom:3}}>Liquidità disponibile</div>
                              <div style={{fontSize:14,fontWeight:800,color:(acc.balance||0)>0?"#FFD60A":"rgba(255,255,255,0.3)"}}>{(acc.balance||0)>0?fmt(acc.balance):"---"}</div>
                              
                            </div>
                          </div>
                          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                            <button onClick={function(e){e.stopPropagation();setBuyForm(buyForm&&buyForm.id===acc.id?null:{id:acc.id,type:"investment",qty:"",price:(priceMap[acc.id]&&priceMap[acc.id].price)?(priceMap[acc.id].price).toFixed(2):"",comm:String(acc.buyCommission||2),ter:String(acc.annualFee||0.2)});setBaseForm(null);setLiqForm(null);}} style={{padding:"8px 13px",borderRadius:10,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:"linear-gradient(135deg,#06D6A0,#00a07a)",color:"#000"}}>+ Acquisto quote</button>
                            <button onClick={function(e){e.stopPropagation();setBaseForm(baseForm&&baseForm.id===acc.id?null:{id:acc.id,type:"investment",invested:String(acc.baseInvested||""),pnl:String(acc.basePnl||"")});setBuyForm(null);setLiqForm(null);}} style={outBtn}>📊 Base storica</button>
                            <button onClick={function(e){e.stopPropagation();setLiqForm(liqForm&&liqForm.id===acc.id?null:{id:acc.id,val:String(acc.balance||"")});setBuyForm(null);setBaseForm(null);}} style={outBtn}>💰 Liquidità</button>
                          </div>
                          {buyForm&&buyForm.id===acc.id&&buyForm.type==="investment"&&(
                            <div style={fbox_inv}>
                              <div style={{fontSize:11,fontWeight:700,color:"#06D6A0",marginBottom:10}}>Acquisto IWDA</div>
                              <div style={fgrid}>
                                <div><div style={flbl}>N° quote</div><input type="number" step="any" placeholder="es. 5" value={buyForm.qty} onChange={function(e){setBuyForm(function(f){return Object.assign({},f,{qty:e.target.value});});}} style={{...finp,fontSize:15,fontWeight:700}}/></div>
                                <div><div style={flbl}>Prezzo/quota (€)</div><input type="number" step="any" placeholder="es. 95.40" value={buyForm.price} onChange={function(e){setBuyForm(function(f){return Object.assign({},f,{price:e.target.value});});}} style={{...finp,fontSize:15,fontWeight:700}}/></div>
                              </div>
                              <div style={{...fgrid,marginBottom:10}}>
                                <div><div style={flbl}>Commissione (€)</div><input type="number" step="any" value={buyForm.comm} onChange={function(e){setBuyForm(function(f){return Object.assign({},f,{comm:e.target.value});});}} style={{...finp,fontSize:14}}/></div>
                                <div><div style={flbl}>TER annuo (%)</div><input type="number" step="any" value={buyForm.ter} onChange={function(e){setBuyForm(function(f){return Object.assign({},f,{ter:e.target.value});});}} style={{...finp,fontSize:14}}/></div>
                              </div>
                              {buyForm.qty&&buyForm.price&&<div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginBottom:8}}>Totale: {fmt(parseFloat(buyForm.qty||0)*parseFloat(buyForm.price||0)+parseFloat(buyForm.comm||0))}</div>}
                              <div style={{display:"flex",gap:8}}>
                                <button onClick={function(){var q=parseFloat(buyForm.qty),p=parseFloat(buyForm.price),c=parseFloat(buyForm.comm)||0,t=parseFloat(buyForm.ter)||acc.annualFee||0.2;if(isNaN(q)||isNaN(p))return;saveAccounts(accounts.map(function(a){return a.id===acc.id?Object.assign({},a,{shares:(a.shares||0)+q,buyCommission:c,annualFee:t}):a;}));saveTxs([{id:gid(),type:"expense",amount:q*p+c,category:"investment",description:"Acquisto "+q+" quote IWDA @ €"+p.toFixed(2),date:new Date().toISOString().split("T")[0],payment:"bank",account:acc.id}].concat(txs));setBuyForm(null);}} style={{...fbtn,background:"linear-gradient(135deg,#06D6A0,#00a07a)",color:"#000"}}>Conferma</button>
                                <button onClick={function(){setBuyForm(null);}} style={fcnl}>✕</button>
                              </div>
                            </div>
                          )}
                          {baseForm&&baseForm.id===acc.id&&(
                            <div style={fbox_base}>
                              <div style={{fontSize:11,fontWeight:700,color:acA,marginBottom:4}}>Base storica</div>
                                              <div style={fgrid}>
                                <div><div style={flbl}>Totale versato (€)</div><input type="number" step="any" placeholder="es. 51000" value={baseForm.invested} onChange={function(e){setBaseForm(function(f){return Object.assign({},f,{invested:e.target.value});});}} style={{...finp,fontSize:15,fontWeight:700}}/></div>
                                <div><div style={flbl}>P/L attuale (€)</div><input type="number" step="any" placeholder="es. 32500" value={baseForm.pnl} onChange={function(e){setBaseForm(function(f){return Object.assign({},f,{pnl:e.target.value});});}} style={{...finp,fontSize:15,fontWeight:700}}/></div>
                              </div>
                              <div style={{display:"flex",gap:8}}>
                                <button onClick={function(){var inv=parseFloat(baseForm.invested),pnlV=parseFloat(baseForm.pnl)||0;if(isNaN(inv))return;saveAccounts(accounts.map(function(a){return a.id===acc.id?Object.assign({},a,{baseInvested:inv,basePnl:pnlV}):a;}));setBaseForm(null);}} style={{...fbtn,background:"linear-gradient(135deg,"+acA+","+acB+")",color:"#fff"}}>Salva</button>
                                <button onClick={function(){setBaseForm(null);}} style={fcnl}>✕</button>
                              </div>
                            </div>
                          )}
                          {liqForm&&liqForm.id===acc.id&&(
                            <div style={fbox_liq}>
                              <div style={{fontSize:11,fontWeight:700,color:"#FFD60A",marginBottom:4}}>Liquidità conto</div>
                                              <input type="number" step="any" placeholder="es. 2400" value={liqForm.val} onChange={function(e){setLiqForm(function(f){return Object.assign({},f,{val:e.target.value});});}} style={{...finp,fontSize:16,fontWeight:700,marginBottom:10}}/>
                              <div style={{display:"flex",gap:8}}>
                                <button onClick={function(){var v=parseFloat(liqForm.val);if(isNaN(v))return;saveAccounts(accounts.map(function(a){return a.id===acc.id?Object.assign({},a,{balance:v}):a;}));setLiqForm(null);}} style={{...fbtn,background:"linear-gradient(135deg,#FFD60A,#F59E0B)",color:"#000"}}>Salva</button>
                                <button onClick={function(){setLiqForm(null);}} style={fcnl}>✕</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {acc.type==="pension"&&(
                        <div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                            <div style={statBox}>
                              <div style={tUp9}>Versato</div>
                              <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>{fmt(versato)}</div>
                            </div>
                            <div style={pnlBox(pnl)}>
                              <div style={tUp9}>{pnl===null||pnl>=0?"Plusval.":"Minusval."}</div>
                              <div style={{fontSize:13,fontWeight:800,color:pnl!==null&&pnl>=0?"#06D6A0":"#FF416C"}}>{pnl!==null?(pnl>=0?"+":"")+fmt(pnl):"---"}</div>
                              {pnlPct!==null&&<div style={{fontSize:9,color:"rgba(255,255,255,0.5)"}}>{pnlPct>=0?"+":""}{pnlPct.toFixed(1)}%</div>}
                            </div>
                            <div style={accBox(acc)}>
                              <div style={tUp9}>Totale</div>
                              <div style={{fontSize:13,fontWeight:800,color:acc.color}}>{mktVal!==null?fmt(mktVal):"---"}</div>
                            </div>
                          </div>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
                            <div style={{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"8px 10px"}}>
                              <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",marginBottom:3}}>NAV</div>
                              <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>{acc.navManual>0?"€"+acc.navManual.toFixed(4):"---"}</div>
                            </div>
                            <div style={{background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"8px 10px"}}>
                              <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",marginBottom:3}}>Quote</div>
                              <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>{(acc.shares||0).toFixed(4)}</div>
                            </div>
                            <div style={{background:(acc.balance||0)>0?"rgba(255,214,10,0.1)":"rgba(255,255,255,0.04)",border:(acc.balance||0)>0?"1px solid rgba(255,214,10,0.2)":"none",borderRadius:10,padding:"8px 10px"}}>
                              <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",marginBottom:3}}>Liquidità</div>
                              <div style={{fontSize:13,fontWeight:800,color:(acc.balance||0)>0?"#FFD60A":"rgba(255,255,255,0.3)"}}>{(acc.balance||0)>0?fmt(acc.balance):"---"}</div>
                            </div>
                          </div>
                          <div style={{marginBottom:10}}>
                            <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",marginBottom:5,textTransform:"uppercase"}}>Comparto</div>
                            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                              {["Monetaria","Obbligazionaria","Bilanciata","Azionaria"].map(function(c){
                                var full="Linea "+c;
                                var active=acc.comparto===full;
                                var cc={"Monetaria":"#90E0EF","Obbligazionaria":"#4CC9F0","Bilanciata":"#F9844A","Azionaria":"#06D6A0"};
                                return <button key={c} onClick={function(e){e.stopPropagation();saveAccounts(accounts.map(function(a){return a.id===acc.id?Object.assign({},a,{comparto:full}):a;}));}} style={{padding:"5px 9px",borderRadius:8,cursor:"pointer",fontSize:10,fontWeight:600,border:"1px solid "+(active?cc[c]:"rgba(255,255,255,0.12)"),background:active?cc[c]+"22":"transparent",color:active?cc[c]:"rgba(255,255,255,0.4)"}}>{c}</button>;
                              })}
                            </div>
                          </div>
                          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                            <button onClick={function(e){e.stopPropagation();setBuyForm(buyForm&&buyForm.id===acc.id?null:{id:acc.id,type:"pension",qty:"",nav:String(acc.navManual||""),ter:String(acc.annualFee||0.1)});setBaseForm(null);setLiqForm(null);}} style={{padding:"8px 13px",borderRadius:10,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,background:"linear-gradient(135deg,#F9844A,#F72585)",color:"#fff"}}>+ Acquisto quote</button>
                            <button onClick={function(e){e.stopPropagation();setBaseForm(baseForm&&baseForm.id===acc.id?null:{id:acc.id,type:"pension",invested:String(acc.baseInvested||""),pnl:String(acc.basePnl||"")});setBuyForm(null);setLiqForm(null);}} style={outBtn}>📊 Base storica</button>
                            <button onClick={function(e){e.stopPropagation();setLiqForm(liqForm&&liqForm.id===acc.id?null:{id:acc.id,val:String(acc.balance||"")});setBuyForm(null);setBaseForm(null);}} style={outBtn}>💰 Liquidità</button>
                          </div>
                          {buyForm&&buyForm.id===acc.id&&buyForm.type==="pension"&&(
                            <div style={fbox_pens}>
                              <div style={{fontSize:11,fontWeight:700,color:"#F9844A",marginBottom:10}}>Acquisto {acc.fund}</div>
                              <div style={fgrid}>
                                <div><div style={flbl}>N° quote (es. 12.3456)</div><input type="number" step="any" placeholder="0.0000" value={buyForm.qty} onChange={function(e){setBuyForm(function(f){return Object.assign({},f,{qty:e.target.value});});}} style={{...finp,fontSize:15,fontWeight:700}}/></div>
                                <div><div style={flbl}>NAV acquisto (€)</div><input type="number" step="any" placeholder="es. 24.5678" value={buyForm.nav} onChange={function(e){setBuyForm(function(f){return Object.assign({},f,{nav:e.target.value});});}} style={{...finp,fontSize:15,fontWeight:700}}/></div>
                              </div>
                              <div style={{marginBottom:10}}><div style={flbl}>TER annuo (%)</div><input type="number" step="any" value={buyForm.ter} onChange={function(e){setBuyForm(function(f){return Object.assign({},f,{ter:e.target.value});});}} style={{...finp,fontSize:14}}/></div>
                              {buyForm.qty&&buyForm.nav&&<div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginBottom:8}}>Controvalore: {fmt(parseFloat(buyForm.qty||0)*parseFloat(buyForm.nav||0))}</div>}
                              <div style={{display:"flex",gap:8}}>
                                <button onClick={function(){var q=parseFloat(buyForm.qty),n=parseFloat(buyForm.nav),t=parseFloat(buyForm.ter)||acc.annualFee||0.1;if(isNaN(q)||isNaN(n))return;saveAccounts(accounts.map(function(a){return a.id===acc.id?Object.assign({},a,{shares:(a.shares||0)+q,navManual:n,annualFee:t}):a;}));saveTxs([{id:gid(),type:"expense",amount:q*n,category:"savings",description:"Acquisto "+q.toFixed(4)+" quote "+acc.fund+" @ NAV €"+n.toFixed(4),date:new Date().toISOString().split("T")[0],payment:"bank",account:acc.id}].concat(txs));setBuyForm(null);}} style={{...fbtn,background:"linear-gradient(135deg,#F9844A,#F72585)",color:"#fff"}}>Conferma</button>
                                <button onClick={function(){setBuyForm(null);}} style={fcnl}>✕</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {!acc.type&&(
                        <div>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",borderRadius:10,background:acc.color+"15",border:"1px solid "+acc.color+"30",marginBottom:10}}>
                            <div>
                              <div style={{fontSize:9,color:"rgba(255,255,255,0.4)"}}>Saldo attuale</div>
                              <div style={{fontSize:18,fontWeight:800,color:bal>=0?"#06D6A0":"#FF416C"}}>{fmt(bal)}</div>
                            </div>
                            <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{atxs.filter(function(t){return t.type!=="transfer";}).length} movimenti</div>
                          </div>
                          <div style={{marginTop:8}}>
                            <button onClick={function(e){e.stopPropagation();setLiqForm(liqForm&&liqForm.id===acc.id?null:{id:acc.id,val:String(acc.balance||"")});setBuyForm(null);setBaseForm(null);}} style={outBtn}>💰 Imposta saldo iniziale</button>
                          </div>
                          {liqForm&&liqForm.id===acc.id&&(
                            <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:13,padding:"14px",marginTop:10}}>
                              <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.7)",marginBottom:8}}>Saldo iniziale</div>
                              <input type="number" step="any" placeholder="es. 5000" value={liqForm.val} onChange={function(e){setLiqForm(function(f){return Object.assign({},f,{val:e.target.value});});}} style={{...finp,fontSize:16,fontWeight:700,marginBottom:10}}/>
                              <div style={{display:"flex",gap:8}}>
                                <button onClick={function(){var v=parseFloat(liqForm.val);if(isNaN(v))return;saveAccounts(accounts.map(function(a){return a.id===acc.id?Object.assign({},a,{balance:v}):a;}));setLiqForm(null);}} style={{...fbtn,background:"linear-gradient(135deg,"+acA+","+acB+")",color:"#fff"}}>Salva</button>
                                <button onClick={function(){setLiqForm(null);}} style={fcnl}>✕</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {showNewAcc&&(
              <div style={{...cs,padding:20,marginTop:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <div style={{fontSize:14,fontWeight:700}}>Nuovo Conto</div>
                  <button onClick={function(){setShowNewAcc(false);}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:22,lineHeight:1}}>×</button>
                </div>
                <input value={accForm.name} onChange={function(e){setAccForm(function(f){return Object.assign({},f,{name:e.target.value});});}} placeholder="es. Conto BancaX" style={{...inp,marginBottom:12}}/>
                <input type="number" value={accForm.balance} onChange={function(e){setAccForm(function(f){return Object.assign({},f,{balance:e.target.value});});}} placeholder="0.00" style={{...inp,marginBottom:12}}/>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                  {["🏦","🏛️","💳","👜","💼","🪙","💰","🏠","🛡️","📈","🎯","💎","🏧","💹"].map(function(ic){
                    return <button key={ic} onClick={function(){setAccForm(function(f){return Object.assign({},f,{icon:ic});});}} style={{width:36,height:36,borderRadius:10,fontSize:18,cursor:"pointer",border:"2px solid "+(accForm.icon===ic?"#fff":"rgba(255,255,255,0.15)"),background:"rgba(255,255,255,0.07)"}}>{ic}</button>;
                  })}
                </div>
                <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
                  {["#4361EE","#06D6A0","#F9844A","#F72585","#FFD60A","#8B5CF6","#FB7185","#43AA8B","#4CC9F0","#E63946"].map(function(c){
                    return <button key={c} onClick={function(){setAccForm(function(f){return Object.assign({},f,{color:c});});}} style={{width:28,height:28,borderRadius:8,background:c,cursor:"pointer",border:"3px solid "+(accForm.color===c?"#fff":"transparent")}}></button>;
                  })}
                </div>
                <button onClick={addAccount} style={{width:"100%",padding:"13px",borderRadius:14,border:"none",cursor:"pointer",background:"linear-gradient(135deg,"+acA+","+acB+")",color:"#fff",fontSize:14,fontWeight:700}}>Crea Conto</button>
              </div>
            )}
          </div>
        )}

        {tab==="analytics"&&(
          <div style={{padding:"0 20px",paddingBottom:80}}>
            <div style={{display:"flex",gap:6,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
              {["3m","6m","12m","year"].map(function(p){
                return <button key={p} onClick={function(){setChartPeriod(p);}} style={{padding:"6px 13px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:600,border:"1px solid "+(chartPeriod===p?acA:"rgba(255,255,255,0.14)"),background:chartPeriod===p?acA+"22":"transparent",color:chartPeriod===p?acA:"rgba(255,255,255,0.45)"}}>{p==="3m"?"3 mesi":p==="6m"?"6 mesi":p==="12m"?"12 mesi":"Anno"}</button>;
              })}
              {chartPeriod==="year"&&(
                <select value={chartYear} onChange={function(e){setChartYear(parseInt(e.target.value));}} style={{padding:"6px 10px",borderRadius:20,border:"1px solid "+acA,background:"rgba(255,255,255,0.06)",color:acA,fontSize:12,fontWeight:700,outline:"none",cursor:"pointer",appearance:"none",WebkitAppearance:"none",paddingRight:24}}>
                  {(function(){
                    var years=[];
                    var thisYear=new Date().getFullYear();
                    for(var y=thisYear;y>=2015;y--) years.push(y);
                    return years.map(function(y){return <option key={y} value={y} style={{background:"#0d0d1a",color:"#fff"}}>{y}</option>;});
                  })()}
                </select>
              )}
            </div>

            <div style={{...cs,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={sHdr14}>Entrate / Uscite / Trasferimenti</div>
                {chartPeriod==="year"&&<div style={{fontSize:11,fontWeight:700,color:acA}}>{chartYear}</div>}
              </div>
              {(function(){
                var maxV=Math.max.apply(null,chartData.map(function(x){return Math.max(x.income,x.expenses,x.transfers);}))||1;
                var fmtK=function(v){return v>=1000?(v/1000).toFixed(1)+"k":""+Math.round(v);};
                var ticks=[0,maxV*0.5,maxV].map(function(v){return Math.round(v);});
                return (
                  <div style={{display:"flex",gap:0}}>
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between",paddingBottom:22,paddingRight:4,width:30,flexShrink:0,alignItems:"flex-end"}}>
                      {ticks.slice().reverse().map(function(v,i){return <div key={i} style={{fontSize:8,color:"rgba(255,255,255,0.28)"}}>{fmtK(v)}</div>;})}
                    </div>
                    <div style={{flex:1,position:"relative"}}>
                      <div style={{position:"absolute",top:0,left:0,right:0,bottom:22,pointerEvents:"none",borderLeft:"1px solid rgba(255,255,255,0.06)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}/>
                      <div style={{display:"flex",alignItems:"flex-end",gap:2,height:160,paddingBottom:20}}>
                        {chartData.map(function(d,i){
                          var n2=chartPeriod==="3m"?3:chartPeriod==="6m"?6:12;
                          var dt2=chartPeriod==="year"?new Date(chartYear,i,1):new Date(curYear,curMonth-(n2-1-i),1);
                          return (
                            <div key={i} onClick={function(){setViewMonth(dt2);setTab("dashboard");}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",height:"100%",cursor:"pointer"}}>
                              <div style={{flex:1,display:"flex",alignItems:"flex-end",gap:1,width:"100%"}}>
                                <div style={{flex:1,borderRadius:"3px 3px 0 0",background:"#06D6A0",height:((d.income/maxV)*100)+"%",minHeight:d.income>0?2:0,transition:"opacity 0.15s"}} onMouseEnter={function(e){e.currentTarget.style.opacity="0.7";}} onMouseLeave={function(e){e.currentTarget.style.opacity="1";}}/>
                                <div style={{flex:1,borderRadius:"3px 3px 0 0",background:"#FF416C",height:((d.expenses/maxV)*100)+"%",minHeight:d.expenses>0?2:0,transition:"opacity 0.15s"}} onMouseEnter={function(e){e.currentTarget.style.opacity="0.7";}} onMouseLeave={function(e){e.currentTarget.style.opacity="1";}}/>
                                {d.transfers>0&&<div style={{flex:1,borderRadius:"3px 3px 0 0",background:"#94a3b8",height:((d.transfers/maxV)*100)+"%",minHeight:2,transition:"opacity 0.15s"}} onMouseEnter={function(e){e.currentTarget.style.opacity="0.7";}} onMouseLeave={function(e){e.currentTarget.style.opacity="1";}}/>}
                              </div>
                              <div style={{fontSize:8,color:"rgba(255,255,255,0.4)",marginTop:4,lineHeight:1}}>{d.label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
              <div style={{display:"flex",gap:14,justifyContent:"center",marginTop:8}}>
                {[["#06D6A0","Entrate"],["#FF416C","Uscite"],["#94a3b8","Trasferimenti"]].map(function(x){
                  return <div key={x[1]} style={{display:"flex",alignItems:"center",gap:5,fontSize:11}}><div style={{width:9,height:9,borderRadius:2,background:x[0]}}/><span style={{color:"rgba(255,255,255,0.45)"}}>{x[1]}</span></div>;
                })}
              </div>
            </div>

            <div style={{...cs}}>
              <div style={sHdr14}>Spese per Categoria</div>
              {catBreak.map(function(item){
                var cat=item[0],amt=item[1];
                var pct=monthExpenses>0?((amt/monthExpenses)*100).toFixed(1):0;
                var color=COLORS[cat]||"#aaa";
                return (
                  <div key={cat} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                    <div style={{width:32,height:32,borderRadius:9,background:color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{catIcons[cat]||"💸"}</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span style={{textTransform:"capitalize"}}>{cat}</span><span style={{fontWeight:700,color:color}}>{fmt(amt)}</span></div>
                      <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,0.07)"}}><div style={{height:"100%",borderRadius:2,background:color,width:pct+"%"}}/></div>
                    </div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.38)",width:32,textAlign:"right"}}>{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab==="history"&&(
          <div style={{padding:"0 20px",paddingBottom:80}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <button onClick={function(){setHistoryYear(function(y){return y>2015?y-1:y;});}} style={hBtn}>&#8249;</button>
              <div style={{fontSize:20,fontWeight:800,color:acA}}>{historyYear}</div>
              <button onClick={function(){setHistoryYear(function(y){return y<new Date().getFullYear()?y+1:y;});}} style={hBtn}>&#8250;</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {getMonthsForYear(historyYear).map(function(item){
                var m=item.month,income=item.income,expenses=item.expenses,txCount=item.txCount;
                var bal=income-expenses;
                var isAct=m===curMonth&&historyYear===curYear;
                var isEdit=editingMonth&&editingMonth.year===historyYear&&editingMonth.month===m;
                var defDate=historyYear+"-"+(String(m+1).padStart(2,"0"))+"-15";
                return (
                  <div key={m} style={{borderRadius:14,overflow:"hidden",border:isAct?"1px solid "+acA+"66":"1px solid rgba(255,255,255,0.07)",background:isAct?acA+"15":"rgba(255,255,255,0.025)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px"}}>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:800,fontSize:14,color:isAct?acA:"#f1f5f9",marginBottom:4}}>{MONTHS_F[m]}</div>
                        <div style={{display:"flex",gap:10,alignItems:"center"}}>
                          <span style={{fontSize:12,color:"#06D6A0"}}>+{fmt(income)}</span>
                          <span style={{fontSize:12,color:"#FF416C"}}>-{fmt(expenses)}</span>
                          <span style={{fontSize:12,fontWeight:800,color:bal>=0?"#06D6A0":"#FF416C"}}>{bal>=0?"+":""}{fmt(bal)}</span>
                        </div>
                        <div style={{fontSize:9,color:"rgba(255,255,255,0.28)",marginTop:2}}>{txCount} movimenti</div>
                      </div>
                      <button onClick={function(){setEditingMonth(isEdit?null:{year:historyYear,month:m,type:"expense",amount:"",description:"",category:"other",account:accounts[0]?accounts[0].id:"",toAccount:accounts[1]?accounts[1].id:"",date:defDate});}} style={{padding:"6px 12px",borderRadius:10,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:isEdit?acA+"33":"rgba(255,255,255,0.08)",color:isEdit?acA:"rgba(255,255,255,0.55)",flexShrink:0}}>{isEdit?"Chiudi":"+ Aggiungi"}</button>
                    </div>
                    {isEdit&&(
                      <div style={{padding:"0 14px 14px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                        <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",margin:"10px 0"}}>+ {MONTHS_F[m]} {historyYear}</div>
                        <div style={{display:"flex",gap:5,marginBottom:10}}>
                          {[["expense","Uscita","#FF416C"],["income","Entrata","#06D6A0"],["transfer","Trasf.",acA]].map(function(x){
                            var active=editingMonth.type===x[0];
                            return <button key={x[0]} onClick={function(){setEditingMonth(function(h){return Object.assign({},h,{type:x[0]});});}} style={{flex:1,padding:"7px 4px",borderRadius:9,cursor:"pointer",fontSize:11,fontWeight:700,border:"1px solid "+(active?x[2]:"rgba(255,255,255,0.1)"),background:active?x[2]+"22":"transparent",color:active?x[2]:"rgba(255,255,255,0.4)"}}>{x[1]}</button>;
                          })}
                        </div>
                        <div style={fgrid}>
                          <input type="number" placeholder="Importo" value={editingMonth.amount} onChange={function(e){setEditingMonth(function(h){return Object.assign({},h,{amount:e.target.value});});}} style={{...finp,fontSize:15,fontWeight:700}}/>
                          <input type="date" value={editingMonth.date} onChange={function(e){setEditingMonth(function(h){return Object.assign({},h,{date:e.target.value});});}} style={{...finp,fontSize:12}}/>
                        </div>
                        <input type="text" placeholder="Descrizione" value={editingMonth.description} onChange={function(e){setEditingMonth(function(h){return Object.assign({},h,{description:e.target.value});});}} style={{...finp,fontSize:13,marginBottom:8}}/>
                        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                          {accounts.map(function(a){var active=editingMonth.account===a.id;return <button key={a.id} onClick={function(){setEditingMonth(function(h){return Object.assign({},h,{account:a.id});});}} style={{padding:"5px 10px",borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:600,border:"1px solid "+(active?a.color:"rgba(255,255,255,0.1)"),background:active?a.color+"22":"transparent",color:active?a.color:"rgba(255,255,255,0.4)"}}>{a.icon} {a.name}</button>;})}
                        </div>
                        <button onClick={function(){if(!editingMonth.amount||isNaN(editingMonth.amount))return;var t={id:gid(),type:editingMonth.type,amount:Math.abs(parseFloat(editingMonth.amount)),category:editingMonth.type==="transfer"?"transfer":editingMonth.category,description:editingMonth.description||"Movimento storico",date:editingMonth.date,payment:"cash",account:editingMonth.account};if(editingMonth.type==="transfer")t.toAccount=editingMonth.toAccount;saveTxs([t].concat(txs));setEditingMonth(function(h){return Object.assign({},h,{amount:"",description:"",category:"other"});});}} style={{width:"100%",padding:"10px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:800,background:editingMonth.type==="income"?"linear-gradient(135deg,#06D6A0,#00a07a)":editingMonth.type==="transfer"?"linear-gradient(135deg,"+acA+","+acB+")":"linear-gradient(135deg,#FF416C,#c0003a)",color:editingMonth.type==="income"?"#000":"#fff"}}>+ Registra</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab==="settings"&&(
          <div style={{padding:"0 20px",paddingBottom:80}}>
            <div style={{fontSize:18,fontWeight:800,marginBottom:20}}>Impostazioni</div>

            <div style={{...cs,marginBottom:14}}>
              <div style={sHdr}>Colore Sfondo</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
                {BG_COLORS.map(function(c){
                  var active=settings.bgColor===c.hex;
                  return (
                    <button key={c.hex} onClick={function(){saveSett(Object.assign({},settings,{bgColor:c.hex}));}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:0}}>
                      <div style={{width:36,height:36,borderRadius:10,background:c.hex,border:"3px solid "+(active?"#fff":"transparent")}}/>
                      <div style={{fontSize:8,color:"rgba(255,255,255,0.4)"}}>{c.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{...cs,marginBottom:14}}>
              <div style={sHdr}>Colore Accento</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
                {ACCENTS.map(function(a){
                  return <button key={a.id} onClick={function(){saveSett(Object.assign({},settings,{accentA:a.a,accentB:a.b}));}} style={{height:36,borderRadius:10,cursor:"pointer",background:"linear-gradient(135deg,"+a.a+","+a.b+")",border:"2px solid "+(settings.accentA===a.a?"#fff":"transparent")}}/>; 
                })}
              </div>
            </div>

            <div style={{...cs,marginBottom:14}}>
              <div style={sHdr10}>Trasparenza Riquadri</div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Trasparente</span>
                <input type="range" min={1} max={12} value={settings.cardOpacity||5} onChange={function(e){saveSett(Object.assign({},settings,{cardOpacity:+e.target.value}));}} style={{flex:1,accentColor:acA}}/>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Solido</span>
              </div>
            </div>

            <div style={{...cs,marginBottom:14}}>
              <div style={sHdr}>Valuta</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {CURRENCIES.map(function(c){
                  var active=settings.currency===c.code;
                  return <button key={c.code} onClick={function(){saveSett(Object.assign({},settings,{currency:c.code}));}} style={{padding:"7px 14px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:600,border:"1px solid "+(active?acA:"rgba(255,255,255,0.12)"),background:active?acA+"22":"transparent",color:active?acA:"rgba(255,255,255,0.5)"}}>{c.symbol} {c.code}</button>;
                })}
              </div>
            </div>

            <div style={{...cs,marginBottom:14}}>
              <div style={sHdr}>Alpha Vantage API Key</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:8}}>Prezzi live ETF. Gratuito su <span style={{color:acA,fontWeight:600}}>alphavantage.co</span> (500 req/giorno, 5/min).</div>
              <div style={{display:"flex",gap:8}}>
                <input type="text" placeholder="Incolla qui la tua API key" defaultValue={avApiKey} id="av-key-input" style={{...inp,flex:1,fontSize:12,fontFamily:"monospace"}}/>
                <button onClick={function(){var v=document.getElementById("av-key-input").value.trim();AlphaVantageService.saveApiKey(v);setAvApiKey(v);if(v)fetchAllPrices();}} style={{padding:"0 14px",borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(135deg,"+acA+","+acB+")",color:"#fff",fontSize:13,fontWeight:700,flexShrink:0}}>Salva</button>
              </div>
              {avApiKey&&<div style={{marginTop:6,fontSize:10,color:"rgba(255,255,255,0.35)"}}>✓ Key attiva · aggiornamento ogni 15 min</div>}
            </div>

            <div style={{...cs,marginBottom:14}}>
              <div style={sHdr10}>Importa CSV</div>
              
              <button onClick={function(){fileRef.current.click();}} style={{width:"100%",padding:"12px",borderRadius:12,border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.04)",cursor:"pointer",color:"rgba(255,255,255,0.7)",fontSize:13,fontWeight:600}}>📂 Seleziona file CSV</button>
              <input type="file" accept=".csv,.txt" ref={fileRef} style={{display:"none"}} onChange={importCSV}/>
              {csvMsg&&<div style={{marginTop:10,padding:"10px 14px",borderRadius:10,background:csvMsg.startsWith("Nessuna")?"rgba(255,65,108,0.15)":"rgba(6,214,160,0.12)",border:"1px solid "+(csvMsg.startsWith("Nessuna")?"rgba(255,65,108,0.3)":"rgba(6,214,160,0.25)"),color:csvMsg.startsWith("Nessuna")?"#FF416C":"#06D6A0",fontSize:13,fontWeight:600}}>{csvMsg}</div>}
            </div>

            <div style={{...cs,marginBottom:14}}>
              <div style={sHdr}>Backup & Dati</div>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <div style={{flex:1,padding:"10px",borderRadius:10,background:"rgba(6,214,160,0.08)",border:"1px solid rgba(6,214,160,0.2)",textAlign:"center"}}>
                  <div style={{fontSize:20,fontWeight:800,color:"#06D6A0"}}>{txs.length}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>transazioni</div>
                </div>
                <div style={{flex:1,padding:"10px",borderRadius:10,background:"rgba(67,97,238,0.08)",border:"1px solid rgba(67,97,238,0.2)",textAlign:"center"}}>
                  <div style={{fontSize:20,fontWeight:800,color:acA}}>{accounts.length}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>conti</div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <button onClick={exportBackup} style={{flex:1,padding:"11px",borderRadius:12,border:"none",cursor:"pointer",background:"linear-gradient(135deg,"+acA+","+acB+")",color:"#fff",fontSize:13,fontWeight:700}}>⬇ Esporta</button>
                <button onClick={function(){backupRef.current.click();}} style={{flex:1,padding:"11px",borderRadius:12,border:"1px solid rgba(255,255,255,0.15)",cursor:"pointer",background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.8)",fontSize:13,fontWeight:700}}>⬆ Importa</button>
              </div>
              <input type="file" accept=".json" ref={backupRef} style={{display:"none"}} onChange={importBackup}/>

              {backupMsg&&<div style={{padding:"9px 12px",borderRadius:10,background:backupMsg[0]==="E"||backupMsg[0]==="F"?"rgba(255,65,108,0.12)":"rgba(6,214,160,0.1)",border:"1px solid "+(backupMsg[0]==="E"||backupMsg[0]==="F"?"rgba(255,65,108,0.3)":"rgba(6,214,160,0.25)"),color:backupMsg[0]==="E"||backupMsg[0]==="F"?"#FF416C":"#06D6A0",fontSize:12,fontWeight:600,marginBottom:8}}>{backupMsg}</div>}
              {confirmReset?(
                <div style={{display:"flex",gap:8}}>
                  <button onClick={function(){saveTxs([]);saveAccounts(DEFAULT_ACCOUNTS);saveSett({bgColor:"#0d0d1a",accentA:"#4361EE",accentB:"#7209B7",cardOpacity:5,currency:"EUR"});setConfirmReset(false);setBackupMsg("Reset completato");setTimeout(function(){setBackupMsg("");},3000);}} style={{...fbtn,background:"#FF416C",color:"#fff"}}>Sì, cancella tutto</button>
                  <button onClick={function(){setConfirmReset(false);}} style={fcnl}>Annulla</button>
                </div>
              ):(
                <button onClick={function(){setConfirmReset(true);}} style={{width:"100%",padding:"10px",borderRadius:10,border:"1px solid rgba(255,65,108,0.25)",background:"rgba(255,65,108,0.06)",cursor:"pointer",color:"#FF416C",fontSize:12,fontWeight:600}}>🗑 Reset tutti i dati</button>
              )}
            </div>
          </div>
        )}

        {showModal&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",backdropFilter:"blur(12px)",zIndex:300,display:"flex",alignItems:"flex-end"}} onClick={function(e){if(e.target===e.currentTarget)setShowModal(false);}}>
            <div ref={modalRef} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{width:"100%",maxWidth:500,margin:"0 auto",background:"#121224",borderRadius:"24px 24px 0 0",padding:"0 20px 44px",border:"1px solid rgba(255,255,255,0.1)",boxShadow:"0 -24px 60px rgba(0,0,0,0.6)",maxHeight:"90vh",overflowY:"auto"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"14px 0 18px",position:"relative"}}>
                <div style={{width:38,height:4,borderRadius:2,background:"rgba(255,255,255,0.18)",cursor:"grab"}}/>
                <button onClick={function(){setShowModal(false);}} style={{position:"absolute",right:0,top:10,width:30,height:30,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>×</button>
              </div>
                  <div style={{display:"flex",gap:6,marginBottom:18}}>
                {[{id:"expense",label:"Uscita",c:"#FF416C"},{id:"income",label:"Entrata",c:"#06D6A0"},{id:"transfer",label:"Trasferimento",c:acA}].map(function(t){
                  return <button key={t.id} onClick={function(){setTxType(t.id);}} style={{flex:1,padding:"10px 4px",borderRadius:12,cursor:"pointer",fontSize:11,fontWeight:700,border:"2px solid "+(txType===t.id?t.c:"rgba(255,255,255,0.1)"),background:txType===t.id?t.c+"22":"transparent",color:txType===t.id?t.c:"rgba(255,255,255,0.38)"}}>{t.label}</button>;
                })}
              </div>
              <label style={lbl}>Importo</label>
              <input type="number" placeholder="0,00" value={form.amount} onChange={function(e){setForm(function(f){return Object.assign({},f,{amount:e.target.value});});}} style={{...inp,fontSize:26,fontWeight:800,textAlign:"center",marginBottom:14}}/>
              <label style={lbl}>Descrizione</label>
              <input type="text" placeholder="A cosa serve?" value={form.description} onChange={function(e){setForm(function(f){return Object.assign({},f,{description:e.target.value});});}} style={{...inp,marginBottom:14}}/>
              <label style={lbl}>Data</label>
              <input type="date" value={form.date} onChange={function(e){setForm(function(f){return Object.assign({},f,{date:e.target.value});});}} style={{...inp,marginBottom:14}}/>
              <label style={lbl}>Conto</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                {accounts.map(function(a){
                  return <button key={a.id} onClick={function(){setForm(function(f){return Object.assign({},f,{account:a.id});});}} style={{padding:"7px 12px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:600,border:"1px solid "+(form.account===a.id?a.color:"rgba(255,255,255,0.12)"),background:form.account===a.id?a.color+"22":"transparent",color:form.account===a.id?a.color:"rgba(255,255,255,0.45)"}}>{a.icon} {a.name}</button>;
                })}
              </div>
              {txType==="transfer"&&(
                <div style={{marginBottom:14}}>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {accounts.filter(function(a){return a.id!==form.account;}).map(function(a){
                      return <button key={a.id} onClick={function(){setForm(function(f){return Object.assign({},f,{toAccount:a.id});});}} style={{padding:"7px 12px",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:600,border:"1px solid "+(form.toAccount===a.id?a.color:"rgba(255,255,255,0.12)"),background:form.toAccount===a.id?a.color+"22":"transparent",color:form.toAccount===a.id?a.color:"rgba(255,255,255,0.45)"}}>{a.icon} {a.name}</button>;
                    })}
                  </div>
                </div>
              )}
              {txType!=="transfer"&&(
                <div style={{marginBottom:14}}>
                  <label style={lbl}>Categoria</label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5,maxHeight:130,overflowY:"auto",marginBottom:8}}>
                    {(txType==="income"?allIncCats:allExpCats).map(function(c){
                      var icon=catIcons[c]||ICONS[c]||"💸";
                      var color=COLORS[c]||acA;
                      return <button key={c} onClick={function(){setForm(function(f){return Object.assign({},f,{category:c});});}} style={{padding:"5px 9px",borderRadius:9,cursor:"pointer",fontSize:11,border:"1px solid "+(form.category===c?color:"rgba(255,255,255,0.1)"),background:form.category===c?color+"22":"transparent",color:form.category===c?color:"rgba(255,255,255,0.45)"}}>{icon} {c}</button>;
                    })}
                    <button onClick={function(){setShowCustomCat(function(s){return !s;});}} style={{padding:"5px 9px",borderRadius:9,cursor:"pointer",fontSize:11,border:"1px solid "+(showCustomCat?acA:"rgba(255,255,255,0.18)"),background:showCustomCat?acA+"22":"transparent",color:showCustomCat?acA:"rgba(255,255,255,0.45)"}}>+ personalizza</button>
                  </div>
                  {showCustomCat&&(
                    <div style={{background:"rgba(255,255,255,0.06)",borderRadius:14,padding:14,border:"1px solid rgba(255,255,255,0.1)",marginBottom:8}}>
                      <div style={{fontSize:11,fontWeight:700,marginBottom:8,color:"rgba(255,255,255,0.6)"}}>Nuova categoria</div>
                      <div style={{display:"flex",gap:8,marginBottom:10}}>
                        <input value={newCatForm.name} onChange={function(e){setNewCatForm(function(f){return Object.assign({},f,{name:e.target.value});});}} placeholder="Nome" style={{...inp,flex:1,padding:"9px 11px",fontSize:13}}/>
                        <input value={newCatForm.icon} onChange={function(e){setNewCatForm(function(f){return Object.assign({},f,{icon:e.target.value});});}} style={{...inp,width:48,textAlign:"center",fontSize:20,padding:"9px 8px"}}/>
                      </div>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap",maxHeight:100,overflowY:"auto",marginBottom:10}}>
                        {EXTRA_EMOJI.map(function(em){
                          return <button key={em} onClick={function(){setNewCatForm(function(f){return Object.assign({},f,{icon:em});});}} style={{width:30,height:30,borderRadius:7,fontSize:16,cursor:"pointer",border:"1px solid "+(newCatForm.icon===em?"#fff":"rgba(255,255,255,0.1)"),background:newCatForm.icon===em?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.04)"}}>{em}</button>;
                        })}
                      </div>
                      <button onClick={addCustomCat} style={{width:"100%",padding:"9px",borderRadius:11,border:"none",cursor:"pointer",background:"linear-gradient(135deg,"+acA+","+acB+")",color:"#fff",fontSize:12,fontWeight:700}}>Crea e seleziona</button>
                    </div>
                  )}
                </div>
              )}
              <label style={lbl}>Metodo di Pagamento</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:22}}>
                {PM.map(function(p){
                  return <button key={p.id} onClick={function(){setForm(function(f){return Object.assign({},f,{payment:p.id});});}} style={{padding:"6px 11px",borderRadius:9,cursor:"pointer",fontSize:11,border:"1px solid "+(form.payment===p.id?acA:"rgba(255,255,255,0.1)"),background:form.payment===p.id?acA+"22":"transparent",color:form.payment===p.id?acA:"rgba(255,255,255,0.45)"}}>{p.icon} {p.label}</button>;
                })}
              </div>
              <button onClick={addTx} style={{width:"100%",padding:"15px",borderRadius:16,border:"none",cursor:"pointer",fontSize:15,fontWeight:800,color:"#fff",background:txType==="income"?"linear-gradient(135deg,#06D6A0,#00a07a)":txType==="transfer"?"linear-gradient(135deg,"+acA+","+acB+")":"linear-gradient(135deg,#FF416C,#c0003a)",boxShadow:txType==="income"?"0 8px 24px rgba(6,214,160,0.35)":txType==="transfer"?"0 8px 24px "+acA+"55":"0 8px 24px rgba(255,65,108,0.35)"}}>
                {txType==="income"?"+ Entrata":txType==="transfer"?"Trasferimento":"+ Uscita"}
              </button>
            </div>
          </div>
        )}

        <div onClick={function(){setTab(function(t){return t==="settings"?"dashboard":"settings";});}} style={{position:"fixed",bottom:0,left:0,right:0,zIndex:50,height:34,cursor:"pointer",background:tab==="settings"?"linear-gradient(90deg,"+acA+"22,"+acB+"22)":"rgba(255,255,255,0.05)",backdropFilter:"blur(12px)",borderTop:"1px solid "+(tab==="settings"?acA+"55":"rgba(255,255,255,0.08)"),display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          {tab==="settings"&&<button onClick={function(e){e.stopPropagation();setTab("dashboard");}} style={{position:"absolute",right:14,width:22,height:22,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>}
          <span style={{fontSize:13,color:tab==="settings"?acA:"rgba(255,255,255,0.4)",fontWeight:600}}>Impostazioni</span>
          <span style={{fontSize:14,color:tab==="settings"?acA:"rgba(255,255,255,0.35)"}}>&#9881;</span>
        </div>

      </div>
    </div>
  );
}
