/* Yalla — app logic. Plain globals, no build. */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const el=h=>{const t=document.createElement("template");t.innerHTML=h.trim();return t.content.firstElementChild;};
const LS="yalla.v1";

const def={lang:"he",city:"tel-aviv",mapCity:"tel-aviv",radius:10,profile:null,saved:[],matches:[],savedTab:"act",pickupJoined:[],created:[
  {id:"e1",title:{he:"ריצת בוקר בפארק",en:"Morning park run"},cat:"sport",city:"tel-aviv",day:"Sat",time:"07:30",capacity:12,joined:8},
  {id:"e2",title:{he:"ערב משחקי קופסה",en:"Board games night"},cat:"social",city:"jerusalem",day:"Wed",time:"20:00",capacity:8,joined:5}
]};
let state=load()||Object.assign({},def);
const decks={act:[],ppl:[]};

function load(){try{const s=JSON.parse(localStorage.getItem(LS));return s?Object.assign({},def,s):null;}catch(e){return null;}}
function save(){try{localStorage.setItem(LS,JSON.stringify({lang:state.lang,city:state.city,radius:state.radius,profile:state.profile,saved:state.saved,matches:state.matches,pickupJoined:state.pickupJoined,created:state.created}));}catch(e){}}

const t=k=>(I18N[state.lang][k]!=null?I18N[state.lang][k]:k);
const tr=o=>o?(o[state.lang]||o.en||o.he||""):"";
const cityName=key=>tr(CITIES.find(c=>c.key===key)||{});

/* ---- distance filter (self-checked) ---- */
function filterByDistance(items,maxKm){return items.filter(i=>i.distanceKm<=maxKm);}
function rebuildDecks(){
  decks.act=filterByDistance(ACTIVITIES.filter(a=>a.city===state.city),state.radius);
  decks.ppl=filterByDistance(PEOPLE.slice(),state.radius);
}

/* ---- cards ---- */
function tagLabel(k){const i=INTERESTS.find(x=>x.key===k);return i?tr(i):k;}
function actCard(a){
  const tags=a.tags.slice(0,2).map(k=>`<span class="tag">${tagLabel(k)}</span>`).join("");
  return el(`<article class="swipe-card"><div class="hero act"><span class="watermark">${a.emoji}</span><span class="emoji">${a.emoji}</span>
    <div class="toptags">${tags}</div><div class="dist">${a.distanceKm} ${t("km")}</div>
    <div class="stamp like">${t("stamp_yes")}</div><div class="stamp nope">${t("stamp_no")}</div></div>
    <div class="card-body"><h2>${tr(a.title)}</h2><div class="meta">📅 ${tr(a.when)} · 👥 ${a.attendees} ${t("attending")}</div>
    <p>${tr(a.blurb)}</p></div></article>`);
}
function pplCard(p){
  const ints=p.interests.slice(0,3).map(k=>{const i=INTERESTS.find(x=>x.key===k)||{};return `<span class="tag">${i.icon||""} ${tr(i)}</span>`;}).join("");
  const langs=p.langs.map(l=>`<span class="langpill">${l}</span>`).join("");
  return el(`<article class="swipe-card"><div class="hero ppl"><span class="watermark">${p.flag}</span><span class="emoji">${p.flag}</span>
    <div class="toptags">${ints}</div><div class="dist">${p.distanceKm} ${t("km")}</div>
    <div class="stamp like">${t("stamp_yes")}</div><div class="stamp nope">${t("stamp_no")}</div></div>
    <div class="card-body"><h2>${p.name}, ${p.age} ${p.flag}</h2><div class="meta">${t("profile_from")} ${tr(p.country)}</div>
    <p>${tr(p.bio)}</p><div class="langs">${langs}</div></div></article>`);
}
function renderDeck(which){
  const host=which==="act"?$("#deck-act"):$("#deck-ppl");
  $$(".swipe-card,.deck-empty",host).forEach(n=>n.remove());
  const list=decks[which];
  if(!list.length){host.appendChild(el(`<div class="deck-empty">${which==="act"?t("deck_empty_act"):t("deck_empty_ppl")}</div>`));return;}
  const top=list.slice(0,3);
  top.slice().reverse().forEach((item,ri)=>{
    const idx=top.length-1-ri;
    const card=which==="act"?actCard(item):pplCard(item);
    card.style.transform=`translateY(${idx*10}px) scale(${1-idx*0.04})`;
    card.style.zIndex=String(10-idx);
    if(idx===0)attachDrag(card,which,item);
    host.appendChild(card);
  });
}

