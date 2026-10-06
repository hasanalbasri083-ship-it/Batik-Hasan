/**
 * WASTRA — penerima pesanan batik.
 * Pasang di Spreadsheet: Extensions > Apps Script, tempel kode ini.
 * Deploy > New deployment > Web app
 *   Execute as: Me | Who has access: Anyone
 * Salin URL berakhiran /exec ke app.js (WEB_APP_URL).
 */
const SHEET_NAME = "Pembeli";
const HEADERS = [
  "Waktu", "ID Pesanan", "Nama", "No. WhatsApp", "Email", "Alamat",
  "Kode Produk", "Produk", "Ukuran", "Warna", "Jumlah", "Harga Satuan", "Total", "Catatan", "Status"
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight("bold").setBackground("#16264a").setFontColor("#f1e6cc");
    sh.setFrozenRows(1);
  }
  return sh;
}

// Mencegah rumus/injeksi saat sel diawali = + - @
function clean_(v) {
  let s = String(v == null ? "" : v).trim().slice(0, 500);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const d = JSON.parse(e.postData.contents);
    const jumlah = Math.max(1, Math.min(20, Number(d.jumlah) || 1));
    const harga = Number(d.hargaSatuan) || 0;
    const sh = getSheet_();
    sh.appendRow([
      new Date(),
      clean_(d.idPesanan),
      clean_(d.nama),
      "'" + clean_(d.hp),           // tanda ' menjaga angka 0 di depan
      clean_(d.email),
      clean_(d.alamat),
      clean_(d.kodeProduk),
      clean_(d.produk),
      clean_(d.ukuran),
      clean_(d.warna),
      jumlah,
      harga,
      jumlah * harga,               // total dihitung ulang di server
      clean_(d.catatan),
      "Baru"
    ]);
    const last = sh.getLastRow();
    sh.getRange(last, 1).setNumberFormat("dd/MM/yyyy HH:mm");
    sh.getRange(last, 12, 1, 2).setNumberFormat("#,##0");
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function doGet() {
  return json_({ ok: true, pesan: "Web App WASTRA aktif" });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
