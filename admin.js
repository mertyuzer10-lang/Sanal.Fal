/* =========================================================
   Sanal Fal — Yönetim paneli
   DİKKAT: Şifre istemci tarafında tutulur; gerçek bir üründe
   sunucu tarafında doğrulamalısınız. Demo amaçlıdır.
   ========================================================= */
(() => {
  "use strict";

  // >>> YÖNETİCİ ŞİFRESİ — burayı değiştir <<<
  const ADMIN_PASSWORD = "sanalfal2024";

  const STORE_KEY = "sanalfal_participants";
  const SESSION_KEY = "sanalfal_admin_session";
  const RESULT_KEY = "sanalfal_result";

  const $ = (id) => document.getElementById(id);
  const COLS = ["ad","yas","hobi","mevsim","aksam","renk","ask","tatil","aranan","mutlu","gelecek","tarih"];

  function show(id){ ["lock","panel"].forEach(s => $("screen-"+s).classList.toggle("active", s===id)); }

  function login(){
    const v = $("pwInput").value;
    if(v === ADMIN_PASSWORD){
      sessionStorage.setItem(SESSION_KEY, "1");
      show("panel");
      renderTable();
    } else {
      $("pwHint").hidden = false;
      $("pwInput").value="";
      $("pwInput").focus();
    }
  }

  function getData(){
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); }
    catch { return []; }
  }

  function esc(s){ return String(s).replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c])); }

  function renderTable(){
    const data = getData();
    $("countChip").textContent = data.length + " kişi";
    const tb = $("tbody");
    if(!data.length){
      tb.innerHTML = `<tr><td colspan="13" class="no-data">Henüz katılımcı yok. 💜</td></tr>`;
      return;
    }
    tb.innerHTML = data.map((d,i) =>
      "<tr><td>"+(i+1)+"</td>" +
      COLS.map(c => "<td>"+esc(d[c] ?? "-")+"</td>").join("") +
      "</tr>"
    ).join("");
  }

  function exportCSV(){
    const data = getData();
    if(!data.length){ alert("Dışa aktarılacak katılımcı yok."); return; }
    const header = ["#","Ad","Yaş","Hobi","Mevsim","İdeal Akşam","Renk","Aşk","Tatil","Aradığı","Mutluluk","Gelecek","Tarih"];
    const rows = data.map((d,i) => [i+1, ...COLS.map(c => d[c] ?? "-")]);
    const csv = [header, ...rows]
      .map(r => r.map(v => {
        const s = String(v).replace(/"/g,'""');
        return /[",;\n]/.test(s) ? '"'+s+'"' : s;
      }).join(";"))
      .join("\r\n");
    const blob = new Blob(["\uFEFF"+csv], {type:"text/csv;charset=utf-8;"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sanalfal-katilimcilar.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function clearAll(){
    if(!confirm("TÜM katılımcı kayıtları silinecek. Emin misin?")) return;
    localStorage.removeItem(STORE_KEY);
    renderTable();
  }

  /* ----- Sekmeler ----- */
  function switchTab(name){
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab===name));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.toggle("active", p.id==="tab-"+name));
    if(name==="sonuc") loadResult();
  }

  /* ----- Fal Sonucu yönetimi ----- */
  function getResult(){ try { return JSON.parse(localStorage.getItem(RESULT_KEY) || "null"); } catch { return null; } }

  function loadResult(){
    const r = getResult();
    $("resPerson").value = (r && r.person) ? r.person : "";
    $("resWants").value = (r && r.wants) ? r.wants : "";
    for(let i=1;i<=5;i++){ $("resNote"+i).value = (r && Array.isArray(r.notes)) ? (r.notes[i-1]||"") : ""; }
    resStatus("", false);
  }

  function collectFromFields(){
    const person = $("resPerson").value.trim();
    const wants = $("resWants").value.trim();
    const notes = [];
    for(let i=1;i<=5;i++){ const v = $("resNote"+i).value.trim(); if(v) notes.push(v); }
    return { person, wants, notes };
  }

  function saveResult(){
    const { person, wants, notes } = collectFromFields();
    if(!person && !wants && !notes.length){
      localStorage.removeItem(RESULT_KEY);
      resStatus("Tüm alanlar boş — varsayılan fal sonucu kullanılacak.", true);
      return;
    }
    localStorage.setItem(RESULT_KEY, JSON.stringify({ person, wants, notes }));
    resStatus("Fal sonucu kaydedildi ✓ Kullanıcılar bir sonraki fal açışında yeni sonucu görür.", false);
  }

  function resetResult(){
    if(!confirm("Fal sonucu varsayılana döndürülecek. Emin misin?")) return;
    localStorage.removeItem(RESULT_KEY);
    loadResult();
    resStatus("Fal sonucu varsayılana döndü. Şablon sonuçlar kullanılacak.", true);
  }

  /* result.json indir → proje klasörüne koy → GitHub'a yükle = kalıcı */
  function exportResultFile(){
    const saved = getResult();
    const { person, wants, notes } = (saved && (saved.person || saved.wants || (saved.notes && saved.notes.length)))
      ? { person: saved.person||"", wants: saved.wants||"", notes: saved.notes||[] }
      : collectFromFields();
    if(!person && !wants && !notes.length){
      alert("Önce fal sonucunu yaz ve Kaydet, sonra bu dosyayı indir.");
      return;
    }
    const obj = { person, wants, notes };
    const json = JSON.stringify(obj, null, 2);
    const blob = new Blob([json], {type:"application/json;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "result.json";
    a.click();
    URL.revokeObjectURL(a.href);
    alert(
      "result.json indirildi ✅\n\n" +
      "Şimdi:\n" +
      "1) İnen dosyayı proje klasörüne koy (result.json varsa üstüne yaz).\n" +
      "2) Tüm dosyaları GitHub'a yükle.\n" +
      "Bundan sonra yazdığın sonuç herkese kalıcı görünür."
    );
  }

  function resStatus(msg, warn){
    const el = $("resStatus");
    if(!msg){ el.hidden=true; el.textContent=""; return; }
    el.hidden=false;
    el.textContent = msg;
    el.style.color = warn ? "var(--rose)" : "#2e8b6f";
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("btnLogin").addEventListener("click", login);
    $("pwInput").addEventListener("keydown", e => { if(e.key==="Enter") login(); });
    $("btnExport").addEventListener("click", exportCSV);
    $("btnClear").addEventListener("click", clearAll);

    // Sekmeler
    document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => switchTab(t.dataset.tab)));
    // Fal sonucu
    $("btnSaveResult").addEventListener("click", saveResult);
    $("btnResetResult").addEventListener("click", resetResult);
    $("btnExportResult").addEventListener("click", exportResultFile);

    if(sessionStorage.getItem(SESSION_KEY) === "1"){
      show("panel"); renderTable();
    } else {
      show("lock");
    }
  });
})();
