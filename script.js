/* script.js — logic for Sleep Calculator site */

// helpers
function parseTimeToMinutes(t){
  if(!t) return null;
  const parts = t.split(':').map(Number);
  if(parts.length<2) return null;
  return parts[0]*60 + parts[1];
}
function minutesToTime(m){
  m = ((m % (24*60)) + (24*60)) % (24*60);
  const hh = Math.floor(m/60).toString().padStart(2,'0');
  const mm = Math.floor(m%60).toString().padStart(2,'0');
  return `${hh}:${mm}`;
}
function niceTimeStr(t){ return t; }

// constants
const SLEEP_CYCLE = 90;

// main calculator
document.getElementById('calcBtn').addEventListener('click', ()=>{
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const t = document.getElementById('timeInput').value;
  const cycles = parseInt(document.getElementById('cyclesSelect').value,10) || 5;
  const fall = parseInt(document.getElementById('fallAsleep').value,10) || 14;
  const base = parseTimeToMinutes(t);
  if(base === null){ alert('Введите корректное время (чч:мм)'); return; }

  let arr = [];
  if(mode === 'bedtime'){
    for(let c = cycles; c>=1; c--){
      const total = c * SLEEP_CYCLE + fall;
      arr.push({c, time: minutesToTime(base - total)});
    }
  } else {
    for(let c=1;c<=cycles;c++){
      const total = c * SLEEP_CYCLE + fall;
      arr.push({c, time: minutesToTime(base + total)});
    }
  }

  const out = document.getElementById('calcResult');
  out.style.display='block';
  out.innerHTML = `<h3>Результаты</h3><ul>${arr.map(x=>`<li><strong>${x.time}</strong> — ${x.c} циклов</li>`).join('')}</ul><p class="muted">Совет: ставьте будильник на 5–10 минут раньше/позже для корректировки.</p>`;
});

// quick button
document.getElementById('quickBtn').addEventListener('click', ()=>{
  document.querySelector('input[name="mode"][value="bedtime"]').checked = true;
  document.getElementById('timeInput').value = '07:00';
  document.getElementById('cyclesSelect').value = '5';
  document.getElementById('calcBtn').click();
});

// nap calculator
document.getElementById('napCalcBtn').addEventListener('click', ()=>{
  const length = parseInt(document.getElementById('napLength').value,10);
  let start = document.getElementById('napStart').value;
  if(!start){
    const now = new Date();
    start = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
  }
  const sMin = parseTimeToMinutes(start);
  if(sMin===null){ alert('Введите корректное время'); return; }
  const end = minutesToTime(sMin + length);
  const out = document.getElementById('napResult');
  out.style.display = 'block';
  out.innerHTML = `<p>Если начнёте в <strong>${start}</strong>, пробуждение лучше в <strong>${end}</strong> (${length} мин).</p>`;
});

// load tips & faq from data.json and inject FAQ JSON-LD for SEO
async function loadData(){
  try{
    // Try two locations: current folder or /data.json root
    let path = 'data.json';
    let resp = await fetch(path, {cache:'no-store'});
    if(!resp.ok){
      // try parent path in case index.html opened from sleep-calc/docs/
      resp = await fetch('/data.json', {cache:'no-store'});
    }
    if(!resp.ok) throw new Error('data.json not found');
    const data = await resp.json();

    // tips
    const tipsRoot = document.getElementById('tips-root');
    if(Array.isArray(data.tips)){
      tipsRoot.innerHTML = data.tips.map(t=>`<div class="tip"><strong>${t.title}</strong><p>${t.text}</p></div>`).join('');
    } else tipsRoot.innerHTML = '<p>Советы скоро появятся.</p>';

    // faq
    const faqRoot = document.getElementById('faq-root');
    if(Array.isArray(data.faq)){
      faqRoot.innerHTML = data.faq.map(q=>`<div class="faq-item"><details><summary>${q.q}</summary><div class="faq-a"><p>${q.a}</p></div></details></div>`).join('');
      // inject JSON-LD FAQ
      const faqJSON = {
        "@context":"https://schema.org",
        "@type":"FAQPage",
        "mainEntity": data.faq.map(item => ({ "@type":"Question", "name": item.q, "acceptedAnswer": { "@type":"Answer", "text": item.a } }))
      };
      const s = document.createElement('script');
      s.type='application/ld+json';
      s.text = JSON.stringify(faqJSON);
      document.head.appendChild(s);
    } else faqRoot.innerHTML='<p>FAQ скоро появится.</p>';
  }catch(err){
    console.error('loadData error',err);
    document.getElementById('tips-root').innerText='Ошибка загрузки советов';
    document.getElementById('faq-root').innerText='Ошибка загрузки FAQ';
  }
}
document.addEventListener('DOMContentLoaded', loadData);
