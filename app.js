/* ============ PENGATURAN ============ */
// Tempel URL Web App dari Apps Script (Deploy > New deployment > Web app), berakhiran /exec
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwqSR2msHSnmkneLY5JeLVAyCD-CqCBKL6u9h-CH6vUd97HHnVta0V0Gg1nlMuycbqe/exec";

const SIZES = ["S", "M", "L", "XL"];
const PALETTES = {
  Indigo: ["#16264a", "#d9b25f"],
  Soga: ["#6b3a1a", "#f1d9a0"],
  Hijau: ["#1f4a3d", "#e6c97a"],
  Krem: ["#eadcbc", "#6b3a1a"],
  Merah: ["#7a1f2b", "#f0d9a8"]
};
const PRODUCTS = [
  { id: "BTK-01", name: "Kawung Sultan", type: "Kemeja lengan panjang", price: 349000, motif: "kawung", colors: ["Indigo", "Soga", "Hijau"] },
  { id: "BTK-02", name: "Parang Rusak", type: "Kemeja lengan pendek", price: 289000, motif: "parang", colors: ["Soga", "Indigo"] },
  { id: "BTK-03", name: "Mega Mendung", type: "Kemeja lengan panjang", price: 329000, motif: "mega", colors: ["Indigo", "Merah"] },
  { id: "BTK-04", name: "Sido Mukti", type: "Kemeja lengan pendek", price: 275000, motif: "kawung", colors: ["Krem", "Soga"] },
  { id: "BTK-05", name: "Truntum Emas", type: "Kemeja lengan panjang", price: 359000, motif: "parang", colors: ["Hijau", "Indigo"] },
  { id: "BTK-06", name: "Sekar Jagad", type: "Kemeja lengan pendek", price: 265000, motif: "mega", colors: ["Merah", "Krem"] },
  { id: "BTK-07", name: "Lereng Gunung", type: "Kemeja lengan panjang", price: 315000, motif: "parang", colors: ["Indigo", "Hijau"] }
];
const HERO = PRODUCTS[0];

/* ============ UTIL ============ */
const $ = (s, r = document) => r.querySelector(s);
const rp = n => "Rp " + Number(n).toLocaleString("id-ID");
const uri = svg => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
const root = document.documentElement.style;
root.setProperty("--kawung", uri(`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="none" stroke="#d9b25f" stroke-width="1.4"><ellipse cx="30" cy="15" rx="7" ry="13"/><ellipse cx="30" cy="45" rx="7" ry="13"/><ellipse cx="15" cy="30" rx="13" ry="7"/><ellipse cx="45" cy="30" rx="13" ry="7"/><circle cx="30" cy="30" r="2.5" fill="#d9b25f"/></svg>`));
root.setProperty("--parang", uri(`<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="none" stroke="#d9b25f" stroke-width="2"><path d="M0 70Q17 52 35 52T70 35M0 35Q17 17 35 17T70 0M-35 70Q-17 52 0 52M70 70Q87 52 105 52"/></svg>`));

/* ============ ILUSTRASI KEMEJA BATIK ============ */
let uid = 0;
function motifTile(motif, c2) {
  if (motif === "parang")
    return `<path d="M0 28Q7 20 14 20T28 12M0 14Q7 6 14 6T28 -2M0 42Q7 34 14 34T28 26" fill="none" stroke="${c2}" stroke-width="1.8"/>`;
  if (motif === "mega")
    return `<path d="M4 20a6 6 0 0 1 12 0a8 8 0 0 1 12 2M2 12a8 8 0 0 1 14-4a6 6 0 0 1 10 2" fill="none" stroke="${c2}" stroke-width="1.6"/>`;
  return `<g fill="none" stroke="${c2}" stroke-width="1.4"><ellipse cx="14" cy="7" rx="4" ry="6.5"/><ellipse cx="14" cy="21" rx="4" ry="6.5"/><ellipse cx="7" cy="14" rx="6.5" ry="4"/><ellipse cx="21" cy="14" rx="6.5" ry="4"/></g><circle cx="14" cy="14" r="1.6" fill="${c2}"/>`;
}
function shirt(motif, colorName) {
  const [c1, c2] = PALETTES[colorName] || PALETTES.Indigo;
  const id = "p" + ++uid;
  return `<svg viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kemeja batik ${motif} ${colorName}">
  <defs><pattern id="${id}" width="28" height="28" patternUnits="userSpaceOnUse">${motifTile(motif, c2)}</pattern>
  <linearGradient id="${id}s" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".25"/><stop offset=".5" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient></defs>
  <path id="${id}b" d="M105 24L60 40 8 120 44 150 70 118V320H230V118L256 150 292 120 240 40 195 24 150 62Z" fill="${c1}"/>
  <path d="M105 24L60 40 8 120 44 150 70 118V320H230V118L256 150 292 120 240 40 195 24 150 62Z" fill="url(#${id})"/>
  <path d="M105 24L60 40 8 120 44 150 70 118V320H230V118L256 150 292 120 240 40 195 24 150 62Z" fill="url(#${id}s)"/>
  <path d="M105 24L150 62 195 24 180 20 150 44 120 20Z" fill="${c2}" opacity=".9"/>
  <path d="M150 62V320" stroke="${c2}" stroke-width="2" opacity=".8"/>
  ${[100, 150, 200, 250].map(y => `<circle cx="150" cy="${y}" r="3.2" fill="${c2}"/>`).join("")}
  <path d="M70 118V320M230 118V320" stroke="#000" stroke-opacity=".18"/></svg>`;
}

