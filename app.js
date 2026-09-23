'use strict';

// ============ STATE ============
const S = {
  input: '', files: [], blobUrl: null,
  name: 'Tuan Gigs', avatar: 'G', avatarImg: '', avatarEmoji: '',
  accent: '#ff8c1a', bg: '#f7f7f9',
  dark: false,
  layout: 'layout-standard',
  shape: 'shape-soft',
  gap: 'gap-normal',
  corner: 'corner-line',
  headerPos: 'header-left',
  iconSize: 'icon-md',
  iconShape: 'iconcircle',
  iconAnim: 'icon-shake',
  ripple: true,
  btnAnim: 'btn-normal',
  anim: 'anim-smooth',
  wp: 'wp-none',
  glow: false, blur: false, particle: false, cursor: false,
  sound: false, vibrate: false, clock: false,
  runText: '▶ JALANKAN'
};

const THEMES = [
  {name:'Oranye', accent:'#ff8c1a', bg:'#f7f7f9', dark:false},
  {name:'Merah', accent:'#e63946', bg:'#fef2f2', dark:false},
  {name:'Hijau', accent:'#2a9d8f', bg:'#f0fdfa', dark:false},
  {name:'Biru', accent:'#457b9d', bg:'#f0f9ff', dark:false},
  {name:'Ungu', accent:'#9d4edd', bg:'#faf5ff', dark:false},
  {name:'Pink', accent:'#e91e63', bg:'#fdf2f8', dark:false},
  {name:'Toska', accent:'#00bcd4', bg:'#ecfeff', dark:false},
  {name:'Emas', accent:'#d4a017', bg:'#fffbeb', dark:false},
  {name:'Neon', accent:'#00ff88', bg:'#0a0a0a', dark:true},
  {name:'Midnight', accent:'#7c3aed', bg:'#0f0f1a', dark:true},
  {name:'Sunset', accent:'#ff6b35', bg:'#1a0f0a', dark:true},
  {name:'Cyber', accent:'#00d4ff', bg:'#0a0f1a', dark:true}
];

const ACCENTS = ['#ff8c1a','#e63946','#2a9d8f','#457b9d','#9d4edd','#e91e63','#00bcd4','#4caf50','#ff5722','#607d8b','#d4a017','#111111'];

// ============ LOAD / SAVE ============
function load(){
  try {
    const s = localStorage.getItem('betox1_studio_v3');
    if (s) Object.assign(S, JSON.parse(s));
  } catch(e){}
  applyAll();
  renderThemePresets();
  renderAccentPresets();
  startClock();
}

function save(){
  try {
    localStorage.setItem('betox1_studio_v3', JSON.stringify(S));
  } catch(e){}
}

// ============ APPLY ============
function applyAll(){
  applyTheme();
  applyProfile();
  applyBodyClasses();
  applyParticles();
  applyCursor();
  updateUIFromState();
}

function applyTheme(){
  const r = document.documentElement;
  r.style.setProperty('--accent', S.accent);
  r.style.setProperty('--accent2', shade(S.accent, -18));
  document.body.classList.toggle('dark', S.dark);
  if (!S.dark) document.body.style.background = S.bg;
  else document.body.style.background = '';
}

function shade(hex, p){
  try {
    const n = parseInt(hex.replace('#',''), 16);
    const a = Math.round(2.55 * p);
    const R = Math.max(0, Math.min(255, (n >> 16) + a));
    const G = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + a));
    const B = Math.max(0, Math.min(255, (n & 0xff) + a));
    return '#' + (0x1000000 + R*0x10000 + G*0x100 + B).toString(16).slice(1);
  } catch(e){ return hex; }
}

function applyProfile(){
  document.getElementById('uname').textContent = S.name;
  const av = document.getElementById('avatar');
  if (S.avatarImg){
    av.innerHTML = '<img src="' + S.avatarImg + '" alt="av">';
  } else if (S.avatarEmoji){
    av.textContent = S.avatarEmoji;
  } else {
    av.textContent = S.avatar || S.name.charAt(0).toUpperCase();
  }
  document.getElementById('runLabel').textContent = S.runText || '▶ JALANKAN';
  document.getElementById('clock').style.display = S.clock ? 'block' : 'none';
}

