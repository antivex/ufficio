const geoCache = new Map();
function rbox(w, h, d, r = 0.06) {
  const k = [w, h, d, r].join("|");
  if (geoCache.has(k)) return geoCache.get(k);
  r = Math.max(0.002, Math.min(r, w / 2 - 0.002, h / 2 - 0.002, d / 2 - 0.002));
  const W = w - 2 * r, H = h - 2 * r, c = Math.max(0.001, Math.min(r, W / 2, H / 2) * 0.9), x0 = -W / 2, y0 = -H / 2;
  const s = new THREE.Shape();
  s.moveTo(x0 + c, y0); s.lineTo(x0 + W - c, y0); s.quadraticCurveTo(x0 + W, y0, x0 + W, y0 + c);
  s.lineTo(x0 + W, y0 + H - c); s.quadraticCurveTo(x0 + W, y0 + H, x0 + W - c, y0 + H);
  s.lineTo(x0 + c, y0 + H); s.quadraticCurveTo(x0, y0 + H, x0, y0 + H - c); s.lineTo(x0, y0 + c); s.quadraticCurveTo(x0, y0, x0 + c, y0);
  const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(d - 2 * r, 0.001), bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 2, curveSegments: 3 });
  g.center(); g.computeVertexNormals(); geoCache.set(k, g); return g;
}
const sfera = (r, a = 16, b = 12) => { const k = "s" + r + "|" + a; if (!geoCache.has(k)) geoCache.set(k, new THREE.SphereGeometry(r, a, b)); return geoCache.get(k); };
const matCache = new Map();
const mat = (color, extra = {}) => { const k = color + JSON.stringify(extra); if (!matCache.has(k)) matCache.set(k, new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.02, ...extra })); return matCache.get(k); };
function mesh(geo, material, x = 0, y = 0, z = 0, parent = scene, ombra = true) {
  const m = new THREE.Mesh(geo, material); m.position.set(x, y, z);
  m.castShadow = ombra; m.receiveShadow = true; parent.add(m); return m;
}
const tutti = [];
function testo(w, h, disegna) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const tex = new THREE.CanvasTexture(c); tex.anisotropy = 4;
  const api = { c, ctx: c.getContext("2d"), tex, ridisegna(...a) { disegna(api.ctx, w, h, ...a); tex.needsUpdate = true; } };
  api.ridisegna(); tutti.push(api); return api;
}
const vivo = t => { t.vivo = true; return t; };
const gruppo = (tipo, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); g.userData.tipo = tipo; scene.add(g); return g; };
const cliccabili = [];