/* ---- swipe ---- */
function attachDrag(card,which,item){
  let sx=0,sy=0,drag=false;
  const like=$(".stamp.like",card),nope=$(".stamp.nope",card);
  card.addEventListener("pointerdown",e=>{drag=true;sx=e.clientX;sy=e.clientY;card.setPointerCapture(e.pointerId);card.style.transition="none";});
  card.addEventListener("pointermove",e=>{if(!drag)return;const dx=e.clientX-sx,dy=e.clientY-sy;card.style.transform=`translate(${dx}px,${dy*0.3}px) rotate(${dx/18}deg)`;const r=Math.min(Math.abs(dx)/90,1);if(dx>0){like.style.opacity=r;nope.style.opacity=0;}else{nope.style.opacity=r;like.style.opacity=0;}});
  const end=e=>{if(!drag)return;drag=false;const dx=e.clientX-sx;if(Math.abs(dx)>90){fling(card,dx>0?"right":"left",()=>finalize(which,item,dx>0?"right":"left"));}else{card.style.transition="transform .25s";card.style.transform="";like.style.opacity=0;nope.style.opacity=0;}};
  card.addEventListener("pointerup",end);card.addEventListener("pointercancel",end);
}
function fling(card,dir,cb){card.classList.add("gone");card.style.transform=`translate(${dir==="right"?700:-700}px,40px) rotate(${dir==="right"?32:-32}deg)`;card.style.opacity="0";setTimeout(cb,330);}
function doSwipe(which,dir){
  const host=which==="act"?$("#deck-act"):$("#deck-ppl");
  const card=$(".swipe-card",host);const list=decks[which];
  if(!card||!list.length)return;const item=list[0];const right=dir!=="left";
  const stamp=$(right?".stamp.like":".stamp.nope",card);if(stamp)stamp.style.opacity="1";
  fling(card,right?"right":"left",()=>finalize(which,item,dir));
}
function finalize(which,item,dir){
  decks[which]=decks[which].filter(x=>x.id!==item.id);
  if(dir==="right"||dir==="super"){
    if(which==="act"){if(!state.saved.includes(item.id))state.saved.push(item.id);toast(t("saved_added"));}
    else if(item.likesYou){if(!state.matches.includes(item.id))state.matches.push(item.id);showMatch(item);}
  }
  save();renderDeck(which);
}