function applyBodyClasses(){
  const b = document.body;
  const groups = [
    'layout-standard','layout-grid','layout-sidebar','layout-float','layout-split','layout-magazine',
    'shape-square','shape-soft','shape-round','shape-pill','shape-tilt','shape-diamond',
    'gap-tight','gap-normal','gap-loose',
    'corner-line','corner-dot','corner-x','corner-none',
    'header-left','header-center','header-right',
    'icon-sm','icon-md','icon-lg','icon-xl',
    'iconcircle','iconsquare','iconpill','icondiamond',
    'icon-shake','icon-rotate','icon-bounce','icon-none',
    'btn-normal','btn-shake','btn-glow',
    'anim-fast','anim-smooth',
    'wp-none','wp-dots','wp-grid','wp-mesh'
  ];
  groups.forEach(c => b.classList.remove(c));
  b.classList.add(S.layout, S.shape, S.gap, S.corner, S.headerPos);
  b.classList.add(S.iconSize, S.iconShape, S.iconAnim, S.btnAnim);
  b.classList.add(S.anim, S.wp);
  b.classList.toggle('glow', S.glow);
  b.classList.toggle('blur', S.blur);
}

function applyParticles(){
  const box = document.getElementById('particles');
  if (!S.particle){ box.innerHTML = ''; return; }
  box.innerHTML = '';
  for (let i = 0; i < 30; i++){
    const p = document.createElement('div');
    p.className = 'pt';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (6 + Math.random() * 10) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.opacity = 0.2 + Math.random() * 0.5;
    box.appendChild(p);
  }
}

function applyCursor(){
  const c = document.getElementById('cur');
  const b = document.body;
  if (S.cursor){
    b.classList.add('cur-on');
    c.style.display = 'block';
    c.className = 'dot';
    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('touchmove', moveCursor, {passive: true});
  } else {
    b.classList.remove('cur-on');
    c.style.display = 'none';
    document.removeEventListener('mousemove', moveCursor);
    document.removeEventListener('touchmove', moveCursor);
  }
}

function moveCursor(e){
  const c = document.getElementById('cur');
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  c.style.left = x + 'px';
  c.style.top = y + 'px';
}

function updateUIFromState(){
  setVal('inName', S.name);
  setVal('inAv', S.avatar);
  setVal('inEmoji', S.avatarEmoji);
  setVal('inAvUrl', S.avatarImg.startsWith('http') ? S.avatarImg : '');
  setVal('inRunTxt', S.runText);
  setVal('inAc', S.accent); setVal('inAcH', S.accent);
  setVal('inBg', S.bg); setVal('inBgH', S.bg);

  setSwitch('swDark', S.dark);
  setSwitch('swGlow', S.glow);
  setSwitch('swBlur', S.blur);
  setSwitch('swParticle', S.particle);
  setSwitch('swCursor', S.cursor);
  setSwitch('swSound', S.sound);
  setSwitch('swVibrate', S.vibrate);
  setSwitch('swClock', S.clock);
  setSwitch('swRipple', S.ripple);

  pickActiveByData('lt', S.layout);
  pickActiveByData('sh', S.shape);
  pickActiveByData('gp', S.gap);
  pickActiveByData('cn', S.corner);
  pickActiveByData('hp', S.headerPos);
  pickActiveByData('iz', S.iconSize);
  pickActiveByData('ish', S.iconShape);
  pickActiveByData('ia', S.iconAnim);
  pickActiveByData('ba', S.btnAnim);
  pickActiveByData('an', S.anim);
  pickActiveByData('wp', S.wp);
}

function setVal(id, v){ const el = document.getElementById(id); if (el) el.value = v; }
function setSwitch(id, on){ const el = document.getElementById(id); if (el) el.classList.toggle('on', on); }
function pickActiveByData(key, val){
  document.querySelectorAll('.chip[data-' + key + ']').forEach(el => {
    el.classList.toggle('active', el.dataset[key] === val);
  });
}

// ============ TOGGLE ============
function toggleDark(){
  S.dark = !S.dark;
  applyTheme(); save();
  setSwitch('swDark', S.dark);
  playSound();
  showToast(S.dark ? 'Mode gelap' : 'Mode terang');
  closeDD();
}

function toggleSwitch(el, key){
  S[key] = !S[key];
  el.classList.toggle('on', S[key]);
  playSound();
  if (key === 'glow' || key === 'blur') applyBodyClasses();
  if (key === 'particle') applyParticles();
  if (key === 'cursor') applyCursor();
  if (key === 'clock') applyProfile();
  if (key === 'ripple') {} // efek ripple otomatis
  save();
}

