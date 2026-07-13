import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const params = new URLSearchParams(location.search);
const token = params.get("token");

const content = document.querySelector("#content");
const title = document.querySelector("#title");
const saveArea = document.querySelector("#save-area");
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

async function loadForm() {
  if (!token) {
    content.innerHTML = '<div class="card error">Linkistä puuttuu tunniste.</div>';
    return;
  }

  const { data, error } = await supabase.rpc("get_person_form", { p_token: token });
  if (error || !data?.person_name) {
    console.error(error);
    content.innerHTML = '<div class="card error">Linkki ei ole voimassa tai tietoja ei voitu ladata.</div>';
    return;
  }

  title.textContent = `Huonekalukysely – ${data.person_name}`;
  content.className = "";
  content.innerHTML = data.items.map(item => `
    <section class="card furniture" data-id="${item.id}">
      <div class="item-title">${escapeHtml(item.name)}</div>
      ${item.description ? `<p class="muted">${escapeHtml(item.description)}</p>` : ""}
      <div class="choice-row">
        <label><input type="radio" name="interest-${item.id}" value="true"
          ${item.interested === true ? "checked" : ""}> Kiinnostunut</label>
        <label><input type="radio" name="interest-${item.id}" value="false"
          ${item.interested === false ? "checked" : ""}> En ole kiinnostunut</label>
      </div>
      <label>
        Kommentti
        <textarea maxlength="1000">${escapeHtml(item.comment || "")}</textarea>
      </label>
    </section>
  `).join("");
  saveArea.hidden = false;
}

document.querySelector("#save").addEventListener("click", async () => {
  setStatus("Tallennetaan…");
  const responses = [...document.querySelectorAll(".furniture")].map(card => {
    const selected = card.querySelector('input[type="radio"]:checked');
    return {
      furniture_id: Number(card.dataset.id),
      interested: selected ? selected.value === "true" : null,
      comment: card.querySelector("textarea").value.trim()
    };
  });

  const { data, error } = await supabase.rpc("save_person_responses", {
    p_token: token,
    p_responses: responses
  });

  if (error || data !== true) {
    console.error(error);
    setStatus("Tallennus epäonnistui. Yritä uudelleen.", "error");
    return;
  }
  setStatus("Vastaukset tallennettu.", "success");
});

loadForm();
