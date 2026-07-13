import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const token = new URLSearchParams(location.search).get("token");
const content = document.querySelector("#content");
const status = document.querySelector("#status");

function setStatus(message, type = "") {
  status.textContent = message;
  status.className = `status ${type}`;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}

function answerText(value) {
  if (value === true) return '<span class="interested">Kiinnostunut</span>';
  if (value === false) return "Ei";
  return '<span class="muted">Ei vastausta</span>';
}

async function loadSummary() {
  if (!token) {
    content.innerHTML = '<div class="card error">Admin-linkistä puuttuu tunniste.</div>';
    return;
  }

  const { data, error } = await supabase.rpc("get_admin_summary", { p_token: token });
  if (error || !data?.items) {
    console.error(error);
    content.innerHTML = '<div class="card error">Admin-linkki ei ole voimassa tai tietoja ei voitu ladata.</div>';
    return;
  }

  content.className = "table-wrap";
  content.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Huonekalu</th>
          <th>Kalle</th>
          <th>Kallen kommentti</th>
          <th>Leila</th>
          <th>Leilan kommentti</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
          <tr>
            <td><strong>${escapeHtml(item.name)}</strong></td>
            <td>${answerText(item.kalle_interested)}</td>
            <td>${escapeHtml(item.kalle_comment || "")}</td>
            <td>${answerText(item.leila_interested)}</td>
            <td>${escapeHtml(item.leila_comment || "")}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>`;
}

document.querySelector("#print").addEventListener("click", () => window.print());
document.querySelector("#refresh").addEventListener("click", loadSummary);

document.querySelector("#clear").addEventListener("click", async () => {
  const confirmed = confirm("Haluatko varmasti poistaa kaikki Kallen ja Leilan vastaukset?");
  if (!confirmed) return;

  const secondConfirm = confirm("Poistoa ei voi perua. Tyhjennetäänkö vastaukset?");
  if (!secondConfirm) return;

  const { data, error } = await supabase.rpc("clear_all_responses", { p_token: token });
  if (error || data !== true) {
    console.error(error);
    setStatus("Vastausten tyhjentäminen epäonnistui.", "error");
    return;
  }
  setStatus("Kaikki vastaukset on tyhjennetty.", "success");
  await loadSummary();
});

loadSummary();