function pickOne(key, el){
  el.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  const val = el.dataset[key];
  const map = {
    lt: 'layout', sh: 'shape', gp: 'gap', cn: 'corner', hp: 'headerPos',
    iz: 'iconSize', ish: 'iconShape', ia: 'iconAnim', ba: 'btnAnim',
    an: 'anim', wp: 'wp'
  };
  const field = map[key];
  if (field){
    S[field] = val;
    applyBodyClasses();
    playSound();
    save();
  }
}

// ============ SETTINGS ============
function openSettings(){
  closeDD();
  updateUIFromState();
  document.getElementById('mback').classList.add('open');
}
function closeSettings(e){
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('mback').classList.remove('open');
}
function pickTab(tab){
  document.querySelectorAll('.mtab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.mpanel').forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
}

function saveSettings(){
  S.name = getVal('inName') || 'User';
  S.avatar = getVal('inAv') || S.name.charAt(0).toUpperCase();
  S.avatarEmoji = getVal('inEmoji');
  const url = getVal('inAvUrl');
  if (url) S.avatarImg = url;
  S.runText = getVal('inRunTxt') || '▶ JALANKAN';
  S.accent = getVal('inAcH') || S.accent;
  S.bg = getVal('inBgH') || S.bg;
  applyAll(); save();
  closeSettings();
  playSound();
  showToast('Pengaturan disimpan ✓');
  vibrate(20);
}
function getVal(id){ const el = document.getElementById(id); return el ? el.value.trim() : ''; }

// Sinkron color input
['inAc','inBg'].forEach(id => {
  const el = document.getElementById(id);
  const elH = document.getElementById(id + 'H');
  if (el && elH){
    el.addEventListener('input', e => { elH.value = e.target.value; });
    elH.addEventListener('input', e => {
      if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) el.value = e.target.value;
    });
  }
});

// ============ THEME PRESETS ============
function renderThemePresets(){
  const box = document.getElementById('themePresets');
  box.innerHTML = '';
  THEMES.forEach((t, i) => {
    const d = document.createElement('div');
    d.className = 'tpreset';
    d.style.background = 'linear-gradient(135deg,' + t.accent + ',' + shade(t.accent, -20) + ')';
    d.innerHTML = '<span class="nm">' + t.name + '</span>';
    d.onclick = () => applyThemePreset(i);
    box.appendChild(d);
  });
}
function applyThemePreset(i){
  const t = THEMES[i];
  S.accent = t.accent; S.bg = t.bg; S.dark = t.dark;
  applyAll(); save();
  setVal('inAc', t.accent); setVal('inAcH', t.accent);
  setVal('inBg', t.bg); setVal('inBgH', t.bg);
  setSwitch('swDark', S.dark);
  document.querySelectorAll('.tpreset').forEach((el, j) => el.classList.toggle('active', j === i));
  playSound();
  showToast('Tema: ' + t.name);
}
function renderAccentPresets(){
  const box = document.getElementById('acPresets');
  box.innerHTML = '';
  ACCENTS.forEach(c => {
    const d = document.createElement('div');
    d.className = 'preset';
    d.style.background = c;
    d.onclick = () => {
      S.accent = c;
      applyTheme(); save();
      setVal('inAc', c); setVal('inAcH', c);
      playSound();
    };
    box.appendChild(d);
  });
}

// ============ RANDOM / RESET ============
function randomizeAll(){
  const t = THEMES[Math.floor(Math.random() * THEMES.length)];
  S.accent = t.accent; S.bg = t.bg; S.dark = t.dark;
  S.layout = ['layout-standard','layout-grid','layout-sidebar','layout-float','layout-split','layout-magazine'][Math.floor(Math.random()*6)];
  S.shape = ['shape-square','shape-soft','shape-round','shape-pill','shape-tilt','shape-diamond'][Math.floor(Math.random()*6)];
  S.gap = ['gap-tight','gap-normal','gap-loose'][Math.floor(Math.random()*3)];
  S.corner = ['corner-line','corner-dot','corner-x','corner-none'][Math.floor(Math.random()*4)];
  S.headerPos = ['header-left','header-center','header-right'][Math.floor(Math.random()*3)];
  S.iconSize = ['icon-sm','icon-md','icon-lg','icon-xl'][Math.floor(Math.random()*4)];
  S.iconShape = ['iconcircle','iconsquare','iconpill','icondiamond'][Math.floor(Math.random()*4)];
  S.iconAnim = ['icon-shake','icon-rotate','icon-bounce','icon-none'][Math.floor(Math.random()*4)];
  S.btnAnim = ['btn-normal','btn-shake','btn-glow'][Math.floor(Math.random()*3)];
  S.anim = ['anim-fast','anim-smooth'][Math.floor(Math.random()*2)];
  S.wp = ['wp-none','wp-dots','wp-grid','wp-mesh'][Math.floor(Math.random()*4)];
  S.particle = Math.random() > 0.5;
  S.glow = Math.random() > 0.5;
  S.blur = Math.random() > 0.7;
  applyAll(); save();
  closeDD();
  playSound();
  vibrate(30);
  showToast('🎲 Acak semua!');
}

