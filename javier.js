"use strict";

window.DS = [];

/* =========================
   LOAD CSV (AUTO)
========================= */
async function loadCSV() {
  try {
    const res = await fetch("./dataset.csv");

    if (!res.ok) throw new Error("CSV not found");

    const text = await res.text();

    window.DS = parseCSV(text).slice(0, 5000); // limit 5000 rows

    renderTable(window.DS);
    updateCount(window.DS.length);

  } catch (err) {
    console.error(err);
    document.getElementById("rowCount").textContent =
      "❌ CSV failed. Make sure dataset.csv is in the same folder and use Live Server.";
  }
}

/* =========================
   PARSE CSV
========================= */
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map(h => h.trim());

  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");

    let obj = {};

    for (let j = 0; j < headers.length; j++) {
      let val = values[j];

      if (val !== "" && !isNaN(val)) val = Number(val);

      obj[headers[j]] = val;
    }

    data.push(obj);
  }

  return data;
}

/* =========================
   RENDER TABLE
========================= */
function renderTable(data) {
  const body = document.getElementById("tableBody");
  body.innerHTML = "";

  const fragment = document.createDocumentFragment();

  data.forEach((row, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${row.job_title}</td>
      <td>${row.experience_years}</td>
      <td>${row.education_level}</td>
      <td>${row.skills_count}</td>
      <td>${row.industry}</td>
      <td>${row.company_size}</td>
      <td>${row.location}</td>
      <td>${row.remote_work}</td>
      <td>${row.salary}</td>
    `;

    fragment.appendChild(tr);
  });

  body.appendChild(fragment);
}

/* =========================
   COUNT
========================= */
function updateCount(n) {
  document.getElementById("rowCount").textContent =
    n + " rows loaded (max 5000)";
}

/* INIT */
loadCSV();