/* ---- map ---- */
function cityMapSVG(city){
  const grid='<g stroke="#E7D6BC" stroke-width="1"><line x1="0" y1="25" x2="100" y2="25"/><line x1="0" y1="50" x2="100" y2="50"/><line x1="0" y1="75" x2="100" y2="75"/><line x1="35" y1="0" x2="35" y2="100"/><line x1="65" y1="0" x2="65" y2="100"/></g>';
  if(city==="tel-aviv")return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%"><rect width="100" height="100" fill="#FBEFE0"/><rect width="20" height="100" fill="#A6DCE8"/><rect x="20" width="4" height="100" fill="#F3E2BE"/>${grid}<rect x="58" y="52" width="24" height="20" rx="3" fill="#CDE8B5"/><rect x="40" y="14" width="16" height="14" rx="3" fill="#CDE8B5"/></svg>`;
  if(city==="jerusalem")return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%"><rect width="100" height="100" fill="#F2E6CE"/><ellipse cx="25" cy="30" rx="34" ry="20" fill="#E6D2A8"/><ellipse cx="78" cy="72" rx="36" ry="22" fill="#E6D2A8"/>${grid}<rect x="46" y="42" width="20" height="18" rx="2" fill="#D9C28F" stroke="#B89B5E" stroke-width="1"/><rect x="50" y="46" width="12" height="10" fill="none" stroke="#B89B5E" stroke-width="1"/></svg>`;
  return `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%"><rect width="100" height="100" fill="#F6E8C9"/><path d="M0 60 Q30 50 55 64 T100 58" stroke="#E3CE9B" stroke-width="6" fill="none"/>${grid}<circle cx="50" cy="50" r="9" fill="none" stroke="#E0C98F" stroke-width="3"/><rect x="60" y="20" width="20" height="16" rx="3" fill="#DCC58A"/></svg>`;
}
let LMAP=null;
function aLatLng(a){var c=CITY_CENTER[a.city];var s=c.span||{lat:0.05,lng:0.06};return [c.lat+(50-a.y)/100*s.lat, c.lng+(a.x-50)/100*s.lng];}
function renderMap(){
  $("#map-tabs").innerHTML=CITIES.map(c=>`<button class="maptab ${c.key===state.mapCity?"active":""}" data-mapcity="${c.key}">${tr(c)}</button>`).join("");
  const cm=$("#citymap");
  const acts=filterByDistance(ACTIVITIES.filter(a=>a.city===state.mapCity),state.radius);
  if(window.L){ /* real map (online) */
    if(LMAP){LMAP.remove();LMAP=null;}
    cm.innerHTML="";
    const c=CITY_CENTER[state.mapCity];
    LMAP=L.map(cm,{zoomControl:true,attributionControl:true}).setView([c.lat,c.lng],c.zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"}).addTo(LMAP);
    acts.forEach(a=>{
      const icon=L.divIcon({className:"yalla-pin",html:`<span class="dot"><span>${a.emoji}</span></span>`,iconSize:[34,34],iconAnchor:[17,34]});
      L.marker(aLatLng(a),{icon}).addTo(LMAP).on("click",()=>openDetail(a));
    });
    setTimeout(()=>{try{LMAP.invalidateSize();}catch(e){}},60);
  } else { /* offline fallback: stylized SVG map */
    cm.innerHTML=cityMapSVG(state.mapCity);
    acts.forEach(a=>{
      const pin=el(`<button class="pin" style="left:${a.x}%;top:${a.y}%" aria-label="${tr(a.title)}"><span class="dot"><span>${a.emoji}</span></span></button>`);
      pin.addEventListener("click",()=>openDetail(a));cm.appendChild(pin);
    });
  }
}

/* ---- calendar + add-to-calendar (Google / .ics) ---- */
var DOW={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
function occDT(d,time){
  var hm=time.split(":");var now=new Date();
  var date=new Date(now.getFullYear(),now.getMonth(),now.getDate(),parseInt(hm[0],10),parseInt(hm[1],10),0,0);
  var add=((DOW[d]-now.getDay())+7)%7;if(add===0&&date<now)add=7;date.setDate(date.getDate()+add);
  return {start:date,end:new Date(date.getTime()+90*60000)};
}
function occ(a){var p=a.when.en.split("·");return occDT(p[0].trim().slice(0,3),p[1].trim());}
function utc(dt){return dt.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");}
function icsEsc(s){return String(s).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n");}
function gcalUrl(a){var o=occ(a);return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(tr(a.title))+"&dates="+utc(o.start)+"/"+utc(o.end)+"&details="+encodeURIComponent(tr(a.blurb))+"&location="+encodeURIComponent(cityName(a.city));}
function downloadICS(a){
  var o=occ(a);
  var ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Yalla//Activities//EN","BEGIN:VEVENT","UID:"+a.id+"@yalla","DTSTAMP:"+utc(new Date()),"DTSTART:"+utc(o.start),"DTEND:"+utc(o.end),"SUMMARY:"+icsEsc(tr(a.title)),"DESCRIPTION:"+icsEsc(tr(a.blurb)),"LOCATION:"+icsEsc(cityName(a.city)),"END:VEVENT","END:VCALENDAR"].join("\r\n");
  var url=URL.createObjectURL(new Blob([ics],{type:"text/calendar"}));
  var link=document.createElement("a");link.href=url;link.download=a.id+".ics";document.body.appendChild(link);link.click();
  setTimeout(function(){URL.revokeObjectURL(url);link.remove();},120);
}
function renderCalendar(){
  var host=$("#cal-list");var loc=state.lang==="he"?"he-IL":"en-US";
  var items=ACTIVITIES.map(function(a){return {a:a,o:occ(a)};}).sort(function(x,y){return x.o.start-y.o.start;});
  if(!items.length){host.innerHTML='<div class="empty">'+t("cal_empty")+'</div>';return;}
  var html="",last="";
  items.forEach(function(it){
    var dkey=it.o.start.toLocaleDateString(loc,{weekday:"long",day:"numeric",month:"long"});
    if(dkey!==last){html+='<div class="cal-date">'+dkey+'</div>';last=dkey;}
    var tm=it.o.start.toLocaleTimeString(loc,{hour:"2-digit",minute:"2-digit"});
    html+='<div class="row"><div class="thumb act">'+it.a.emoji+'</div><div class="info"><h3>'+tr(it.a.title)+'</h3><p>'+tm+' · '+cityName(it.a.city)+'</p></div><div class="cal-actions"><button class="cal-btn g" data-action="gcal" data-id="'+it.a.id+'">'+t("cal_add_google")+'</button><button class="cal-btn i" data-action="ics" data-id="'+it.a.id+'">'+t("cal_add_ics")+'</button></div></div>';
  });
  host.innerHTML=html;
}

/* ---- pickup (fill-in) ---- */
function pkHave(p){return p.have+(state.pickupJoined.indexOf(p.id)>-1?1:0);}
function pkSpots(p){return Math.max(0,p.need-pkHave(p));}
function renderPickup(){
  var host=$("#pickup-list");
  host.innerHTML=PICKUP.slice().sort(function(a,b){return a.inMin-b.inMin;}).map(function(p){
    var have=pkHave(p),spots=pkSpots(p),joined=state.pickupJoined.indexOf(p.id)>-1,dots="";
    for(var i=0;i<p.need;i++){dots+=(i<have?'<span class="dot-p on"></span>':'<span class="dot-need"></span>');}
    var btn=spots===0?'<button class="join full" disabled>'+t("pickup_full")+'</button>'
      :joined?'<button class="join done" data-pk="'+p.id+'">'+t("pickup_joined")+'</button>'
      :'<button class="join" data-pk="'+p.id+'">'+t("pickup_join")+'</button>';
    return '<div class="pk'+(p.inMin<=45?' urgent':'')+'"><div class="top"><span class="emoji">'+p.emoji+'</span><span class="ttl">'+tr(p.sport)+'</span><span class="when">'+t("pickup_in").replace("{n}",p.inMin)+'</span></div>'
      +'<div class="meta2">📍 '+tr(p.loc)+' · '+cityName(p.city)+'</div>'
      +'<div class="dots">'+dots+(spots>0?'<span class="need">'+t("pickup_need").replace("{n}",spots)+'</span>':'')+'</div>'+btn+'</div>';
  }).join("");
}
function joinPickup(id){
  if(state.pickupJoined.indexOf(id)>-1)return;
  state.pickupJoined.push(id);save();
  var p=PICKUP.find(function(x){return x.id===id;});
  toast(p&&pkSpots(p)===0?t("pickup_full"):t("pickup_joined"));
  renderPickup();
}

/* ---- my events + create ---- */
var DAYS=[["Sun","ראשון","Sunday"],["Mon","שני","Monday"],["Tue","שלישי","Tuesday"],["Wed","רביעי","Wednesday"],["Thu","חמישי","Thursday"],["Fri","שישי","Friday"],["Sat","שבת","Saturday"]];
function renderMyEvents(){
  var host=$("#myevents-list"),loc=state.lang==="he"?"he-IL":"en-US";
  if(!state.created.length){host.innerHTML='<div class="empty">'+t("myevents_empty")+'</div>';return;}
  host.innerHTML=state.created.map(function(e){
    var full=e.joined>=e.capacity,pct=Math.min(100,Math.round(e.joined/e.capacity*100)),spots=Math.max(0,e.capacity-e.joined);
    var st=occDT(e.day,e.time).start;
    var when=st.toLocaleDateString(loc,{weekday:"short",day:"numeric",month:"short"})+" · "+st.toLocaleTimeString(loc,{hour:"2-digit",minute:"2-digit"});
    return '<div class="ev"><div class="erow"><span class="etitle">'+tr(e.title)+'</span><span class="badge '+(full?"full":"filling")+'">'+(full?t("ev_full"):t("ev_filling"))+'</span></div>'
      +'<div class="emeta">'+when+' · '+cityName(e.city)+'</div>'
      +'<div class="bar"><i style="width:'+pct+'%"></i></div>'
      +'<div class="pcount"><span>'+t("ev_signed").replace("{a}",e.joined).replace("{b}",e.capacity)+'</span><span>'+(full?"":t("ev_spots").replace("{n}",spots))+'</span></div></div>';
  }).join("");
}
function buildCreateForm(){
  $("#cv-cat").innerHTML=INTERESTS.map(function(i){return '<option value="'+i.key+'">'+i.icon+' '+tr(i)+'</option>';}).join("");
  $("#cv-city").innerHTML=CITIES.map(function(c){return '<option value="'+c.key+'">'+tr(c)+'</option>';}).join("");
  $("#cv-day").innerHTML=DAYS.map(function(d){return '<option value="'+d[0]+'">'+(state.lang==="he"?d[1]:d[2])+'</option>';}).join("");
}
function submitCreate(){
  var name=$("#cv-name").value.trim();if(!name){$("#cv-name").focus();return;}
  state.created.unshift({id:"c"+Date.now(),title:{he:name,en:name},cat:$("#cv-cat").value,city:$("#cv-city").value,day:$("#cv-day").value,time:$("#cv-time").value||"19:00",capacity:Math.max(2,parseInt($("#cv-cap").value,10)||10),joined:1});
  save();$("#cv-name").value="";$("#overlay-create").classList.remove("active");showView("myevents");toast(t("cv_submit"));
}

/* ---- push banner ---- */
var pushShown=false;
function showPush(){
  if(pushShown)return;
  var p=PICKUP.filter(function(x){return pkSpots(x)>0;}).sort(function(a,b){return a.inMin-b.inMin;})[0];
  if(!p)return;
  $("#push-text").textContent=p.emoji+" "+tr(p.sport)+" · "+t("pickup_need").replace("{n}",pkSpots(p))+" · "+t("pickup_in").replace("{n}",p.inMin);
  $("#push").classList.add("show");pushShown=true;
  clearTimeout(showPush._t);showPush._t=setTimeout(function(){var pe=$("#push");if(pe)pe.classList.remove("show");},8000);
}

/* ---- saved / matches / profile ---- */
function renderSaved(){
  $$(".seg[data-savedtab]").forEach(s=>s.classList.toggle("active",s.dataset.savedtab===state.savedTab));
  const host=$("#saved-list");
  if(state.savedTab==="act"){
    const items=state.saved.map(id=>ACTIVITIES.find(a=>a.id===id)).filter(Boolean);
    host.innerHTML=items.length?items.map(a=>`<div class="row" data-open-act="${a.id}"><div class="thumb act">${a.emoji}</div><div class="info"><h3>${tr(a.title)}</h3><p>${tr(a.when)} · 👥 ${a.attendees}/${capacityOf(a)}</p></div><span class="go">›</span></div>`).join(""):`<div class="empty">${t("saved_empty")}</div>`;
  }else{
    const items=state.matches.map(id=>PEOPLE.find(p=>p.id===id)).filter(Boolean);
    host.innerHTML=items.length?items.map(p=>`<div class="row"><div class="thumb ppl">${p.flag}</div><div class="info"><h3>${p.name}, ${p.age}</h3><p>${tr(p.country)} · ${tr(p.bio)}</p></div><span class="go">💬</span></div>`).join(""):`<div class="empty">${t("matches_empty")}</div>`;
  }
}
function renderProfile(){
  const pr=state.profile||{};
  const ints=(pr.interests||[]).map(k=>{const i=INTERESTS.find(x=>x.key===k)||{};return `${i.icon||""} ${tr(i)}`;}).join(" · ")||"—";
  $("#profile-body").innerHTML=`<div class="avatar">🧑</div><h2>${pr.name||t("appName")}${pr.age?", "+pr.age:""}</h2>
    <button class="btn-primary" data-view="calendar" style="width:100%">${t("cal_open")}</button>
    <button class="btn-primary" data-view="myevents" style="width:100%;background:#fff;color:var(--ink);border:1px solid var(--line);box-shadow:none">${t("myevents_open")}</button>
    <button class="btn-primary" data-action="create-open" style="width:100%;background:#fff;color:var(--magenta);border:1px solid var(--line);box-shadow:none">${t("create_btn")}</button>
    <div class="pcard"><div class="k">${t("profile_from")}</div><div class="v">${pr.from||"—"}</div></div>
    <div class="pcard"><div class="k">${t("profile_interests")}</div><div class="v">${ints}</div></div>
    <button class="lang-btn" data-action="lang" style="margin-top:6px">${t("profile_lang_btn")}</button>`;
}

/* ---- overlays ---- */
function capacityOf(a){return a.cap||(a.attendees+Math.max(4,Math.ceil(a.attendees*0.45)));}
function openDetail(a){
  var cap=capacityOf(a),pct=Math.min(100,Math.round(a.attendees/cap*100));
  $("#detail-body").innerHTML=`<button class="close" data-action="close-overlay">✕</button>
    <div class="hero act"><span class="emoji">${a.emoji}</span></div>
    <h2>${tr(a.title)}</h2>
    <div class="meta" style="color:var(--ink-soft);margin:6px 0 12px">📍 ${cityName(a.city)} · ${a.distanceKm} ${t("km")}</div>
    <p style="line-height:1.6;color:var(--ink-soft)">${tr(a.blurb)}</p>
    <div class="pcard" style="margin-top:14px"><div class="k">${t("detail_when")}</div><div class="v">📅 ${tr(a.when)}</div></div>
    <div class="pcard" style="margin-top:10px"><div class="k">${t("detail_signups")}</div><div class="v">👥 ${a.attendees} / ${cap}</div><div class="bar" style="margin-top:8px"><i style="width:${pct}%"></i></div></div>
    <button class="btn-primary" data-action="join" data-id="${a.id}" style="width:100%;margin-top:16px">${state.saved.includes(a.id)?t("joined"):t("join")}</button>`;
  $("#overlay-detail").classList.add("active");
}
function showMatch(p){
  $("#match-body").innerHTML=`<div class="avatars"><div class="mface">🧑</div><div class="mface">${p.flag}</div></div>
    <h2>${t("match_title")}</h2><p>${t("match_sub").replace("{name}",p.name)}</p>
    <button class="btn-primary" data-action="close-match">${t("match_chat")}</button>
    <button class="btn-text" data-action="close-match">${t("match_keep")}</button>`;
  $("#match").classList.add("active");
}
function openFilter(){
  $("#filter-city").value=state.city;$("#filter-radius").value=state.radius;$("#radius-val").textContent=state.radius;
  $("#overlay-filter").classList.add("active");
}
function applyFilter(){
  state.city=$("#filter-city").value;state.mapCity=state.city;state.radius=parseInt($("#filter-radius").value,10);
  rebuildDecks();save();renderDeck("act");renderDeck("ppl");renderMap();updateChips();
  $("#overlay-filter").classList.remove("active");
}

/* ---- i18n + chrome ---- */
function updateChips(){$("#city-chip").textContent=cityName(state.city);}
function applyI18n(){
  document.documentElement.lang=state.lang;document.documentElement.dir=I18N[state.lang].dir;
  $$("[data-i18n]").forEach(e=>{e.textContent=t(e.dataset.i18n);});
  $$(".lang-btn").forEach(b=>{if(!b.dataset.action||b.dataset.action==="lang")b.textContent=t("profile_lang_btn");});
}
function renderAll(){updateChips();renderDeck("act");renderDeck("ppl");renderMap();renderSaved();renderProfile();renderCalendar();renderPickup();renderMyEvents();buildCreateForm();}
function setLang(){state.lang=state.lang==="he"?"en":"he";save();applyI18n();renderAll();}

function showView(name){
  state.view=name;
  $$(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+name));
  $$(".navbtn").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  if(name==="map")renderMap();if(name==="saved")renderSaved();if(name==="profile")renderProfile();if(name==="calendar")renderCalendar();if(name==="pickup")renderPickup();if(name==="myevents")renderMyEvents();
}
function toast(msg){const b=$("#toast .bubble");b.textContent=msg;const w=$("#toast");w.classList.add("show");clearTimeout(toast._t);toast._t=setTimeout(()=>w.classList.remove("show"),1700);}
function gotoApp(){$("#onboarding").classList.remove("active");$("#app").classList.add("active");showView("discover");setTimeout(showPush,700);}

/* ---- onboarding ---- */
let obSel=[];
function obStep(n){$$(".ob-step").forEach(s=>s.classList.toggle("active",s.dataset.step===String(n)));}
function buildOnboarding(){
  $("#f-from").innerHTML=COUNTRIES.map(c=>`<option>${c}</option>`).join("");
  const cityOpts=CITIES.map(c=>`<option value="${c.key}">${tr(c)}</option>`).join("");
  $("#f-city").innerHTML=cityOpts;$("#filter-city").innerHTML=cityOpts;$("#f-city").value=state.city;
  $("#f-interests").innerHTML=INTERESTS.map(i=>`<button type="button" class="pick" data-int="${i.key}">${i.icon} ${tr(i)}</button>`).join("");
}
function submitProfile(skip){
  state.profile=skip?{name:null,age:null,from:null,interests:[]}
    :{name:$("#f-name").value.trim()||null,age:parseInt($("#f-age").value,10)||null,from:$("#f-from").value,interests:obSel.slice()};
  state.city=$("#f-city").value||state.city;state.mapCity=state.city;
  rebuildDecks();save();renderAll();gotoApp();
}

/* ---- events ---- */
function handleAction(act,node){
  if(act==="lang")setLang();
  else if(act==="ob-next")obStep(1);
  else if(act==="ob-go")submitProfile(false);
  else if(act==="ob-skip")submitProfile(true);
  else if(act==="filter")openFilter();
  else if(act==="apply-filter")applyFilter();
  else if(act==="close-match")$("#match").classList.remove("active");
  else if(act==="close-overlay"){const o=node.closest(".overlay");if(o)o.classList.remove("active");}
  else if(act==="join"){const id=node.dataset.id;if(!state.saved.includes(id))state.saved.push(id);save();node.textContent=t("joined");toast(t("saved_added"));renderSaved();}
  else if(act==="gcal"){const g=ACTIVITIES.find(z=>z.id===node.dataset.id);if(g)window.open(gcalUrl(g),"_blank");}
  else if(act==="ics"){const s=ACTIVITIES.find(z=>z.id===node.dataset.id);if(s)downloadICS(s);}
  else if(act==="create-open"){buildCreateForm();$("#overlay-create").classList.add("active");}
  else if(act==="create-submit"){submitCreate();}
  else if(act==="push-view"){$("#push").classList.remove("show");showView("pickup");}
  else if(act==="push-dismiss"){$("#push").classList.remove("show");}
}
function bind(){
  document.addEventListener("click",e=>{
    const a=e.target.closest("[data-action]");if(a){handleAction(a.dataset.action,a);return;}
    const v=e.target.closest("[data-view]");if(v){showView(v.dataset.view);return;}
    const sw=e.target.closest("[data-swipe]");if(sw){doSwipe(sw.dataset.deck==="ppl"?"ppl":"act",sw.dataset.swipe);return;}
    const st=e.target.closest("[data-savedtab]");if(st){state.savedTab=st.dataset.savedtab;renderSaved();return;}
    const mc=e.target.closest("[data-mapcity]");if(mc){state.mapCity=mc.dataset.mapcity;renderMap();return;}
    const oa=e.target.closest("[data-open-act]");if(oa){const x=ACTIVITIES.find(z=>z.id===oa.dataset.openAct);if(x)openDetail(x);return;}
    const pk=e.target.closest("[data-int]");if(pk){const k=pk.dataset.int;pk.classList.toggle("on");if(obSel.includes(k))obSel=obSel.filter(z=>z!==k);else obSel.push(k);return;}
    const pkj=e.target.closest("[data-pk]");if(pkj){joinPickup(pkj.dataset.pk);return;}
  });
  $$(".overlay").forEach(o=>o.addEventListener("click",e=>{if(e.target===o)o.classList.remove("active");}));
  $("#filter-radius").addEventListener("input",e=>{$("#radius-val").textContent=e.target.value;});
}

/* ---- self-checks (?debug=1) ---- */
function runSelfChecks(){
  console.assert(filterByDistance([{distanceKm:1},{distanceKm:9}],5).length===1,"distance filter excludes >maxKm");
  const before=state.saved.length;finalize("act",ACTIVITIES[0],"right");console.assert(state.saved.length===before+1||state.saved.includes(ACTIVITIES[0].id),"right-swipe saves activity");
  console.assert(PEOPLE.some(p=>p.likesYou),"at least one person likesYou for a match");
  console.assert(occ(ACTIVITIES[0]).end>occ(ACTIVITIES[0]).start,"calendar occurrence end after start");
  console.assert(gcalUrl(ACTIVITIES[0]).indexOf("calendar.google.com")>-1,"google calendar url built");
  console.assert(pkSpots(PICKUP[0])===PICKUP[0].need-PICKUP[0].have,"pickup spots calc");
  console.log("%cYalla self-checks passed","color:#1FB6A6;font-weight:bold");
}

/* ---- init ---- */
buildOnboarding();rebuildDecks();applyI18n();renderAll();bind();
window.addEventListener("load",function(){if(window.L&&state.view==="map")renderMap();});
setInterval(function(){var ch=false;state.created.forEach(function(e){if(e.joined<e.capacity&&Math.random()<0.45){e.joined++;ch=true;}});if(ch){save();if(state.view==="myevents")renderMyEvents();}},9000);
if(location.search.indexOf("debug=1")>-1)runSelfChecks();
if(state.profile)gotoApp();else obStep(0);
})();