function resetAll(){
  if (!confirm('Reset semua pengaturan ke default?')) return;
  const inp = S.input, files = S.files;
  Object.assign(S, {
    name: 'Tuan Gigs', avatar: 'G', avatarImg: '', avatarEmoji: '',
    accent: '#ff8c1a', bg: '#f7f7f9', dark: false,
    layout: 'layout-standard', shape: 'shape-soft', gap: 'gap-normal',
    corner: 'corner-line', headerPos: 'header-left',
    iconSize: 'icon-md', iconShape: 'iconcircle', iconAnim: 'icon-shake',
    ripple: true, btnAnim: 'btn-normal', anim: 'anim-smooth',
    wp: 'wp-none', glow: false, blur: false, particle: false, cursor: false,
    sound: false, vibrate: false, clock: false, runText: '▶ JALANKAN'
  });
  S.input = inp; S.files = files;
  applyAll(); save();
  closeSettings();
  playSound();
  showToast('↺ Direset ke default');
}

// ============ PRESENTASI ============
function togglePresent(){
  document.body.classList.toggle('present');
  playSound();
  showToast(document.body.classList.contains('present') ? 'Mode presentasi' : 'Normal');
  closeDD();
}

// ============ FULLSCREEN ============
function toggleFullscreen(){
  const el = document.documentElement;
  if (!document.fullscreenElement){
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (el.webkitExitFullscreen) el.webkitExitFullscreen();
  }
  closeDD();
}

// ============ CLOCK ============
function startClock(){
  function update(){
    const d = new Date();
    const t = String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
    const days = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
    const dd = days[d.getDay()] + ', ' + d.getDate() + '/' + (d.getMonth() + 1);
    const et = document.getElementById('clockT');
    const ed = document.getElementById('clockD');
    if (et) et.textContent = t;
    if (ed) ed.textContent = dd;
  }
  update();
  setInterval(update, 1000);
}

// ============ SOUND & VIBRATE ============
let audioCtx;
function playSound(){
  if (!S.sound) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'sine';
    o.frequency.value = 620;
    g.gain.value = 0.06;
    o.start();
    o.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    o.stop(audioCtx.currentTime + 0.1);
  } catch(e){}
}
function vibrate(ms){
  if (!S.vibrate) return;
  if (navigator.vibrate) navigator.vibrate(ms);
}

// ============ RIPPLE ============
function addRipple(e){
  if (!S.ripple) return;
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = (e.clientX || (e.touches && e.touches[0].clientX) || rect.left + rect.width/2) - rect.left - size/2;
  const y = (e.clientY || (e.touches && e.touches[0].clientY) || rect.top + rect.height/2) - rect.top - size/2;
  const r = document.createElement('span');
  r.className = 'ripple';
  r.style.width = r.style.height = size + 'px';
  r.style.left = x + 'px';
  r.style.top = y + 'px';
  el.appendChild(r);
  setTimeout(() => r.remove(), 600);
}

// Bind ripple ke semua tombol
function bindRipple(){
  document.querySelectorAll('.icon-btn, .hbtn, .ibtn, .run-btn, .clr-btn, .chip, .dd-item, .mtab, .tpreset, .preset').forEach(el => {
    if (el.dataset.rippleBound) return;
    el.dataset.rippleBound = '1';
    el.addEventListener('click', addRipple);
  });
}

// ============ DROPDOWN ============
function toggleDD(e){
  e.stopPropagation();
  document.getElementById('dd').classList.toggle('open');
}
function closeDD(){
  document.getElementById('dd').classList.remove('open');
}
document.addEventListener('click', closeDD);

// ============ PROGRESS ============
function prog(show){ document.getElementById('prog').classList.toggle('show', show); }
function progSet(lbl, pct){
  document.getElementById('progLbl').textContent = lbl;
  document.getElementById('progPct').textContent = Math.round(pct) + '%';
  document.getElementById('progFill').style.width = pct + '%';
}

