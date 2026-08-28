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
  const enableNotificationsButton = document.querySelector("#enable-notifications-button");
  const liveRefreshStatus = document.querySelector("#live-refresh-status");

  let adminCode = "";
  let reports = [];
  let refreshTimer = 0;
  const refreshIntervalMs = 30000;

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
      whatsapp: "WhatsApp",
      deleted: "Eliminato"
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

  function readCoordinate(value, min, max) {
    const coordinate = Number(value);
    return Number.isFinite(coordinate) && coordinate >= min && coordinate <= max
      ? coordinate.toFixed(6)
      : "";
  }

  function reportCoordinates(report) {
    const latitude = readCoordinate(report.latitude, -90, 90);
    const longitude = readCoordinate(report.longitude, -180, 180);
    return latitude && longitude ? { latitude, longitude } : null;
  }

  function reportMapsLink(report) {
    const coordinates = reportCoordinates(report);
    if (coordinates) {
      return `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`;
    }

    return "";
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

  function pushEndpoint() {
    if (config.pushEndpoint) {
      return config.pushEndpoint;
    }

    return String(config.formEndpoint || "").replace(/\/api\/reports\/?$/, "/api/push");
  }

  function supportsPushNotifications() {
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  }

  function urlBase64ToUint8Array(value) {
    const padding = "=".repeat((4 - value.length % 4) % 4);
    const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const output = new Uint8Array(rawData.length);

    for (let index = 0; index < rawData.length; index += 1) {
      output[index] = rawData.charCodeAt(index);
    }

    return output;
  }

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("sw.js", { scope: "./" });
    await navigator.serviceWorker.ready;
    return registration;
  }

  async function pushRequest(action, extra) {
    const endpoint = pushEndpoint();

    if (isPlaceholder(endpoint)) {
      throw new Error("Le notifiche non sono ancora collegate.");
    }

    const payload = new URLSearchParams({
      action,
      admin_code: adminCode,
      ...(extra || {})
    });

    const response = await fetch(endpoint, {
      method: "POST",
      body: payload
    });
    const data = await response.json().catch(function () {
      return {};
    });

    if (!response.ok || !data.ok) {
      throw new Error(data.error === "unauthorized" ? "Codice privato non corretto." : "Non riesco ad attivare le notifiche.");
    }

    return data;
  }

  async function enablePushNotifications() {
    if (!adminCode) {
      setStatus("Apri prima il pannello con il codice privato.", "is-error");
      return;
    }

    if (!supportsPushNotifications()) {
      setStatus("Questo browser non supporta le notifiche push per questa app.", "is-error");
      return;
    }

    if (!config.pushPublicKey) {
      setStatus("La chiave pubblica per le notifiche non è configurata.", "is-error");
      return;
    }

    enableNotificationsButton.disabled = true;
    setStatus("Attivazione notifiche...", "");

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Permesso notifiche negato.");
      }

      const registration = await registerServiceWorker();
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(config.pushPublicKey)
        });
      }

      await pushRequest("subscribe", {
        subscription: JSON.stringify(subscription)
      });

      await registration.showNotification("Notifiche Bag ID attive", {
        body: "Riceverai un avviso quando arriva una nuova segnalazione.",
        tag: "bag-id-ready",
        data: {
          url: new URL("admin.html", window.location.href).href
        }
      });

      enableNotificationsButton.textContent = "NOTIFICHE ATTIVE";
      setStatus("Notifiche attive su questo dispositivo.", "is-success");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Non riesco ad attivare le notifiche.", "is-error");
      enableNotificationsButton.disabled = false;
    }
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
      const coordinates = reportCoordinates(report);
      const mapsLink = reportMapsLink(report);
      const maps = mapsLink
        ? `<a class="maps-preview admin-map-link" href="${escapeHtml(mapsLink)}" target="_blank" rel="noopener">Apri posizione su Google Maps</a>`
        : '<span class="muted-line">Posizione GPS non condivisa o già eliminata.</span>';
      const mapPanel = coordinates
        ? `<section class="report-location-panel" aria-label="Dove si trova">
            <div class="report-location-copy">
              <span>DOV'È</span>
              <strong>${escapeHtml(report.foundLocation)}</strong>
            </div>
            <iframe title="Mappa del ritrovamento" src="${escapeHtml(`https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}&z=16&output=embed`)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </section>`
        : "";

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
          <section class="report-message-box" aria-label="Messaggio ricevuto">
            <span>MESSAGGIO RICEVUTO</span>
            <p>${escapeHtml(report.message || "Nessun messaggio scritto.")}</p>
          </section>
          ${mapPanel}
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

  function startAutoRefresh() {
    window.clearInterval(refreshTimer);
    refreshTimer = window.setInterval(function () {
      if (adminCode) {
        loadReports({ quiet: true });
      }
    }, refreshIntervalMs);

    if (liveRefreshStatus) {
      liveRefreshStatus.textContent = "Aggiornamento automatico ogni 30 secondi.";
    }
  }

  async function loadReports(options) {
    const quiet = options && options.quiet;

    if (!quiet) {
      setStatus("Caricamento segnalazioni...", "");
    }

    refreshButton.disabled = true;

    try {
      const data = await adminRequest("list");
      reports = Array.isArray(data.reports) ? data.reports : [];
      dashboard.classList.remove("is-hidden");
      renderReports();
      startAutoRefresh();

      if (!quiet) {
        setStatus("Archivio aggiornato.", "is-success");
      } else if (liveRefreshStatus) {
        liveRefreshStatus.textContent = `Aggiornato alle ${new Intl.DateTimeFormat("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }).format(new Date())}.`;
      }
    } catch (error) {
      if (!quiet) {
        setStatus(error instanceof Error ? error.message : "Errore imprevisto.", "is-error");
      }
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

  if (enableNotificationsButton) {
    enableNotificationsButton.addEventListener("click", enablePushNotifications);
  }

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