/* ============ RENDER ============ */
let activeFilter = "Semua";
const grid = $("#grid");
function renderFilters() {
  const f = ["Semua", "Lengan panjang", "Lengan pendek"];
  $("#filters").innerHTML = f.map(x => `<button class="chip ${x === activeFilter ? "on" : ""}" data-f="${x}">${x}</button>`).join("");
}
function renderGrid() {
  const list = PRODUCTS.filter(p => activeFilter === "Semua" || p.type.toLowerCase().includes(activeFilter.toLowerCase().replace("lengan ", "lengan ")));
  let html = "";
  list.forEach((p, i) => {
    if (i === 1 && activeFilter === "Semua") {
      html += `<article class="feature reveal" style="--d:.05s"><div><p>Pilihan pengrajin</p><h3 class="display">Truntum<br>Emas</h3></div><div><p>Motif bintang kecil yang melambangkan cinta yang tumbuh setiap hari.</p><br><button class="pill" data-buy="BTK-05">Pesan Rp 359.000</button></div></article>`;
    }
    html += `<article class="card reveal" style="--d:${(i % 4) * 0.08}s" data-buy="${p.id}" tabindex="0" role="button" aria-label="Pesan ${p.name}">
      <div class="img">${shirt(p.motif, p.colors[0])}</div><h3 class="display">${p.name}</h3><p>${p.type}</p>
      <div class="row"><span>${rp(p.price)}</span><span class="dots">${p.colors.map(c => `<i style="background:${PALETTES[c][0]}" title="${c}"></i>`).join("")}</span></div></article>`;
  });
  grid.innerHTML = html;
  observe();
}
$("#filters").addEventListener("click", e => {
  const b = e.target.closest("[data-f]"); if (!b) return;
  activeFilter = b.dataset.f; renderFilters(); renderGrid();
});

/* hero */
let heroSize = "M", heroColor = HERO.colors[0];
function renderHero() {
  $("#heroSize").innerHTML = SIZES.map(s => `<button class="chip ${s === heroSize ? "on" : ""}" data-s="${s}">${s}</button>`).join(" ");
  $("#heroColor").innerHTML = HERO.colors.map(c => `<button class="chip ${c === heroColor ? "on" : ""}" data-c="${c}">${c}</button>`).join(" ");
  $("#heroShirt").innerHTML = shirt(HERO.motif, heroColor);
  $("#heroPrice").textContent = rp(HERO.price);
}
$("#heroSize").addEventListener("click", e => { const b = e.target.closest("[data-s]"); if (b) { heroSize = b.dataset.s; renderHero(); } });
$("#heroColor").addEventListener("click", e => { const b = e.target.closest("[data-c]"); if (b) { heroColor = b.dataset.c; renderHero(); } });
$("#heroBuy").addEventListener("click", () => openModal(HERO.id, heroSize, heroColor));
$("#navBuy").addEventListener("click", () => openModal(HERO.id, heroSize, heroColor));

/* scroll reveal */
let io;
function observe() {
  if (!("IntersectionObserver" in window)) { document.querySelectorAll(".reveal").forEach(el => el.classList.add("in")); return; }
  io = io || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el));
}