// Pavimento a diorama, pareti, finestre
mesh(rbox(20.4, 0.7, 14.4, 0.25), mat("#cfc6b8"), 0, -0.35, 0.2);
const pavimento = gruppo("pavimento");
mesh(rbox(20, 0.06, 14, 0.03), mat("#ece7df"), 0, 0.0, 0.2, pavimento, false);
mesh(rbox(7.6, 0.03, 11.6, 0.4), mat("#f2d3bd"), -6.0, 0.04, 0.4, pavimento, false);
mesh(rbox(7.6, 0.03, 11.6, 0.4), mat("#cfe9e1"), 6.0, 0.04, 0.4, pavimento, false);
cliccabili.push(pavimento);
mesh(rbox(20.4, 3.4, 0.3, 0.08), mat("#dfe4ea"), 0, 1.7, -6.85);
mesh(rbox(0.3, 1.2, 14.4, 0.08), mat("#dfe4ea"), -10.05, 0.6, 0.2);
mesh(rbox(0.3, 1.2, 14.4, 0.08), mat("#dfe4ea"), 10.05, 0.6, 0.2);
const vetri = [];
for (const x of [-7.6, -4.4, 4.4, 7.6]) {
  mesh(rbox(2.3, 1.5, 0.12, 0.05), mat("#b7c2cf"), x, 2.05, -6.7, scene, false);
  vetri.push(mesh(new THREE.PlaneGeometry(2.05, 1.25), new THREE.MeshBasicMaterial({ color: 0xcfe6f7 }), x, 2.05, -6.63, scene, false));
}
for (const [str, col, x] of [["Claude", "#c8623f", -6], ["ChatGPT · Codex", "#0d8f6f", 6]]) {
  const t = testo(512, 96, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = col; g.font = "800 66px Rubik, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(str, w / 2, h / 2 + 4); });
  mesh(new THREE.PlaneGeometry(4.6, 0.86), new THREE.MeshBasicMaterial({ map: t.tex, transparent: true }), x, 3.12, -6.68, scene, false);
}

// Bacheca della lista comune
const bacheca = gruppo("bacheca", 0, 1.75, -6.62);
mesh(rbox(3.0, 1.9, 0.08, 0.04), mat("#8a6a4c"), 0, 0, 0, bacheca);
mesh(rbox(2.8, 1.7, 0.06, 0.02), mat("#c9a27a"), 0, 0, 0.03, bacheca, false);
const titoloBacheca = testo(256, 48, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = "#3b2a1c"; g.font = "700 30px Rubik, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("Lista comune", w / 2, h / 2); });
mesh(new THREE.PlaneGeometry(1.4, 0.26), new THREE.MeshBasicMaterial({ map: titoloBacheca.tex, transparent: true }), 0, 0.68, 0.07, bacheca, false);
const foglietti = {};
ISSUE.forEach(([n, nome], i) => {
  const t = testo(160, 128, (g, w, h) => {
    g.fillStyle = "#bfeadb"; g.fillRect(0, 0, w, h);
    g.fillStyle = "#1c2230"; g.font = "800 30px Rubik, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(n, w / 2, h / 2);
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.37), new THREE.MeshStandardMaterial({ map: t.tex, roughness: 0.9, emissive: 0xffffff, emissiveIntensity: 0 }));
  m.position.set(-1.1 + (i % 5) * 0.55, 0.28 - Math.floor(i / 5) * 0.5, 0.08); m.rotation.z = ((i * 37) % 7 - 3) * 0.02;
  bacheca.add(m); foglietti[n] = m;
});
cliccabili.push(bacheca);
const quadrante = vivo(testo(256, 256, (g, w, h, ora = "--:--") => {
  g.clearRect(0, 0, w, h); g.fillStyle = "#ffffff"; g.beginPath(); g.arc(w / 2, h / 2, 120, 0, 7); g.fill();
  g.lineWidth = 10; g.strokeStyle = "#1c2230"; g.stroke();
  g.fillStyle = "#1c2230"; g.font = "700 64px 'JetBrains Mono', monospace"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(ora, w / 2, h / 2 + 4);
}));
mesh(new THREE.CircleGeometry(0.42, 40), new THREE.MeshBasicMaterial({ map: quadrante.tex, transparent: true }), 0, 3.0, -6.66, scene, false);

// Cassa
const cassa = gruppo("cassa", 0, 0, 5.6);
mesh(rbox(2.2, 0.95, 0.85, 0.08), mat("#7e8a99"), 0, 0.48, 0, cassa);
mesh(rbox(2.3, 0.08, 0.95, 0.03), mat("#e9e2d6"), 0, 0.99, 0, cassa);
mesh(rbox(0.7, 0.32, 0.5, 0.05), mat("#2b2f36"), 0.35, 1.2, 0, cassa);
const display = testo(256, 96, (g, w, h) => { g.fillStyle = "#0e1a12"; g.fillRect(0, 0, w, h); g.fillStyle = "#7dfc9a"; g.font = "700 52px 'JetBrains Mono', monospace"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("0,00 €", w / 2, h / 2 + 2); });
mesh(new THREE.PlaneGeometry(0.62, 0.22), new THREE.MeshBasicMaterial({ map: display.tex }), 0.35, 1.38, 0.26, cassa, false).rotation.x = -0.35;
const cartello = testo(256, 64, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = "#1c2230"; g.font = "800 40px Rubik, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("CASSA", w / 2, h / 2); });
mesh(new THREE.PlaneGeometry(0.9, 0.22), new THREE.MeshBasicMaterial({ map: cartello.tex, transparent: true }), -0.5, 0.62, 0.44, cassa, false);
cliccabili.push(cassa);

// Macchina del caffè, server di Codex, piante
const caffe = gruppo("caffe", 2.2, 0, -6.3);
mesh(rbox(0.9, 0.9, 0.6, 0.05), mat("#a99c8a"), 0, 0.45, 0, caffe);
mesh(rbox(0.45, 0.55, 0.4, 0.06), mat("#2b2f36"), 0, 1.18, 0, caffe);
mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.12, 14), mat("#ffffff"), 0.25, 0.96, 0.18, caffe);
cliccabili.push(caffe);
const server = gruppo("server", 9.35, 0, -3.6);
mesh(rbox(0.9, 2.1, 0.8, 0.06), mat("#2f353f"), 0, 1.05, 0, server);
const ledServer = [];
for (let i = 0; i < 6; i++) ledServer.push(mesh(sfera(0.035, 8, 6), new THREE.MeshBasicMaterial({ color: 0x35c9a0 }), -0.47, 0.5 + i * 0.28, 0.25, server, false));
cliccabili.push(server);
const piante = [];
function pianta(x, z, s = 1) {
  const g = gruppo("pianta", x, 0, z); g.userData.mobile = true;
  mesh(new THREE.CylinderGeometry(0.28 * s, 0.22 * s, 0.5 * s, 18), mat("#d7cbbb"), 0, 0.25 * s, 0, g);
  const chioma = new THREE.Group(); chioma.position.y = 0.5 * s; g.add(chioma);
  for (const [dx, dy, dz, r] of [[0, 0.35, 0, 0.42], [0.18, 0.55, 0.08, 0.3], [-0.16, 0.62, -0.06, 0.28]]) mesh(sfera(r * s), mat("#5f9c63"), dx * s, dy * s, dz * s, chioma);
  g.userData.chioma = chioma; g.userData.scossa = 0; piante.push(g); cliccabili.push(g);
}
pianta(-9.3, -6.1); pianta(9.3, -6.1); pianta(-9.3, 6.6, 0.9); pianta(9.3, 6.6, 0.9); pianta(-1.9, -6.2, 0.7);

// ---------- Scrivanie ----------
const RAD = { Claude: Math.PI / 2, Codex: -Math.PI / 2 };
const MAGLIA = { Claude: ["#d97757", "#c8623f", "#e0866a"], Codex: ["#10a37f", "#0d8f6f", "#1db890"] };
function schermo() {
  return vivo(testo(160, 100, (g, w, h, stato = "dorme", fase = 0, colore = "#10a37f") => {
    if (stato === "dorme" || stato === "consegna" || stato === "caffe") { g.fillStyle = "#14171c"; g.fillRect(0, 0, w, h); return; }
    g.fillStyle = "#1b2230"; g.fillRect(0, 0, w, h);
    if (stato === "libero") { g.fillStyle = colore; g.globalAlpha = 0.5; g.fillRect(14, 40, w - 28, 20); g.globalAlpha = 1; return; }
    for (let i = 0; i < 8; i++) {
      const y = 8 + i * 11, k = (i + Math.floor(fase)) % 7;
      g.fillStyle = k % 3 === 0 ? colore : k % 3 === 1 ? "#9fb3d1" : "#e6c07b";
      g.fillRect(8 + (k % 2) * 12, y, 30 + ((k * 37) % 90), 5);
    }
  }));
}
function scrivania(x, z, ex, conPersona) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = RAD[ex]; scene.add(g);
  mesh(rbox(1.5, 0.07, 0.8, 0.03), mat("#d8b98f"), 0, 0.8, 0.72, g);
  for (const [lx, lz] of [[-0.66, 0.4], [0.66, 0.4], [-0.66, 1.04], [0.66, 1.04]]) mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.78, 8), mat("#8a8f98"), lx, 0.39, lz, g);
  mesh(rbox(0.82, 0.5, 0.05, 0.03), mat("#2b2f36"), 0, 1.17, 0.98, g);
  mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.28, 8), mat("#2b2f36"), 0, 0.93, 1.02, g);
  mesh(rbox(0.5, 0.025, 0.16, 0.01), mat("#e9e6e1"), 0, 0.85, 0.6, g);
  const sch = schermo();
  mesh(new THREE.PlaneGeometry(0.74, 0.42), new THREE.MeshBasicMaterial({ map: sch.tex }), 0, 1.17, 0.95, g, false).rotation.y = Math.PI;
  mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.1, 12), mat(ex === "Claude" ? "#f2d3bd" : "#cfe9e1"), 0.55, 0.88, 0.62, g);
  mesh(rbox(0.55, 0.08, 0.55, 0.03), mat("#4d5562"), 0, 0.48, -0.05, g);
  mesh(rbox(0.55, 0.6, 0.07, 0.03), mat("#4d5562"), 0, 0.82, -0.33, g);
  mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.4, 8), mat("#8a8f98"), 0, 0.24, -0.05, g);
  mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.04, 16), mat("#8a8f98"), 0, 0.03, -0.05, g);
  if (!conPersona) {
    const t = testo(256, 64, (c, w, h) => { c.clearRect(0, 0, w, h); c.fillStyle = "#5a6475"; c.font = "600 30px Rubik, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("Posto libero", w / 2, h / 2); });
    mesh(new THREE.PlaneGeometry(0.8, 0.2), new THREE.MeshBasicMaterial({ map: t.tex, transparent: true }), 0, 0.84, 0.72, g, false).rotation.x = -Math.PI / 2;
  }
  return { g, sch };
}
const scrivanie = ROSTER.map(a => scrivania(a.posto[0], a.posto[1], a.ex, true));
for (const [x, z, ex] of LIBERI) scrivania(x, z, ex, false);
// Tutto ciò che non si muove smette di ricalcolare la propria posizione a ogni fotogramma.
scene.traverse(o => { let p = o, mobile = false; while (p) { if (p.userData.mobile) mobile = true; p = p.parent; } if (!mobile) { o.updateMatrix(); o.matrixAutoUpdate = false; } });

// ---------- Mappa per camminare (griglia da mezzo metro) ----------
const CELLA = 0.5, X0 = -9.5, Z0 = -6.25, NX = 39, NZ = 27;
const muro = new Uint8Array(NX * NZ);
function blocca(x1, z1, x2, z2, m = 0.22) {
  for (let i = 0; i < NX; i++) for (let j = 0; j < NZ; j++) {
    const cx = X0 + i * CELLA, cz = Z0 + j * CELLA;
    if (cx >= x1 - m && cx <= x2 + m && cz >= z1 - m && cz <= z2 + m) muro[j * NX + i] = 1;
  }
}
function bloccaLocale(x, z, rot, ax1, ax2, az1, az2, m) {
  if (rot > 0) blocca(x + az1, z - ax2, x + az2, z - ax1, m); else blocca(x - az2, z + ax1, x - az1, z + ax2, m);
}
for (const [x, z, ex] of [...ROSTER.map(a => [a.posto[0], a.posto[1], a.ex]), ...LIBERI]) {
  bloccaLocale(x, z, RAD[ex], -0.75, 0.75, 0.32, 1.12, 0.2);
  bloccaLocale(x, z, RAD[ex], -0.3, 0.3, -0.42, 0.25, 0.08);
}
blocca(-1.15, 5.15, 1.15, 6.05); blocca(1.75, -6.6, 2.65, -6.0); blocca(8.9, -4.0, 9.8, -3.2);
for (const [x, z] of [[-9.3, -6.1], [9.3, -6.1], [-9.3, 6.6], [9.3, 6.6], [-1.9, -6.2]]) blocca(x - 0.3, z - 0.3, x + 0.3, z + 0.3);
const cella = (x, z) => [Math.max(0, Math.min(NX - 1, Math.round((x - X0) / CELLA))), Math.max(0, Math.min(NZ - 1, Math.round((z - Z0) / CELLA)))];
const libera = (i, j) => i >= 0 && j >= 0 && i < NX && j < NZ && !muro[j * NX + i];
function vicinaLibera(i, j) {
  if (libera(i, j)) return [i, j];
  for (let r = 1; r < 12; r++) for (let di = -r; di <= r; di++) for (let dj = -r; dj <= r; dj++) if (Math.max(Math.abs(di), Math.abs(dj)) === r && libera(i + di, j + dj)) return [i + di, j + dj];
  return [i, j];
}
function vista(x1, z1, x2, z2, ok) {
  const n = Math.ceil(Math.hypot(x2 - x1, z2 - z1) / 0.2);
  for (let k = 1; k < n; k++) { const [i, j] = cella(x1 + (x2 - x1) * k / n, z1 + (z2 - z1) * k / n); if (!libera(i, j) && !ok(i, j)) return false; }
  return true;
}
// A*: dal punto (sx,sz) al punto (gx,gz); partenza e arrivo possono stare su una sedia (il proprio posto).
function trova(sx, sz, gx, gz) {
  const [si, sj] = cella(sx, sz);
  let [gi, gj] = cella(gx, gz);
  const eccezione = (i, j) => (i === si && j === sj) || (i === gi && j === gj);
  if (!libera(gi, gj) && !(Math.abs(gx - sx) < 0.01 && Math.abs(gz - sz) < 0.01)) {
    const pos = ROSTER.some(a => Math.hypot(a.posto[0] - gx, a.posto[1] - gz) < 0.1);
    if (!pos) { [gi, gj] = vicinaLibera(gi, gj); gx = X0 + gi * CELLA; gz = Z0 + gj * CELLA; }
  }
  const N = NX * NZ, g = new Float32Array(N).fill(Infinity), da = new Int32Array(N).fill(-1), chiuso = new Uint8Array(N);
  const s = sj * NX + si, fine = gj * NX + gi, aperti = [s];
  const h = (i, j) => { const dx = Math.abs(i - gi), dz = Math.abs(j - gj); return Math.max(dx, dz) + 0.414 * Math.min(dx, dz); };
  g[s] = 0;
  while (aperti.length) {
    let b = 0, fb = Infinity;
    for (let k = 0; k < aperti.length; k++) { const n = aperti[k], f = g[n] + h(n % NX, (n / NX) | 0); if (f < fb) { fb = f; b = k; } }
    const n = aperti[b]; aperti[b] = aperti[aperti.length - 1]; aperti.pop();
    if (n === fine) break;
    if (chiuso[n]) continue; chiuso[n] = 1;
    const i = n % NX, j = (n / NX) | 0;
    for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
      if (!di && !dj) continue;
      const ni = i + di, nj = j + dj;
      if (!(libera(ni, nj) || eccezione(ni, nj))) continue;
      if (di && dj && !(libera(i + di, j) || eccezione(i + di, j)) && !(libera(i, j + dj) || eccezione(i, j + dj))) continue;
      const m = nj * NX + ni, c = g[n] + (di && dj ? 1.414 : 1);
      if (c < g[m]) { g[m] = c; da[m] = n; aperti.push(m); }
    }
  }
  if (da[fine] < 0 && fine !== s) return [[gx, gz]];
  const celle = []; for (let n = fine; n !== -1 && n !== s; n = da[n]) celle.push([X0 + (n % NX) * CELLA, Z0 + ((n / NX) | 0) * CELLA]);
  celle.reverse(); if (celle.length) celle[celle.length - 1] = [gx, gz]; else celle.push([gx, gz]);
  // accorcia la strada quando c'è visuale libera
  const via = []; let cur = [sx, sz], k = 0;
  while (k < celle.length) {
    let far = k;
    for (let q = celle.length - 1; q > k; q--) if (vista(cur[0], cur[1], celle[q][0], celle[q][1], eccezione)) { far = q; break; }
    via.push(celle[far]); cur = celle[far]; k = far + 1;
  }
  return via;
}

