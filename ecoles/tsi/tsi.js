(() => {
'use strict';
const {rows, meta, competitions} = window.TSI_DATA;
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number = value => value == null ? '<span class="dash" aria-label="Non renseigné">—</span>' : Number(value).toLocaleString('fr-FR');
const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const link = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)} ↗</a>`;
const pair = (label, value) => `<div><span>${esc(label)}</span><strong>${number(value)}</strong></div>`;
const profiles = {'tsi-0':'420,118','tsi-1':'605,749','tsi-4':'439,317','tsi-6':'894,408','tsi-7':'894,197','tsi-33':'677,435','tsi-34':'770,250','tsi-37':'605,148','tsi-38':'523,223','tsi-40':'606,261'};
let opener = null;
[...new Set(rows.map(r => r.group))].sort((a,b)=>a.localeCompare(b,'fr')).forEach(group => { const option = document.createElement('option'); option.value = group; option.textContent = group; $('tsi-group').append(option); });
const params = new URLSearchParams(location.search);
if (params.get('q')) { $('tsi-search').value = params.get('q'); $('tsi-coverage').value = 'all'; }
function render() {
 const query = normalize($('tsi-search').value).trim();
 const coverage = $('tsi-coverage').value;
 const selected = rows.filter(r => ( $('tsi-group').value === 'all' || r.group === $('tsi-group').value ) && (coverage === 'all' || (coverage === 'current' && r.places2026 != null) || (coverage === 'historic' && r.places2026 == null && r.source2025) || (coverage === 'apprentice' && r.status === 'Apprentissage')) && query.split(/\s+/).every(term => normalize([r.name,r.name2025,r.name2026,r.group,r.status].join(' ')).includes(term)));
 const sort = $('tsi-sort').value;
 selected.sort((a,b) => (sort === 'places' ? (b.places2026 ?? -1) - (a.places2026 ?? -1) : sort === 'entered' ? (b.entered2025 ?? -1) - (a.entered2025 ?? -1) : sort === 'group' ? a.group.localeCompare(b.group,'fr') : 0) || a.name.localeCompare(b.name,'fr'));
 $('tsi-count').textContent = `${selected.length} fiche${selected.length > 1 ? 's' : ''} affichée${selected.length > 1 ? 's' : ''} sur ${rows.length}`;
 $('tsi-empty').hidden = selected.length !== 0;
 $('tsi-rows').innerHTML = selected.map(r => `<tr><td><div class="formation-cell"><button class="school-orb" data-id="${esc(r.id)}" aria-label="Ouvrir la fiche ${esc(r.name)}" aria-haspopup="dialog" aria-expanded="false">${esc(r.short)}</button><div><span class="formation-name">${esc(r.name)}</span><span class="formation-meta"><span>${esc(r.group)}</span><span>${esc(r.status)}</span>${r.aggregate ? '<em>Quota partagé / réseau</em>' : ''}</span></div></div></td><td class="current">${number(r.places2026)}</td><td>${number(r.places2025)}</td><td>${number(r.entered2025)}</td><td>${number(r.median2025)}</td></tr>`).join('');
}
function openDetail(row, trigger) {
 opener = trigger || null;
 if(opener) opener.setAttribute('aria-expanded','true');
 const p = window.PROFILES?.[profiles[row.id]];
 const notes = [...row.notes];
 if (row.places2026 == null) notes.push('Aucun quota 2026 vérifié pour cette fiche. Cela ne signifie pas zéro place ni fermeture de la voie.');
 if (!row.source2025) notes.push('Aucun rapprochement avec une ligne 2025 de même périmètre : les résultats restent non renseignés.');
 const maxPlaces = Math.max(row.places2026 || 0, row.places2025 || 0, 1);
 $('tsi-detail').innerHTML = `<p class="detail-label">FILIÈRE TSI · ${esc(row.group)}</p><h2 id="tsi-detail-title">${esc(row.name)}</h2><p class="detail-status">${esc(row.status)}${row.aggregate ? ' · Quota partagé / réseau' : ''}</p><div class="detail-metrics"><div><span>PLACES 2026</span><strong>${number(row.places2026)}</strong><small>capacité annoncée</small></div><div><span>INTÉGRÉS 2025</span><strong>${number(row.entered2025)}</strong><small>élèves entrés</small></div><div><span>PLACES 2025</span><strong>${number(row.places2025)}</strong><small>capacité annoncée</small></div></div>
 ${p ? `<section class="detail-block"><h3>La formation</h3><p>${esc(p.description)}</p><p>${esc(p.course)}</p>${link(p.url,'Programme sur le site de l’école')}</section>` : ''}
 <section class="detail-block"><h3>Les capacités, session par session</h3><div class="mini-bars">${[[2026,row.places2026],[2025,row.places2025]].map(([year,n])=>`<div class="mini-bar-row"><span>Places ${year}</span><div class="mini-track"><div class="mini-fill" style="width:${(n ?? 0)/maxPlaces*100}%"></div></div><strong>${number(n)}</strong></div>`).join('')}</div></section>
 <section class="detail-block"><h3>Les rangs des intégrés · 2025</h3><div class="key-values">${pair('Rang médian',row.median2025)}${pair('Rang moyen',row.mean2025)}</div><p>Ces rangs décrivent les intégrés dans le classement du concours. Ce ne sont pas les rangs des derniers admis, ni une estimation de tes chances. Les classements de concours différents ne se comparent pas directement.</p></section>
 <section class="detail-block"><h3>Le parcours de sélection · 2025</h3><div class="key-values">${pair('Inscrits',row.enrolled2025)}${pair('Admissibles',row.eligible2025)}${pair('Classés',row.ranked2025)}${pair('Intégrés',row.entered2025)}</div><p>${esc(row.statScope)}</p></section>
 ${(row.bar2026 != null || row.bar2025 != null) ? `<section class="detail-block"><h3>Barres d’admissibilité · points pondérés</h3><div class="key-values">${pair('Session 2026',row.bar2026)}${pair('Session 2025',row.bar2025)}</div><p>Ces valeurs ne sont pas des notes sur 20. Vérifie les coefficients et conditions dans la notice du concours.</p>${link(row.barSource,'Barres officielles')}</section>` : ''}
 ${notes.length ? `<section class="detail-block"><h3>À lire pour cette voie</h3><ul class="detail-notes">${notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul></section>` : ''}
 <section class="detail-block"><h3>Vérifier les informations</h3><div class="detail-source-links">${row.source2026 ? link(row.source2026,'Places TSI 2026') : ''}${row.source2025 ? link(row.source2025,'Résultats SCEI 2025') : ''}</div><p class="source-caution">Sources consultées le 28 octobre 2026. Pour ta candidature, consulte la notice de la session visée et ses éventuels rectificatifs.</p></section>`;
 if (!$('tsi-dialog').open) $('tsi-dialog').showModal();
 $('tsi-dialog').scrollTop = 0;
 history.replaceState(null,'',`${location.pathname}${location.search}#formation=${encodeURIComponent(row.id)}`);
}
$('tsi-rows').addEventListener('click', event => {const trigger=event.target.closest('[data-id]');if(trigger)openDetail(rows.find(r=>r.id===trigger.dataset.id),trigger);});
['tsi-search','tsi-group','tsi-coverage','tsi-sort'].forEach(id => $(id).addEventListener(id==='tsi-search'?'input':'change',render));
$('tsi-dialog').querySelector('button').addEventListener('click',()=> $('tsi-dialog').close());
$('tsi-dialog').addEventListener('click',e=>{if(e.target===$('tsi-dialog')){const b=e.target.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)e.target.close();}});
$('tsi-dialog').addEventListener('close',()=>{if(opener){opener.setAttribute('aria-expanded','false');opener.focus();}history.replaceState(null,'',location.pathname+location.search+'#formations');});
const competitionNames = ['Centrale','Mines-Ponts','Mines-Télécom','CCINP','Polytech','EPITA'];
$('competition-grid').innerHTML = competitionNames.map(name=>competitions.find(c=>c.name.includes(name))).filter(Boolean).map(c=>`<article class="competition-card"><h3>${esc(c.name.replace(/^Concours /,'').replace(/ TSI$/,''))}</h3>${[['Inscrits',c.inscrits],['Admissibles',c.admissibles],['Classés',c.classes],['Intégrés',c.integres],['Places offertes',c.places]].map(([label,n])=>`<div class="funnel-row"><span>${label}</span><strong>${number(n)}</strong></div>`).join('')}${link(c.source,'Statistiques détaillées')}</article>`).join('');
$('source-list').innerHTML = meta.sources.map(s=>`<li>${link(s.url,s.title)}</li>`).join('');
function fromHash(){ const id = new URLSearchParams(location.hash.slice(1)).get('formation'); const row = rows.find(r=>r.id===id); if(row)openDetail(row,null); }
render(); fromHash(); window.addEventListener('hashchange',fromHash);
})();
