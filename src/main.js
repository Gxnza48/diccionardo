import './style.css';
import { words, sources, findWords, normalize } from './data.js';

const repo = 'https://github.com/Gxnza48/diccionardo';
const icon = (name) => ({ search: '⌕', arrow: '↗', random: '⤨', plus: '+', book: '▤' })[name];
const app = document.querySelector('#app');
let category = 'Todas', query = '', letter = '', sort = 'featured';
const escape = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
app.innerHTML = `
  <a class="skip" href="#contenido">Saltar al contenido</a>
  <div class="flag-line"></div>
  <header class="masthead">
    <a class="brand" href="#" aria-label="Diccionardo, portada"><span class="brand-mark">D<span>✳</span></span><span><strong>Diccionardo</strong><small>LA ENCICLOPEDIA DEL CHAT</small></span></a>
    <div class="header-note">Hecho por la comunidad.<br><em>Entendido por la Army.</em></div>
    <button class="button primary contribute">${icon('plus')} Proponer palabra</button>
  </header>
  <div class="layout">
    <aside class="sidebar"><div class="side-title">NAVEGACIÓN</div><nav aria-label="Principal"><a href="#" class="side-link active">▤ <span>Portada</span></a><a href="#diccionario" class="side-link">Aa <span>Todas las palabras</span></a><button class="side-link random">⤨ <span>Palabra al azar</span></button><button class="side-link" data-about>◎ <span>La Coscu Army</span></button></nav>
      <div class="side-title community-title">ESTO LO HACEMOS ENTRE TODOS</div><button class="side-link contribute">+ <span>Sumar una palabra</span></button><a href="${repo}/issues" target="_blank" rel="noreferrer" class="side-link">↗ <span>Propuestas del chat</span></a>
      <div class="sidebar-note"><span class="sun">☀</span><p>Del stream<br>al diccionario.</p><small>Industria argentina.<br>Ortografía opcional.*</small></div><p class="footnote">* Bueno, tampoco tanto.</p>
    </aside>
    <main id="contenido">
      <div class="page-tabs"><span>Portada</span><span class="edition">EDICIÓN COMUNITARIA <i></i> VOL. 01</span></div>
      <section class="welcome"><div class="eyebrow">BIENVENIDO A DICCIONARDO</div><h1>El chat tiene su idioma.<br><em>Acá tiene su diccionario.</em></h1><p>Palabras, expresiones y un poco de lore de la <button class="text-link" data-about>Coscu Army</button>.<br class="desktop"> Para los que estuvieron ahí. Y los que llegaron recién.</p>
      <form class="search" role="search"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="¿Qué significa eso que dijo el chat?" aria-label="Buscar una palabra" autocomplete="off"><kbd>/</kbd><button type="submit">Buscar <span aria-hidden="true">→</span></button></form><div class="search-hints">Podés arrancar por <a href="#palabra/nashe">nashe</a>, <a href="#palabra/buenardo">buenardo</a> o <a href="#palabra/de-ruta">de ruta</a><span>${words.length} palabras y contando ↗</span></div></section>
      <div class="feature-grid"><section class="featured"><div class="section-label"><span>✳ LA PALABRA DESTACADA</span><span>001 / ${String(words.length).padStart(3, '0')}</span></div><div class="featured-title"><a href="#palabra/buenardo">buenardo<span>↗</span></a><span class="tag">CLÁSICO DE LA ARMY</span></div><div class="pronunciation">/ bue · nar · do / <i>adjetivo</i></div><p>Algo que está muy bueno. Pero muy bueno.<br>El «bueno» de toda la vida, con un poquito más de chat.</p><blockquote>“Este tema está buenardo, ponelo de nuevo.”</blockquote><a class="read-link" href="#palabra/buenardo">Leer definición completa <span>→</span></a></section>
      <aside class="contribution-card"><span class="small-stamp">EN CONSTRUCCIÓN PERMANENTE</span><h2>Al diccionario<br>lo escribe el chat.</h2><p>¿Falta esa palabra que usan siempre? Dejá su significado y un ejemplo. El lore no se archiva solo.</p><button class="button contribute">Sumá tu palabra <span>↗</span></button><small>Con cuenta de GitHub · revisión comunitaria</small></aside></div>
      <section id="diccionario" class="dictionary"><div class="section-heading"><h2>Explorá el diccionario<span>.</span></h2><label class="sort-label">Ordenar <select id="sort" aria-label="Ordenar palabras"><option value="featured">Destacadas</option><option value="az">A → Z</option></select></label></div>
      <div class="filters" aria-label="Categorías">${['Todas', 'Clásicos', 'Reacciones', 'Expresiones', 'Archivo'].map((c, i) => `<button data-category="${c}" class="filter ${i === 0 ? 'selected' : ''}" aria-pressed="${i === 0}">${c}${i === 0 ? ` <span>${words.length}</span>` : ''}</button>`).join('')}</div>
      <div class="alphabet" aria-label="Filtrar por letra"><button class="selected" data-letter="" aria-pressed="true">Todas</button>${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => `<button data-letter="${l}" ${words.some(w => normalize(w.word).startsWith(l.toLowerCase())) ? '' : 'disabled'} aria-pressed="false">${l}</button>`).join('')}</div>
      <div id="results-status" class="sr-only" aria-live="polite"></div><div id="words" class="word-grid"></div><div class="dictionary-bottom"><span id="count"></span><button class="text-link random">No sé qué buscar. Sorprendeme ⤨</button></div></section>
      <section class="editorial-note"><span>ⓘ</span><p><strong>Una enciclopedia viva, no la Real Academia.</strong> Los significados cambian con el chat. ¿Algo no está bien? Proponé una corrección. Los ejemplos son ilustrativos, no citas de streams.</p></section>
      <footer><a href="#" class="footer-brand">Diccionardo<span>✳</span></a><span>Hecho en Argentina, para todo el chat.</span><div><button class="text-link" data-about>Acerca del proyecto</button><a href="${repo}" target="_blank" rel="noreferrer">GitHub ↗</a></div><small>Proyecto independiente y no oficial. Sin afiliación con Coscu.</small></footer>
    </main>
  </div>
  <dialog id="detail" aria-label="Definición de palabra"><button class="close" aria-label="Cerrar">×</button><div id="detail-content"></div></dialog>
  <dialog id="proposal" aria-label="Proponer una palabra"><button class="close" aria-label="Cerrar">×</button><div class="eyebrow">ARCHIVO ABIERTO</div><h2>Sumá una palabra.</h2><p>Armá tu propuesta. La revisamos antes de incorporarla al diccionario.</p><form id="proposal-form"><label>Palabra<input name="word" required maxlength="60" placeholder="Ej.: buenardo"></label><label>¿Qué significa?<textarea name="definition" required minlength="15" maxlength="1200" rows="3" placeholder="Explicalo como se lo explicarías a alguien que llegó recién."></textarea></label><label>Ejemplo de uso<input name="example" required maxlength="300" placeholder="Una frase donde se entienda cómo se usa"></label><label>Clip o fuente <span>(opcional)</span><input name="source" type="url" maxlength="500" placeholder="https://..."></label><p class="form-note">Se abrirá GitHub con tu propuesta lista. Necesitás una cuenta y presionar «Create» para enviarla. No se publica automáticamente.</p><button class="button primary" type="submit">Continuar en GitHub ↗</button><p id="proposal-status" role="status"></p></form></dialog>
  <dialog id="about" aria-label="Acerca de Diccionardo"><button class="close" aria-label="Cerrar">×</button><div class="eyebrow">UN POCO DE CONTEXTO</div><h2>Del chat, para el chat.</h2><p>La Coscu Army es la comunidad que se formó alrededor del streamer argentino Coscu. Su manera de hablar, sus chistes y sus expresiones se extendieron mucho más allá de los streams.</p><p>Diccionardo es un archivo independiente de ese vocabulario. Que una palabra esté acá no significa que haya sido inventada por Coscu: documentamos su uso en la comunidad.</p><h3>¿Cómo se suma una palabra?</h3><p>Proponela con su significado, un ejemplo y, si tenés, un clip. Las propuestas se guardan como issues de GitHub y el equipo del proyecto las revisa antes de sumarlas. No necesitás una cuenta para leer el diccionario.</p><h3>Fuentes y criterios</h3><p>Las entradas sin respaldo específico están señaladas como pendientes de fuente. Los ejemplos son originales e ilustrativos.</p><ul>${Object.values(sources).map(s => `<li><a href="${s.url}" target="_blank" rel="noreferrer">${s.title} ↗</a></li>`).join('')}</ul><p class="form-note">Sin afiliación, patrocinio ni aprobación oficial de Coscu. Este proyecto no representa a toda la comunidad.</p></dialog>
  <div id="toast" role="status"></div>`;