// ---------- Personaggi ----------
function personaggio(spec, id, tipo) {
  const root = new THREE.Group(); root.userData.mobile = true; root.userData.tipo = tipo; root.userData.id = id; scene.add(root);
  const corpo = new THREE.Group(); root.add(corpo);
  const maglia = mat(spec.maglia), pelle = mat(spec.pelle), capelli = mat(spec.capelli), scuro = mat("#2a2f3a");
  mesh(new THREE.CapsuleGeometry(0.24, 0.3, 6, 14), maglia, 0, 0, 0, corpo);
  const testa = new THREE.Group(); testa.position.set(0, 0.5, 0); corpo.add(testa);
  mesh(sfera(0.22, 20, 16), pelle, 0, 0, 0, testa);
  mesh(new THREE.SphereGeometry(0.235, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), capelli, 0, 0.02, -0.02, testa).rotation.x = -0.25;
  if (spec.stile === 1) mesh(sfera(0.1, 12, 8), capelli, 0, 0.16, -0.2, testa);
  if (spec.stile === 2) mesh(rbox(0.36, 0.3, 0.12, 0.05), capelli, 0, -0.08, -0.17, testa);
  for (const s of [-1, 1]) mesh(sfera(0.028, 8, 6), mat("#1c2230"), s * 0.08, 0.02, 0.2, testa, false);
  const braccia = [-1, 1].map(s => { const p = new THREE.Group(); p.position.set(s * 0.29, 0.14, 0); corpo.add(p); mesh(new THREE.CapsuleGeometry(0.07, 0.26, 4, 8), maglia, 0, -0.17, 0, p); mesh(sfera(0.07, 8, 6), pelle, 0, -0.34, 0, p); return p; });
  const tazza = mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.11, 12), mat("#ffffff"), 0, -0.42, 0.05, braccia[1], false); tazza.visible = false;
  const gambe = [-1, 1].map(s => { const p = new THREE.Group(); p.position.set(s * 0.12, -0.3, 0); corpo.add(p); mesh(new THREE.CapsuleGeometry(0.085, 0.3, 4, 8), scuro, 0, -0.2, 0, p); return p; });
  const posa = { by: 0.82, brx: 0, hrx: 0, hry: 0, a0x: -0.25, a0z: 0, a1x: -0.25, a1z: 0, l0x: -Math.PI / 2, l1x: -Math.PI / 2 };
  return { root, corpo, testa, braccia, gambe, tazza, posa, yaw: 0, fase: Math.random() * 10 };
}
// Porta il modello verso la posa voluta, senza scatti.
function applicaPosa(m, t, dt) {
  const f = smorza(dt, 13), p = m.posa;
  for (const k in t) p[k] += (t[k] - p[k]) * f;
  m.corpo.position.y = p.by; m.corpo.rotation.x = p.brx;
  m.testa.rotation.x = p.hrx; m.testa.rotation.y = p.hry;
  m.braccia[0].rotation.x = p.a0x; m.braccia[0].rotation.z = p.a0z;
  m.braccia[1].rotation.x = p.a1x; m.braccia[1].rotation.z = p.a1z;
  m.gambe[0].rotation.x = p.l0x; m.gambe[1].rotation.x = p.l1x;
}
function posaBase(stato, fase, extra) {
  const t = { by: 0.82, brx: 0, hrx: -0.05, hry: 0, a0x: -0.25, a0z: 0, a1x: -0.25, a1z: 0, l0x: -Math.PI / 2, l1x: -Math.PI / 2 };
  if (stato === "cammina" || stato === "fermo") {
    const sw = stato === "cammina" ? Math.sin(fase) * 0.6 : 0;
    Object.assign(t, { by: 0.8 + (stato === "cammina" ? Math.abs(Math.sin(fase)) * 0.045 : 0), hrx: 0, l0x: sw, l1x: -sw, a0x: -sw * 0.7, a1x: sw * 0.7 });
  } else if (stato === "lavora") {
    const k = ridotto ? 0 : Math.sin(fase * 1.6);
    Object.assign(t, { a0x: -1.15 + k * 0.08, a1x: -1.15 - k * 0.08, hrx: 0.08 + (ridotto ? 0 : Math.sin(fase * 0.25) * 0.04) });
  } else if (stato === "dorme") {
    Object.assign(t, { a0x: -0.9, a1x: -0.9, hrx: 0.5, brx: 0.18, by: 0.8 + (ridotto ? 0 : Math.sin(fase * 0.18) * 0.01) });
  } else {
    t.hry = ridotto ? 0 : Math.sin(fase * 0.06) * 0.5;
  }
  if (extra === "tazza") { t.a1x = -1.0; }
  return t;
}
function posaEmote(t, emote, fase) {
  const w = ridotto ? 0 : 1;
  if (emote === "saluta") Object.assign(t, { a1x: -2.8, a1z: -0.25 + Math.sin(fase * 1.4) * 0.45 * w, hrx: -0.1 });
  else if (emote === "balla") Object.assign(t, { a0x: -2.5 + Math.sin(fase * 1.2) * 0.5 * w, a1x: -2.5 - Math.sin(fase * 1.2) * 0.5 * w, a0z: 0.3, a1z: -0.3, hry: Math.sin(fase * 0.6) * 0.35 * w, by: t.by + Math.abs(Math.sin(fase * 1.2)) * 0.1 * w });
  else if (emote === "applaudi") Object.assign(t, { a0x: -1.35, a1x: -1.35, a0z: -0.45 - Math.sin(fase * 2.4) * 0.22 * w, a1z: 0.45 + Math.sin(fase * 2.4) * 0.22 * w, hrx: -0.08 });
  else if (emote === "inchino") Object.assign(t, { brx: 0.35, hrx: 0.2 });
  return t;
}

