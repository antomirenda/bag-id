(function () {
  "use strict";

  const config = window.CONFIG || {};
  const loginForm = document.querySelector("#admin-login");
  const codeInput = document.querySelector("#admin-code");
  const statusNode = document.querySelector("#admin-status");
  const dashboard = document.querySelector("#admin-dashboard");
  const reportList = document.querySelector("#report-list");
  const refreshButton = document.querySelector("#refresh-button");
  const totalCount = document.querySelector("#total-count");
  const newCount = document.querySelector("#new-count");
  const resolvedCount = document.querySelector("#resolved-count");

  let adminCode = "";
  let reports = [];

  function isPlaceholder(value) {
    return !value || /^INSERIRE_/i.test(String(value).trim());
  }

  function setStatus(message, type) {
    statusNode.textContent = message;
    statusNode.className = type ? `form-status ${type}` : "form-status";
  }

  function formatDate(value) {
    if (!value) {
      return "Data non disponibile";
    }

    return new Intl.DateTimeFormat("it-IT", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(value));
  }

  function labelForPlace(value) {
    return {
      airport: "Aeroporto",
      station: "Stazione",
      hotel: "Hotel",
      transport: "Treno, bus o taxi",
      city: "Città o strada",
      other: "Altro"
    }[value] || value || "Non indicato";
  }

  function labelForMethod(value) {
    return {
      email: "Email",
      phone: "Telefono",
      whatsapp: "WhatsApp"
    }[value] || value || "Contatto";
  }

  function labelForStatus(value) {
    return {
      new: "Nuova",
      seen: "Vista",
      resolved: "Risolta"
    }[value] || "Nuova";
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  async function adminRequest(action, extra) {
    if (isPlaceholder(config.formEndpoint)) {
      throw new Error("Il servizio di segnalazione non è ancora collegato.");
    }

    const payload = new URLSearchParams({
      action,
      admin_code: adminCode,
      ...(extra || {})
    });

    const response = await fetch(config.formEndpoint, {
      method: "POST",
      body: payload
    });
    const data = await response.json().catch(function () {
      return {};
    });

    if (!response.ok || !data.ok) {
      throw new Error(data.error === "unauthorized" ? "Codice privato non corretto." : "Non riesco a leggere le segnalazioni.");
    }

    return data;
  }

  function updateStats() {
    totalCount.textContent = String(reports.length);
    newCount.textContent = String(reports.filter(function (report) {
      return report.status === "new";
    }).length);
    resolvedCount.textContent = String(reports.filter(function (report) {
      return report.status === "resolved";
    }).length);
  }

  function renderReports() {
    updateStats();

    if (!reports.length) {
      reportList.innerHTML = '<article class="empty-state">Nessuna segnalazione ricevuta.</article>';
      return;
    }

    reportList.innerHTML = reports.map(function (report) {
      const maps = report.mapsLink
        ? `<a class="maps-preview admin-map-link" href="${escapeHtml(report.mapsLink)}" target="_blank" rel="noopener">Apri posizione su Google Maps</a>`
        : '<span class="muted-line">Posizione GPS non condivisa.</span>';

      return `
        <article class="report-card" data-report-id="${escapeHtml(report.id)}">
          <div class="report-head">
            <div>
              <p class="eyebrow">${escapeHtml(labelForPlace(report.placeType))}</p>
              <h2>${escapeHtml(report.foundLocation)}</h2>
              <time>${escapeHtml(formatDate(report.createdAt))}</time>
            </div>
            <span class="status-badge status-${escapeHtml(report.status || "new")}">${escapeHtml(labelForStatus(report.status))}</span>
          </div>
          <p class="report-message">${escapeHtml(report.message)}</p>
          <dl class="report-details">
            <div>
              <dt>Persona</dt>
              <dd>${escapeHtml(report.finderName)}</dd>
            </div>
            <div>
              <dt>Metodo</dt>
              <dd>${escapeHtml(labelForMethod(report.contactMethod))}</dd>
            </div>
            <div>
              <dt>Contatto</dt>
              <dd>${escapeHtml(report.finderContact)}</dd>
            </div>
            <div>
              <dt>Lingua</dt>
              <dd>${escapeHtml((report.language || "it").toUpperCase())}</dd>
            </div>
          </dl>
          <div class="report-actions">
            ${maps}
            <label>
              Stato
              <select data-status-select="${escapeHtml(report.id)}">
                <option value="new"${report.status === "new" ? " selected" : ""}>Nuova</option>
                <option value="seen"${report.status === "seen" ? " selected" : ""}>Vista</option>
                <option value="resolved"${report.status === "resolved" ? " selected" : ""}>Risolta</option>
              </select>
            </label>
          </div>
        </article>
      `;
    }).join("");
  }

  async function loadReports() {
    setStatus("Caricamento segnalazioni...", "");
    refreshButton.disabled = true;

    try {
      const data = await adminRequest("list");
      reports = Array.isArray(data.reports) ? data.reports : [];
      dashboard.classList.remove("is-hidden");
      renderReports();
      setStatus("Archivio aggiornato.", "is-success");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Errore imprevisto.", "is-error");
    } finally {
      refreshButton.disabled = false;
    }
  }

  async function updateReportStatus(id, status) {
    await adminRequest("update-status", { id, status });
    reports = reports.map(function (report) {
      return report.id === id ? { ...report, status } : report;
    });
    renderReports();
    setStatus("Stato aggiornato.", "is-success");
  }

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    adminCode = codeInput.value.trim();
    if (!adminCode) {
      setStatus("Inserisci il codice privato.", "is-error");
      return;
    }
    loadReports();
  });

  refreshButton.addEventListener("click", loadReports);

  reportList.addEventListener("change", function (event) {
    const target = event.target;
    if (!target || !target.matches("[data-status-select]")) {
      return;
    }

    updateReportStatus(target.getAttribute("data-status-select"), target.value).catch(function () {
      setStatus("Non riesco ad aggiornare lo stato.", "is-error");
    });
  });
}());