function render() {
  let result = findWords(query, category, letter);
  if (sort === 'az') result = [...result].sort((a, b) => a.word.localeCompare(b.word, 'es'));
  document.querySelector('#words').innerHTML = result.length ? result.map(w => `<article class="word-card"><div class="word-meta">${w.kind}<span>${w.category === 'Archivo' ? 'USO HISTÓRICO' : w.source ? w.category : 'POR DOCUMENTAR'}</span></div><h3><a href="#palabra/${w.slug}">${w.word}<span>↗</span></a></h3><p>${w.definition}</p><div class="word-example">“${w.example}”</div></article>`).join('') : `<div class="empty"><h3>No encontramos esa palabra. Ndeah.</h3><p>Probá otra búsqueda o ayudanos a sumarla.</p><button id="reset" class="button">Limpiar filtros</button><button class="button primary contribute">Proponer palabra ↗</button></div>`;
  document.querySelector('#count').textContent = `Mostrando ${result.length} de ${words.length} palabras`;
  document.querySelector('#results-status').textContent = `${result.length} palabras encontradas`;
  document.querySelectorAll('[data-category]').forEach(b => { b.classList.toggle('selected', b.dataset.category === category); b.setAttribute('aria-pressed', b.dataset.category === category); });
  document.querySelectorAll('[data-letter]').forEach(b => { b.classList.toggle('selected', b.dataset.letter === letter); b.setAttribute('aria-pressed', b.dataset.letter === letter); });
}
function showDialog(id) { const d = document.getElementById(id); if (!d.open) d.showModal(); }
function route() {
  const slug = location.hash.startsWith('#palabra/') ? location.hash.slice(9) : null;
  const w = words.find(w => w.slug === slug);
  const detail = document.querySelector('#detail');
  if (!slug) { if (detail.open) detail.close(); document.title = 'Diccionardo — La enciclopedia del chat'; return; }
  if (!w) { document.querySelector('#detail-content').innerHTML = '<h2>Palabra no encontrada.</h2><p>Volvé al diccionario para seguir explorando.</p>'; showDialog('detail'); return; }
  document.title = `${w.word}: significado — Diccionardo`;
  document.querySelector('#detail-content').innerHTML = `<div class="eyebrow">DICCIONARDO / ${w.category.toUpperCase()}</div><h2>${w.word}</h2><div class="pronunciation">/ ${w.syllables} / <i>${w.kind}</i></div><p class="definition">${w.definition}</p><h3>En una frase</h3><blockquote>“${w.example}”</blockquote><h3>${w.sensitive ? 'Contexto histórico' : 'Un poco de lore'}</h3><p>${w.note}</p><div class="source-note">${w.source ? `Fuente de referencia: <a href="${sources[w.source].url}" target="_blank" rel="noreferrer">${sources[w.source].title} ↗</a>` : 'Entrada inicial · pendiente de fuente. ¿Tenés un clip? Ayudanos a documentarla.'}</div><h3>También se dice por acá</h3><div class="related">${w.related.map(s => { const r = words.find(w => w.slug === s); return `<a href="#palabra/${r.slug}">${r.word} ↗</a>`; }).join('')}</div><div class="detail-actions"><button class="button primary" id="share">Copiar enlace ↗</button><a class="button" href="${repo}/issues/new?template=correccion.yml&title=${encodeURIComponent('Corrección: ' + w.word)}" target="_blank" rel="noreferrer">Proponer corrección</a></div><p id="share-status" role="status"></p>`;
  showDialog('detail');
  document.querySelector('#share').onclick = async () => { try { await navigator.clipboard.writeText(location.href); document.querySelector('#share-status').textContent = 'Enlace copiado. Pasalo al chat.'; } catch { document.querySelector('#share-status').textContent = `Copiá este enlace: ${location.href}`; } };
}
document.addEventListener('click', e => {
  if (e.target.closest('.contribute')) showDialog('proposal');
  if (e.target.closest('[data-about]')) showDialog('about');
  if (e.target.closest('.random')) { const choices = words.filter(w => !w.sensitive && location.hash !== `#palabra/${w.slug}`); location.hash = `palabra/${choices[Math.floor(Math.random() * choices.length)].slug}`; }
  const filter = e.target.closest('[data-category]'); if (filter) { category = filter.dataset.category; render(); }
  const alpha = e.target.closest('[data-letter]'); if (alpha) { letter = alpha.dataset.letter; render(); }
  if (e.target.closest('#reset')) { query = ''; category = 'Todas'; letter = ''; document.querySelector('#search').value = ''; render(); }
  if (e.target.closest('.close')) e.target.closest('dialog').close();
});
document.querySelectorAll('dialog').forEach(d => { d.addEventListener('click', e => { if (e.target === d) { const r = d.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close(); } }); });
document.querySelector('#detail').addEventListener('close', () => { if (location.hash.startsWith('#palabra/')) { history.replaceState(null, '', location.pathname + location.search + '#diccionario'); document.title = 'Diccionardo — La enciclopedia del chat'; } });
document.querySelector('#search').addEventListener('input', e => { query = e.target.value; render(); });
document.querySelector('.search').addEventListener('submit', e => { e.preventDefault(); document.querySelector('#diccionario').scrollIntoView({ behavior: 'smooth' }); });
document.querySelector('#sort').addEventListener('change', e => { sort = e.target.value; render(); });
document.addEventListener('keydown', e => { if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.querySelector('dialog[open]')) { e.preventDefault(); document.querySelector('#search').focus(); } });
document.querySelector('#proposal-form').addEventListener('submit', e => {
  e.preventDefault(); const fd = new FormData(e.target);
  const values = Object.fromEntries([...fd].map(([k, v]) => [k, v.trim()]));
  if (!values.word || values.definition.length < 15 || !values.example) { document.querySelector('#proposal-status').textContent = 'Completá la palabra, una definición de al menos 15 caracteres y un ejemplo.'; return; }
  const body = `### Palabra\n${values.word}\n\n### Significado\n${values.definition}\n\n### Ejemplo\n${values.example}\n\n### Fuente o clip\n${values.source || 'Pendiente de fuente'}\n\nPropuesta enviada desde Diccionardo.`;
  const url = `${repo}/issues/new?title=${encodeURIComponent('Palabra: ' + values.word)}&body=${encodeURIComponent(body)}`;
  const link = document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.click();
  document.querySelector('#proposal-status').innerHTML = `Terminá el envío en GitHub. Si no se abrió, <a href="${escape(url)}" target="_blank" rel="noreferrer">abrí tu propuesta acá ↗</a>.`;
});
window.addEventListener('hashchange', route);
render(); route();