// ============ LOG ============
function log(msg, type){
  const c = document.getElementById('console');
  c.classList.add('show');
  const d = document.createElement('div');
  d.className = type || 'log';
  d.textContent = '› ' + msg;
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}
function clearLog(){
  document.getElementById('console').innerHTML = '';
  document.getElementById('console').classList.remove('show');
}

// ============ FILE INPUT ============
document.getElementById('fileIn').addEventListener('change', async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  prog(true);
  let i = 0;
  for (const f of files){
    i++;
    progSet('Membaca ' + f.name, (i / files.length) * 100);
    await tick();
    const txt = await f.text();
    S.files.push({ name: f.name, content: txt, ext: f.name.split('.').pop().toLowerCase() });
  }
  renderFiles();
  prog(false);
  if (files.length === 1){
    const f = S.files[S.files.length - 1];
    document.getElementById('input').value = f.content;
    S.input = f.content;
  }
  playSound();
  vibrate(20);
  showToast(files.length + ' file dimuat');
});

// ============ ZIP ============
document.getElementById('zipIn').addEventListener('change', async (e) => {
  const f = e.target.files[0]; if (!f) return;
  if (typeof JSZip === 'undefined'){ showToast('Butuh internet untuk JSZip'); return; }

  const btn = document.getElementById('runBtn');
  btn.disabled = true;
  document.getElementById('runLabel').textContent = '⏳ Membaca ZIP...';
  prog(true); clearLog();
  progSet('Membuka ZIP...', 5);
  const t0 = Date.now();

  try {
    const zip = await JSZip.loadAsync(f);
    const entries = Object.keys(zip.files).filter(n => !zip.files[n].dir);
    log('ZIP: ' + entries.length + ' file', 'log');
    if (!entries.length) throw new Error('ZIP kosong');

    const blobs = {};
    let done = 0;
    const BATCH = 10;

    for (let i = 0; i < entries.length; i += BATCH){
      const b = entries.slice(i, i + BATCH);
      await Promise.all(b.map(async p => {
        try {
          const ext = p.split('.').pop().toLowerCase();
          const blob = await zip.files[p].async('blob');
          blobs[p] = URL.createObjectURL(new Blob([blob], {type: mime(ext)}));
        } catch(err){}
        done++;
      }));
      progSet('Memproses ' + done + '/' + entries.length, 10 + (done / entries.length) * 70);
      await tick();
    }

    progSet('Merakit halaman...', 85);

    const htmls = entries.filter(p => /\.(html|htm)$/i.test(p));
    if (!htmls.length) throw new Error('Tidak ada HTML di ZIP');

    let main = htmls.find(p => p.toLowerCase() === 'index.html')
            || htmls.find(p => p.toLowerCase().endsWith('/index.html'))
            || htmls[0];

    const base = main.substring(0, main.lastIndexOf('/') + 1);
    let html = await zip.files[main].async('string');

    // Ganti src & href
    html = html.replace(/(src|href)\s*=\s*["']([^"']+)["']/gi, (m, a, r) => {
      if (/^(https?:|data:|blob:|#|javascript:|mailto:|tel:)/i.test(r)) return m;
      const clean = r.replace(/^\.\//, '').replace(/^\//, '');
      for (const c of [base + clean, clean, base + r, r]) if (blobs[c]) return a + '="' + blobs[c] + '"';
      return m;
    });

    // Ganti url() di CSS inline
    html = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (m, css) => {
      const nc = css.replace(/url\(\s*["']?([^"')]+)["']?\s*\)/gi, (mm, r) => {
        if (/^(https?:|data:|blob:)/i.test(r)) return mm;
        const clean = r.replace(/^\.\//, '').replace(/^\//, '');
        for (const c of [base + clean, clean]) if (blobs[c]) return 'url("' + blobs[c] + '")';
        return mm;
      });
      return '<style>' + nc + '</style>';
    });

    S.files = entries.map(p => ({name: p.split('/').pop(), ext: p.split('.').pop().toLowerCase()}));
    renderFiles();
    S.input = html;
    document.getElementById('input').value = html;

    const el = ((Date.now() - t0) / 1000).toFixed(1);
    progSet('Selesai!', 100);
    log('ZIP siap (' + el + 's)', 'ok');
    playSound();
    vibrate(30);
    showToast('ZIP siap — ' + el + 's');

    setTimeout(() => { prog(false); run(); }, 300);

  } catch(err){
    log('ERROR: ' + err.message, 'err');
    showToast('Gagal: ' + err.message);
    prog(false);
  }
  btn.disabled = false;
  document.getElementById('runLabel').textContent = S.runText || '▶ JALANKAN';
});

// ============ IMAGE ============
document.getElementById('imgIn').addEventListener('change', async (e) => {
  const f = e.target.files[0]; if (!f) return;
  S.avatarImg = URL.createObjectURL(f);
  S.avatarEmoji = '';
  applyProfile(); save();
  playSound();
  showToast('Foto profil diganti');
});

// ============ HELPERS ============
function tick(){ return new Promise(r => setTimeout(r, 0)); }
function mime(ext){
  const m = {
    html:'text/html', htm:'text/html', css:'text/css',
    js:'application/javascript', mjs:'application/javascript', json:'application/json',
    png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', gif:'image/gif',
    svg:'image/svg+xml', webp:'image/webp', ico:'image/x-icon',
    mp4:'video/mp4', webm:'video/webm', mp3:'audio/mpeg', wav:'audio/wav',
    woff:'font/woff', woff2:'font/woff2', ttf:'font/ttf', otf:'font/otf',
    md:'text/markdown', txt:'text/plain', xml:'application/xml'
  };
  return m[ext] || 'application/octet-stream';
}
function renderFiles(){
  const l = document.getElementById('flist');
  l.innerHTML = '';
  S.files.forEach((f, i) => {
    const c = document.createElement('div');
    c.className = 'fchip';
    c.innerHTML = '<span class="nm">' + escapeHtml(f.name) + '</span><span class="rm" onclick="rmFile(' + i + ')">×</span>';
    l.appendChild(c);
  });
}
function rmFile(i){ S.files.splice(i, 1); renderFiles(); }
function escapeHtml(s){
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ============ DETEKSI TIPE ============
function detectType(code){
  const t = code.trim();
  if (/<!DOCTYPE\s+html/i.test(t) || /<html[\s>]/i.test(t)) return 'html';
  if (/<(div|span|p|h[1-6]|a|img|button|input|form|table|ul|ol|li|section|header|footer|nav|main|article|canvas|svg|video|audio|iframe)[\s>]/i.test(t)) return 'html';
  if (/^[\[{]/.test(t)){ try { JSON.parse(t); return 'json'; } catch(e){} }
  if (/^#{1,6}\s/m.test(t) || /^\s*[-*+]\s/m.test(t) || /\*\*[^*]+\*\*/.test(t)) return 'md';
  if (/^[\s\S]*?\{[\s\S]*?[\w-]+\s*:\s*[^}]+\}/.test(t) && !/[<>]/.test(t)) return 'css';
  if (/<\?php/i.test(t)) return 'php';
  if (/^\s*(import|from)\s+\w+|^\s*def\s+\w+\s*\(/m.test(t)) return 'python';
  if (/^\s*<\?xml/i.test(t)) return 'xml';
  if (/\b(function|const|let|var|=>|class|console\.|document\.|window\.)\b/.test(t)) return 'js';
  return 'text';
}

// ============ RUN ============
function run(){
  const code = document.getElementById('input').value;
  S.input = code;
  const box = document.getElementById('previewBox');
  clearLog();

  if (!code.trim()){
    box.innerHTML = '<div class="pempty"><div class="big">⧉</div><div>Tempel kode atau upload file/ZIP<br>lalu klik JALANKAN</div></div>';
    return;
  }

  const type = detectType(code);
  log('Terdeteksi: ' + type.toUpperCase(), 'log');
  vibrate(15);

  if (type === 'html'){ renderHTML(code); return; }

  if (type === 'json'){
    try {
      const obj = JSON.parse(code);
      const pretty = JSON.stringify(obj, null, 2);
      const colored = escapeHtml(pretty)
        .replace(/"([^"]+)"(\s*:)/g, '<span style="color:#79c0ff">"$1"</span>$2')
        .replace(/:\s*"([^"]*)"/g, ': <span style="color:#a5d6ff">"$1"</span>')
        .replace(/:\s*(\d+\.?\d*)/g, ': <span style="color:#ffa657">$1</span>')
        .replace(/:\s*(true|false|null)/g, ': <span style="color:#ff7b72">$1</span>');
      renderAsHTML('<style>body{background:#0d1117;color:#c9d1d9;font-family:Consolas,monospace;padding:20px;font-size:13px;line-height:1.7;white-space:pre-wrap;word-break:break-word}</style>' + colored);
      log('JSON valid ✓', 'ok');
    } catch(e){
      renderAsHTML('<style>body{background:#0d1117;color:#c9d1d9;font-family:Consolas,monospace;padding:20px;font-size:13px;white-space:pre-wrap}</style>' + escapeHtml(code));
      log('JSON tidak valid: ' + e.message, 'err');
    }
    return;
  }

  if (type === 'md'){
    const html = md2html(code);
    renderAsHTML('<style>body{font-family:system-ui,sans-serif;padding:24px;max-width:800px;margin:auto;line-height:1.7;color:#18181b}h1,h2,h3{margin:18px 0 10px;font-weight:700}h1{font-size:26px;border-bottom:2px solid ' + S.accent + ';padding-bottom:8px}h2{font-size:20px}h3{font-size:16px}code{background:#f4f4f5;padding:2px 7px;border-radius:4px;font-family:Consolas,monospace;font-size:.9em}pre{background:#0d1117;color:#c9d1d9;padding:14px;border-radius:10px;overflow:auto;font-family:Consolas,monospace;font-size:13px}blockquote{border-left:4px solid ' + S.accent + ';padding:8px 16px;color:#666;background:#fafafa;margin:12px 0;border-radius:0 8px 8px 0}a{color:' + S.accent + '}</style>' + html);
    log('Markdown dirender', 'ok');
    return;
  }

  if (type === 'css'){
    renderAsHTML('<style>body{background:#0d1117;color:#c9d1d9;font-family:Consolas,monospace;padding:20px;font-size:13px;line-height:1.7;white-space:pre-wrap;word-break:break-word}</style><div style="color:#7ee787">/* CSS — tidak menghasilkan tampilan visual sendiri */</div>\n' + escapeHtml(code));
    log('CSS ditampilkan', 'ok');
    return;
  }

  if (type === 'js'){
    const doc = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>' +
      'body{background:#0d1117;color:#c9d1d9;font-family:Consolas,monospace;padding:20px;font-size:13px;line-height:1.7}' +
      '.log{color:#7ee787;margin:4px 0}' +
      '</style></head><body>' +
      '<div style="color:#888;margin-bottom:12px">// Output JavaScript:</div>' +
      '<div id="out"></div>' +
      '<script>' +
      '(function(){' +
      '  var out = document.getElementById("out");' +
      '  var _log = console.log;' +
      '  console.log = function(){' +
      '    var d = document.createElement("div");' +
      '    d.className = "log";' +
      '    d.textContent = "› " + Array.from(arguments).map(function(a){' +
      '      try{return typeof a==="object"?JSON.stringify(a):String(a)}catch(e){return String(a)}' +
      '    }).join(" ");' +
      '    out.appendChild(d);' +
      '    _log.apply(console, arguments);' +
      '  };' +
      '  try {' + code + '}' +
      '  catch(e){' +
      '    var d = document.createElement("div");' +
      '    d.style.color = "#ff7b72";' +
      '    d.textContent = "❌ " + e.message;' +
      '    out.appendChild(d);' +
      '  }' +
      '})();' +
      '<\/script></body></html>';
    renderAsHTML(doc);
    log('JS dijalankan', 'ok');
    return;
  }

  if (type === 'php' || type === 'python'){
    renderAsHTML('<style>body{background:#0d1117;color:#c9d1d9;font-family:Consolas,monospace;padding:24px;font-size:13px;line-height:1.8;white-space:pre-wrap;word-break:break-word}</style>' +
      '<div style="color:#ffa657;font-weight:bold;margin-bottom:16px">⚠ Kode ' + type.toUpperCase() + ' butuh server asli — tidak bisa jalan di browser.</div>' +
      '<div style="color:#79c0ff;margin-bottom:16px">Preview menampilkan kode sebagai teks. Untuk menjalankan, butuh server (XAMPP, hosting).</div>' +
      '<div style="border-top:1px solid #30363d;padding-top:16px">' + escapeHtml(code) + '</div>');
    log('Kode ' + type.toUpperCase() + ' butuh server', 'warn');
    return;
  }

  renderAsHTML('<style>body{background:#0d1117;color:#c9d1d9;font-family:Consolas,monospace;padding:20px;font-size:13px;line-height:1.7;white-space:pre-wrap;word-break:break-word}</style>' + escapeHtml(code));
  log('Ditampilkan sebagai teks', 'ok');
}

function renderHTML(html){
  let doc = html;
  if (!/<html[\s>]/i.test(doc)){
    doc = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body>' + doc + '</body></html>';
  }
  const catcher = '<script>' +
    'window.addEventListener("error",function(e){try{parent.postMessage({type:"err",msg:e.message+" @ baris "+e.lineno},"*")}catch(_){}});' +
    'window.addEventListener("unhandledrejection",function(e){try{parent.postMessage({type:"err",msg:"Promise: "+(e.reason&&e.reason.message||e.reason)},"*")}catch(_){}});' +
    'var _l=console.log,_e=console.error,_w=console.warn;' +
    'console.log=function(){try{parent.postMessage({type:"log",msg:Array.from(arguments).map(function(a){try{return typeof a==="object"?JSON.stringify(a):String(a)}catch(_){return String(a)}}).join(" ")},"*")}catch(_){}_l.apply(console,arguments)};' +
    'console.error=function(){try{parent.postMessage({type:"err",msg:Array.from(arguments).map(String).join(" ")},"*")}catch(_){}_e.apply(console,arguments)};' +
    'console.warn=function(){try{parent.postMessage({type:"warn",msg:Array.from(arguments).map(String).join(" ")},"*")}catch(_){}_w.apply(console,arguments)};' +
    '<\/script>';
  if (/<head[^>]*>/i.test(doc)) doc = doc.replace(/<head[^>]*>/i, m => m + catcher);
  else doc = catcher + doc;
  renderAsHTML(doc);
  log('HTML dirender', 'ok');
}

function renderAsHTML(html){
  const box = document.getElementById('previewBox');
  box.innerHTML = '';
  const frame = document.createElement('iframe');
  frame.className = 'pframe';
  frame.id = 'pframe';
  frame.setAttribute('sandbox', 'allow-scripts allow-modals allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-downloads allow-presentation');
  frame.setAttribute('allow', 'autoplay; encrypted-media; fullscreen; clipboard-write');
  if (S.blobUrl) URL.revokeObjectURL(S.blobUrl);
  const blob = new Blob([html], {type: 'text/html'});
  S.blobUrl = URL.createObjectURL(blob);
  frame.src = S.blobUrl;
  box.appendChild(frame);
}

window.addEventListener('message', (e) => {
  if (!e.data || !e.data.type) return;
  if (e.data.type === 'err') log('ERROR: ' + e.data.msg, 'err');
  if (e.data.type === 'log') log(e.data.msg, 'log');
  if (e.data.type === 'warn') log('WARN: ' + e.data.msg, 'warn');
});

function md2html(md){
  let h = md;
  h = h.replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, code) => '<pre><code>' + escapeHtml(code) + '</code></pre>');
  h = h.replace(/^###### (.*)$/gm, '<h6>$1</h6>');
  h = h.replace(/^##### (.*)$/gm, '<h5>$1</h5>');
  h = h.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
  h = h.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  h = h.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  h = h.replace(/^# (.*)$/gm, '<h1>$1</h1>');
  h = h.replace(/^---$/gm, '<hr>');
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/\*(.+?)\*/g, '<em>$1</em>');
  h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  h = h.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');
  h = h.replace(/^\s*[-*+] (.*)$/gm, '<li>$1</li>');
  h = h.replace(/(<li>.*<\/li>\n?)+/g, m => '<ul>' + m + '</ul>');
  h = h.split(/\n{2,}/).map(p => {
    if (/^\s*<(h[1-6]|ul|ol|li|pre|blockquote|hr|div)/.test(p)) return p;
    return p.trim() ? '<p>' + p.replace(/\n/g, '<br>') + '</p>' : '';
  }).join('\n');
  return h;
}

// ============ CLEAR ============
function clearAll(){
  document.getElementById('input').value = '';
  S.input = '';
  S.files = [];
  if (S.blobUrl){ URL.revokeObjectURL(S.blobUrl); S.blobUrl = null; }
  renderFiles();
  document.getElementById('previewBox').innerHTML = '<div class="pempty"><div class="big">⧉</div><div>Tempel kode atau upload file/ZIP<br>lalu klik JALANKAN</div></div>';
  clearLog(); prog(false);
  playSound(); vibrate(15);
  showToast('Dibersihkan');
}

// ============ TOAST ============
let tT;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(tT);
  tT = setTimeout(() => t.classList.remove('show'), 2200);
}

// ============ KEYBOARD ============
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'Enter'){ e.preventDefault(); run(); }
  if (e.key === 'Escape'){ closeSettings(); closeDD(); }
});

// ============ INIT ============
load();
bindRipple();

// Re-bind ripple kalau ada elemen baru
const observer = new MutationObserver(() => bindRipple());
observer.observe(document.body, { childList: true, subtree: true });