// Etichette HTML che seguono i personaggi (testi sempre come textContent)
const v3 = new THREE.Vector3(), schermoDim = { w: 1, h: 1 };
class Etichetta {
  constructor(classe, nome) {
    this.el = document.createElement("div"); this.el.className = "tag " + classe;
    this.fum = document.createElement("div"); this.fum.className = "fumetto"; this.fum.hidden = true;
    this.zzz = document.createElement("div"); this.zzz.className = "zzz"; this.zzz.textContent = "z z z"; this.zzz.hidden = true;
    this.el.append(this.fum, this.zzz);
    if (nome) { this.nome = document.createElement("div"); this.nome.className = "nome"; this.nome.textContent = nome; this.el.append(this.nome); }
    $("#etichette").append(this.el); this.tr = ""; this.vis = true; this.t = ""; this.cls = "";
  }
  dici(t, cls = "") {
    if (t !== this.t) { this.fum.textContent = t; this.fum.hidden = !t; this.t = t; }
    if (cls !== this.cls) { this.fum.className = "fumetto" + (cls ? " " + cls : ""); this.cls = cls; }
  }
  dorme(s) { if (this.zzz.hidden === s) this.zzz.hidden = !s; }
  posiziona(x, y, z) {
    v3.set(x, y, z).project(camera);
    const vis = v3.z < 1 && Math.abs(v3.x) < 1.2 && Math.abs(v3.y) < 1.2;
    if (vis !== this.vis) { this.el.style.visibility = vis ? "" : "hidden"; this.vis = vis; }
    if (!vis) return;
    const tr = `translate3d(${Math.round((v3.x * 0.5 + 0.5) * schermoDim.w)}px,${Math.round((-v3.y * 0.5 + 0.5) * schermoDim.h)}px,0) translate(-50%,-100%)`;
    if (tr !== this.tr) { this.el.style.transform = tr; this.tr = tr; }
  }
  via() { this.el.remove(); }
}

// Camminatore: segue una strada di punti, accelera e frena con dolcezza.
function cammina(c, dt) {
  if (!c.strada || !c.strada.length) return false;
  const [tx, tz] = c.strada[0], dx = tx - c.x, dz = tz - c.z, d = Math.hypot(dx, dz);
  const ultimo = c.strada.length === 1;
  c.v = Math.min(2.3, c.v + dt * 5, ultimo ? d * 3 + 0.35 : 9);
  const passo = c.v * dt;
  if (d <= passo || d < 0.02) {
    c.x = tx; c.z = tz; c.strada.shift();
    if (!c.strada.length) { c.v = 0; return true; }
    return false;
  }
  c.x += dx / d * passo; c.z += dz / d * passo; c.dir = Math.atan2(dx, dz);
  return false;
}

