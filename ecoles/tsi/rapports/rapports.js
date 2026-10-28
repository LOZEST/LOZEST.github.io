(() => {
'use strict';
const data=window.JURY_DATA, $=id=>document.getElementById(id);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=v=>Number(v).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2});
const delta=v=>(v>0?'+':v<0?'−':'')+fmt(Math.abs(v));
const link=(u,t)=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a>`;
function render(){
 const bank=data.banks[$('report-bank').value],subject=bank.rows[Number($('report-subject').value)||0],years=bank.years;
 $('report-scope').textContent=bank.scope;
 $('means-head').innerHTML='<tr><th scope="col">Épreuve</th>'+years.map(y=>`<th scope="col" ${y===2026?'class="latest"':''}>${y}</th>`).join('')+'<th scope="col">Écart 2026–2025</th></tr>';
 $('means-body').innerHTML=bank.rows.map(r=>`<tr ${r===subject?'class="selected-row"':''}><th scope="row">${esc(r.name)}</th>${years.map(y=>`<td ${y===2026?'class="latest"':''}>${fmt(r.means[y])}</td>`).join('')}<td>${delta(r.means[2026]-r.means[2025])} pt</td></tr>`).join('');
 $('means-sources').innerHTML=bank.sources.map(s=>link(s.url,s.label)).join('');
 $('trend-label').textContent=bank.label+' · '+subject.name;
 const coords=years.map((y,i)=>({year:y,x:55+i*440/(years.length-1),y:235-subject.means[y]*10,value:subject.means[y]}));
 $('trend-plot').innerHTML=`<svg viewBox="0 0 550 275" role="img" aria-labelledby="trend-title trend-desc"><title id="trend-title">Moyennes ${esc(bank.label)} — ${esc(subject.name)}</title><desc id="trend-desc">${years.map(y=>`${y} : ${fmt(subject.means[y])} sur 20`).join('. ')}</desc>${[0,5,10,15,20].map(n=>`<line x1="45" y1="${235-n*10}" x2="515" y2="${235-n*10}" stroke="#e2e9dd"/><text x="29" y="${239-n*10}" text-anchor="end" font-size="11" fill="#6a7e69">${n}</text>`).join('')}<polyline points="${coords.map(p=>p.x+','+p.y).join(' ')}" fill="none" stroke="#628d70" stroke-width="2.5"/>${coords.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="6" fill="#234e3e"/><text x="${p.x}" y="${p.y-16}" text-anchor="middle" fill="#234e3e" font-size="13" font-weight="600">${fmt(p.value)}</text><text x="${p.x}" y="260" text-anchor="middle" fill="#6a7e69" font-size="12">${p.year}</text>`).join('')}</svg>`;
 $('trend-summary').textContent=`${fmt(subject.means[2026])}/20 en 2026 · ${delta(subject.means[2026]-subject.means[2025])} point par rapport à 2025.`;
 $('trend-extra').textContent=subject.present2026?`En 2026 : ${subject.present2026.toLocaleString('fr-FR')} présents à cette épreuve ; médiane ${fmt(subject.median2026)}/20. La moitié centrale des notes se situe entre ${fmt(subject.q1)} et ${fmt(subject.q3)}/20 (Q1–Q3).`:'';
}
function setBank(){const bank=data.banks[$('report-bank').value];$('report-subject').innerHTML=bank.rows.map((r,i)=>`<option value="${i}">${esc(r.name)}</option>`).join('');render();}
$('report-bank').addEventListener('change',setBank);$('report-subject').addEventListener('change',render);
$('jury-cards').innerHTML=data.reports.map(r=>`<article class="jury-card"><span class="jury-meta">${esc(r.bank)} · RAPPORT ${r.year}</span><h3>${esc(r.subject)}</h3><p>${esc(r.summary)}</p><p class="takeaway"><strong>Piste de travail :</strong> ${esc(r.takeaway)}</p>${link(r.url,'Lire le rapport du jury')}</article>`).join('');
$('thresholds-body').innerHTML=data.ccinThresholds.map(r=>`<tr><th scope="row">${r.year}</th><td>${fmt(r.eligible)}</td><td>${fmt(r.ranked)}</td></tr>`).join('');
$('threshold-source').innerHTML=link(data.ccinSource,'Source CCINP · rubrique I « Résultats »');setBank();
})();