/* ============ MODAL & FORM ============ */
const modal = $("#modal"), sheet = $("#sheet"), form = $("#form");
const fProd = $("#fProd"), fSize = $("#fSize"), fColor = $("#fColor"), fQty = $("#fQty");
let lastFocus = null;
fProd.innerHTML = PRODUCTS.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
fSize.innerHTML = SIZES.map(s => `<option>${s}</option>`).join("");
const prod = () => PRODUCTS.find(p => p.id === fProd.value);

function refresh(keepColor) {
  const p = prod();
  const cur = keepColor || fColor.value;
  fColor.innerHTML = p.colors.map(c => `<option>${c}</option>`).join("");
  fColor.value = p.colors.includes(cur) ? cur : p.colors[0];
  $("#mTitle").textContent = p.name; $("#mType").textContent = p.type;
  $("#mArt").innerHTML = shirt(p.motif, fColor.value);
  updateTotal();
}
function updateTotal() {
  const q = Math.min(20, Math.max(1, parseInt(fQty.value) || 1));
  $("#fTotal").textContent = rp(prod().price * q);
}
fProd.addEventListener("change", () => refresh());
fColor.addEventListener("change", () => { $("#mArt").innerHTML = shirt(prod().motif, fColor.value); });
fQty.addEventListener("input", updateTotal);

function openModal(id, size, color) {
  lastFocus = document.activeElement;
  sheet.classList.remove("ok"); $("#err").textContent = "";
  fProd.value = id || PRODUCTS[0].id; fSize.value = size || "M";
  refresh(color);
  modal.classList.add("open"); document.body.style.overflow = "hidden";
  setTimeout(() => form.nama.focus(), 350);
}
function closeModal() {
  modal.classList.remove("open"); document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-buy]"); if (b) openModal(b.dataset.buy);
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  if ((e.key === "Enter" || e.key === " ") && e.target.matches(".card")) { e.preventDefault(); openModal(e.target.dataset.buy); }
});
$("#close").addEventListener("click", closeModal);
modal.addEventListener("mousedown", e => { if (e.target === modal) closeModal(); });
$("#again").addEventListener("click", () => { form.reset(); openModal(fProd.value); });

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3500);
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const err = $("#err"), btn = $("#send");
  const nama = form.nama.value.trim(), hp = form.hp.value.replace(/[\s-]/g, ""), alamat = form.alamat.value.trim(), email = form.email.value.trim();
  const qty = parseInt(fQty.value);
  if (nama.length < 3) return (err.textContent = "Nama minimal 3 karakter.");
  if (!/^(\+62|62|0)8[0-9]{8,12}$/.test(hp)) return (err.textContent = "Nomor WhatsApp tidak valid. Contoh: 081234567890.");
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return (err.textContent = "Format email belum benar.");
  if (alamat.length < 10) return (err.textContent = "Alamat terlalu singkat. Tulis jalan, kota, dan kode pos.");
  if (!qty || qty < 1 || qty > 20) return (err.textContent = "Jumlah harus antara 1 dan 20.");
  err.textContent = "";

  const p = prod();
  const orderId = "WST-" + Date.now().toString(36).toUpperCase().slice(-6);
  const data = {
    idPesanan: orderId, nama, hp, email, alamat,
    produk: p.name, kodeProduk: p.id, ukuran: fSize.value, warna: fColor.value,
    jumlah: qty, hargaSatuan: p.price, total: p.price * qty, catatan: form.catatan.value.trim()
  };

  if (!WEB_APP_URL || WEB_APP_URL.startsWith("PASTE")) {
    err.textContent = "URL Web App belum diisi di app.js (baris 3).";
    return;
  }
  btn.disabled = true; btn.textContent = "Mengirim…";
  try {
    // text/plain + no-cors agar tidak terblokir CORS oleh Apps Script
    await fetch(WEB_APP_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(data) });
    $("#oid").textContent = orderId;
    sheet.classList.add("ok"); form.reset();
    toast("Pesanan tersimpan");
  } catch (x) {
    err.textContent = "Gagal mengirim. Periksa koneksi internet lalu coba lagi.";
  } finally {
    btn.disabled = false; btn.textContent = "Kirim pesanan";
  }
});

/* ============ START ============ */
renderFilters(); renderHero(); renderGrid(); observe();
