'use strict';
(() => {
  const schools=window.SCHOOLS, profiles=window.PROFILES;
  const bubbles=document.getElementById('bubbles'), grid=document.getElementById('grid');
  const search=document.getElementById('search'), count=document.getElementById('result-count');
  const sidebar=document.getElementById('details-inner'), dialog=document.getElementById('school-dialog');
  const content=document.getElementById('dialog-content'), tooltip=document.getElementById('tooltip');
  const mobile=matchMedia('(max-width:850px)');
  let selected=null, lastButton=null;
  const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const profile=s=>profiles[`${s.x},${s.y}`];
  function cropStyle(s) {
    return `background-size:${1200/(2*s.r)*100}% ${1546/(2*s.r)*100}%;background-position:${(s.x-s.r)/(1200-2*s.r)*100}% ${(s.y-s.r)/(1546-2*s.r)*100}%;`;
  }
  for(const value of [100,80,60,40,20]){
    const line=document.createElement('div');line.className='gridline';
    line.style.top=`${(94+(100-value)*18.02)/1546*100}%`;line.innerHTML=`<span>${value}</span>`;grid.append(line);
  }
  function card(s){
    const p=profile(s), name=p?.title||s.name;
    return `<div class="detail-logo" style="${cropStyle(s)}" aria-hidden="true"></div>
      <p class="detail-category">${esc(p?.category||'Repère du graphique')}</p>
      <h2 class="school-title">${esc(name)}</h2>
      ${name!==s.name?`<p class="image-name">Dans l’image : ${esc(s.name)}</p>`:''}
      <div class="level-row"><span class="level-number">≈ ${s.level}</span><span class="level-description">Niveau moyen lu sur l’image<br>Échelle d’origine, pas une note sur 100</span></div>
      ${p?`<div class="tags">${p.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
      <section class="detail-section"><h3>La formation en bref</h3><p>${esc(p.description)}</p></section>
      <section class="detail-section"><h3>Construire son parcours</h3><p>${esc(p.course)}</p></section>
      <section class="detail-section"><h3>Pour candidater</h3><p>${esc(p.admission)}</p></section>
      ${p.note?`<p class="notice">${esc(p.note)}</p>`:''}
      <a class="detail-source" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">Formation · source officielle ↗</a><p class="detail-footnote">Résumé consulté le 28 octobre 2026. Les modalités peuvent évoluer.</p>`:
      `<section class="detail-section"><h3>Ce que montre l’image</h3><p>Cette bulle se situe autour de ${s.level} sur l’axe « niveau moyen ». Sa surface représente les intégrés post-CPGE, mais leur nombre exact n’est pas fourni.</p></section>
      <section class="detail-section"><h3>Pour aller plus loin</h3><p>La fiche de formation de cette école n’a pas encore été documentée. Avant de choisir, vérifie les spécialisations, les campus, les frais et les voies d’admission correspondant à ta filière.</p></section>
      ${s.name.includes('confirmer')||s.name.includes('identifier')?'<p class="notice">Le logo de cette bulle est trop petit pour confirmer son nom complet sur l’image fournie.</p>':`<a class="detail-source" href="https://www.google.com/search?q=${encodeURIComponent(s.name+' site officiel formation ingénieur')}" target="_blank" rel="noopener noreferrer">Rechercher le site de l’école ↗</a>`}`}
      ${s.star?'<p class="notice">✦ Une étoile est visible dans l’image : uniquement la formation d’ingénieur principale, hors apprentissage.</p>':''}
      <p class="detail-footnote">La taille du cercle ne mesure pas la qualité de la formation. Source et année du graphique non précisées.</p>
      <a class="text-link" href="assets/graphique-original.png" target="_blank" rel="noopener">Voir le graphique original ↗</a>`;
  }
  function selectSchool(s,button,{open=true,hash=true}={}){
    selected=s;lastButton=button;
    bubbles.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    sidebar.innerHTML=card(s);sidebar.scrollTop=0;tooltip.hidden=true;
    if(hash)history.replaceState(null,'',`#ecole=${encodeURIComponent(s.id)}`);
    if(mobile.matches&&open){content.innerHTML=card(s);if(!dialog.open)dialog.showModal();dialog.scrollTop=0;document.body.classList.add('dialog-open');}
  }
  function showTip(s,button,event){
    if(event?.pointerType==='touch'||dialog.open)return;
    tooltip.innerHTML=`${esc(s.name)}<small>Niveau ≈ ${s.level} · Cliquer pour découvrir</small>`;tooltip.hidden=false;
    const rect=button.getBoundingClientRect(), t=tooltip.getBoundingClientRect();
    const x=event?.clientX||rect.left+rect.width/2, y=event?.clientY||rect.top;
    tooltip.style.left=`${Math.max(8,Math.min(innerWidth-t.width-8,x-t.width/2))}px`;
    tooltip.style.top=`${Math.max(8,Math.min(innerHeight-t.height-8,y-t.height-14))}px`;
  }
  schools.sort((a,b)=>a.y-b.y||a.x-b.x).forEach(s=>{
    const button=document.createElement('button');button.type='button';button.className='bubble';button.id=s.id;
    button.style.left=`${s.x/12}%`;button.style.top=`${s.y/1546*100}%`;button.style.width=`${s.r*2/12}%`;
    button.setAttribute('aria-label',`${s.name}, niveau moyen approximatif ${s.level}. Ouvrir la fiche.`);button.setAttribute('aria-pressed','false');
    button.innerHTML=`<span class="logo" style="${cropStyle(s)}"></span>${s.star?'<span class="star" aria-hidden="true">✦</span>':''}`;
    button.addEventListener('click',()=>selectSchool(s,button));
    button.addEventListener('pointerenter',e=>showTip(s,button,e));button.addEventListener('pointermove',e=>showTip(s,button,e));
    button.addEventListener('pointerleave',()=>tooltip.hidden=true);button.addEventListener('focus',()=>showTip(s,button));button.addEventListener('blur',()=>tooltip.hidden=true);
    button._search=normalize([s.name,profile(s)?.title,...(profile(s)?.tags||[])].join(' '));bubbles.append(button);
  });
  function applySearch(){
    const q=normalize(search.value.trim());let matches=[];
    bubbles.querySelectorAll('button').forEach(b=>{let match=b._search.includes(q);b.classList.toggle('dim',!match);if(match)matches.push(b)});
    count.textContent=q?`${matches.length} bulle${matches.length>1?'s':''} correspondante${matches.length>1?'s':''}`:`${schools.length} bulles à explorer · ${Object.keys(profiles).length} fiches documentées`;
    document.getElementById('empty-results').hidden=matches.length!==0;
    if(q&&matches.length===1){const scroll=document.getElementById('map-scroll'),b=matches[0];scroll.scrollTo({left:b.offsetLeft-scroll.clientWidth/2,top:b.offsetTop-scroll.clientHeight/2,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}
  }
  search.addEventListener('input',applySearch);
  search.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const first=[...bubbles.children].find(b=>!b.classList.contains('dim'));if(first){first.focus();first.click();}}});
  dialog.querySelector('.close-circle').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');lastButton?.focus({preventScroll:true});});
  mobile.addEventListener('change',()=>{if(!mobile.matches&&dialog.open)dialog.close();});
  addEventListener('scroll',()=>tooltip.hidden=true,true);
  function fromHash(){if(!location.hash.startsWith('#ecole='))return;let id;try{id=decodeURIComponent(location.hash.slice(7));}catch{return}const s=schools.find(s=>s.id===id);if(s)selectSchool(s,document.getElementById(s.id),{hash:false});}
  addEventListener('hashchange',fromHash);applySearch();fromHash();
})();
