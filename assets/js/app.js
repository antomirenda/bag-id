(function () {
  "use strict";

  const config = window.CONFIG || {};
  const form = document.querySelector("#contact-form");
  const languageButtons = Array.from(document.querySelectorAll("[data-lang]"));
  const bagIdNodes = Array.from(document.querySelectorAll("[data-bag-id]"));
  const fields = {
    bagId: document.querySelector("#bag-id-field"),
    pageUrl: document.querySelector("#page-url-field"),
    language: document.querySelector("#language-field"),
    latitude: document.querySelector("#latitude-field"),
    longitude: document.querySelector("#longitude-field"),
    mapsLink: document.querySelector("#maps-link-field"),
    botA: document.querySelector("#bot-a-field"),
    botB: document.querySelector("#bot-b-field")
  };
  const locationButton = document.querySelector("#location-button");
  const locationStatus = document.querySelector("#location-status");
  const coordinatesPreview = document.querySelector("#coordinates-preview");
  const mapsPreview = document.querySelector("#maps-preview");
  const formStatus = document.querySelector("#form-status");
  const submitButton = document.querySelector("#submit-button");
  const successScreen = document.querySelector("#success-screen");
  const foundLocationInput = document.querySelector("#found-location");
  const addressSuggestions = document.querySelector("#address-suggestions");
  const addressSearchStatus = document.querySelector("#address-search-status");
  const foundMap = document.querySelector("#found-map");
  const foundMapFrame = document.querySelector("#found-map-frame");
  const botQuestion = document.querySelector("#bot-question");
  const botAnswer = document.querySelector("#bot-answer");

  const copy = {
    it: {
      registered: "Questa valigia è registrata al suo proprietario.",
      serviceLabel: "DIGITAL BAG RECOVERY",
      heroTitle: "HAI TROVATO QUESTA VALIGIA?",
      heroCopy: "Grazie per averla trovata. Puoi inviare un messaggio direttamente al proprietario senza visualizzare i suoi dati personali.",
      contactOwner: "CONTATTA IL PROPRIETARIO",
      secureFormLabel: "MESSAGGIO PROTETTO",
      formTitle: "SEGNALA IL RITROVAMENTO",
      formIntro: "Compila il modulo con le informazioni utili per organizzare il recupero della valigia.",
      placeTypeLabel: "Tipo di luogo",
      placeTypePlaceholder: "Scegli una categoria",
      placeAirport: "Aeroporto",
      placeStation: "Stazione",
      placeHotel: "Hotel",
      placeTransport: "Treno, bus o taxi",
      placeCity: "Città o strada",
      placeOther: "Altro",
      locationLabel: "Dove hai trovato la valigia?",
      locationPlaceholder: "Cerca via, aeroporto, stazione, hotel...",
      addressSearchHint: "Inizia a scrivere e seleziona il luogo giusto se compare.",
      addressSearching: "Ricerca del luogo...",
      addressEmpty: "Nessun suggerimento trovato. Puoi scrivere il luogo a mano.",
      addressError: "Ricerca indirizzo non disponibile. Puoi scrivere il luogo a mano.",
      addressSelected: "Luogo selezionato e posizione aggiunta.",
      messageLabel: "Messaggio",
      messagePlaceholder: "Scrivi un messaggio al proprietario...",
      finderNameLabel: "Nome di chi ha trovato la valigia",
      contactMethodLabel: "Come preferisci essere ricontattato?",
      contactMethodPlaceholder: "Scegli un metodo",
      contactEmail: "Email",
      contactPhone: "Telefono",
      contactWhatsapp: "WhatsApp",
      finderContactLabel: "Contatto di chi ha trovato la valigia",
      finderNamePlaceholder: "Il tuo nome",
      finderContactPlaceholder: "La tua email o il tuo telefono",
      finderContactHint: "Questo campo riguarda solo la persona che ha trovato la valigia.",
      shareLocationTitle: "Condividi posizione del ritrovamento",
      shareLocationText: "La posizione verrà condivisa soltanto se scegli di autorizzarla.",
      shareLocationButton: "CONDIVIDI POSIZIONE DEL RITROVAMENTO",
      openMaps: "Apri posizione su Google Maps",
      privacyConsent: "Autorizzo l'invio delle informazioni inserite esclusivamente allo scopo di contattare il proprietario della valigia.",
      antiBotLabel: "Controllo anti-bot",
      antiBotPlaceholder: "Risultato",
      antiBotHint: "Serve solo a bloccare invii automatici.",
      antiBotError: "Risultato anti-bot non corretto.",
      submitButton: "INVIA AL PROPRIETARIO",
      successTitle: "MESSAGGIO INVIATO",
      successText: "Grazie per il tuo aiuto. La tua segnalazione è stata inviata al proprietario della valigia.",
      footerText: "Questa pagina scoraggia l'indicizzazione, ma chi possiede l'URL può comunque visitarla.",
      requiredError: "Campo obbligatorio.",
      consentError: "Per inviare il messaggio serve questa autorizzazione.",
      endpointMissing: "Il servizio di segnalazione non è ancora collegato.",
      sending: "Invio in corso...",
      sendError: "Non è stato possibile inviare il messaggio. Riprova tra poco.",
      locationUnsupported: "La geolocalizzazione non è supportata da questo dispositivo.",
      locationLoading: "Richiesta posizione in corso...",
      locationSuccess: "Posizione aggiunta al messaggio.",
      coordinatesLabel: "Coordinate condivise",
      locationDenied: "Permesso negato. Puoi comunque inviare il messaggio senza posizione.",
      locationUnavailable: "Posizione non disponibile. Puoi inviare il messaggio senza posizione."
    },
    en: {
      registered: "This bag is registered to its owner.",
      serviceLabel: "DIGITAL BAG RECOVERY",
      heroTitle: "FOUND THIS BAG?",
      heroCopy: "Thank you for finding it. You can securely contact the owner without accessing their personal information.",
      contactOwner: "CONTACT THE OWNER",
      secureFormLabel: "SECURE MESSAGE",
      formTitle: "REPORT THE FIND",
      formIntro: "Send the details needed to arrange a safe recovery of the bag.",
      placeTypeLabel: "Place type",
      placeTypePlaceholder: "Choose a category",
      placeAirport: "Airport",
      placeStation: "Station",
      placeHotel: "Hotel",
      placeTransport: "Train, bus or taxi",
      placeCity: "City or street",
      placeOther: "Other",
      locationLabel: "Where did you find the bag?",
      locationPlaceholder: "Search street, airport, station, hotel...",
      addressSearchHint: "Start typing and select the right place if it appears.",
      addressSearching: "Searching place...",
      addressEmpty: "No suggestion found. You can type the place manually.",
      addressError: "Address search unavailable. You can type the place manually.",
      addressSelected: "Place selected and location added.",
      messageLabel: "Message",
      messagePlaceholder: "Write a message to the owner...",
      finderNameLabel: "Name of the person who found the bag",
      contactMethodLabel: "How would you prefer to be contacted?",
      contactMethodPlaceholder: "Choose a method",
      contactEmail: "Email",
      contactPhone: "Phone",
      contactWhatsapp: "WhatsApp",
      finderContactLabel: "Contact for the person who found the bag",
      finderNamePlaceholder: "Your name",
      finderContactPlaceholder: "Your email or phone",
      finderContactHint: "This field is only for the person who found the bag.",
      shareLocationTitle: "Share where the bag was found",
      shareLocationText: "Your location will be shared only if you choose to allow it.",
      shareLocationButton: "SHARE FOUND LOCATION",
      openMaps: "Open location in Google Maps",
      privacyConsent: "I authorize the information entered to be sent only for the purpose of contacting the bag owner.",
      antiBotLabel: "Anti-bot check",
      antiBotPlaceholder: "Result",
      antiBotHint: "This only helps block automated submissions.",
      antiBotError: "The anti-bot answer is not correct.",
      submitButton: "SEND TO OWNER",
      successTitle: "MESSAGE SENT",
      successText: "Thank you for your help. Your message has been sent to the bag owner.",
      footerText: "This page discourages indexing, but anyone with the URL can still visit it.",
      requiredError: "This field is required.",
      consentError: "This authorization is required before sending.",
      endpointMissing: "The reporting service is not connected yet.",
      sending: "Sending...",
      sendError: "The message could not be sent. Please try again shortly.",
      locationUnsupported: "Geolocation is not supported on this device.",
      locationLoading: "Requesting location...",
      locationSuccess: "Location added to the message.",
      coordinatesLabel: "Shared coordinates",
      locationDenied: "Permission denied. You can still send the message without location.",
      locationUnavailable: "Location unavailable. You can send the message without location."
    }
  };

  let currentLanguage = copy[config.defaultLanguage] ? config.defaultLanguage : "it";
  let addressSearchTimer = 0;
  let addressSearchController = null;
  let addressResults = [];
  let suppressAddressInput = false;

  function isPlaceholder(value) {
    return !value || /^INSERIRE_/i.test(String(value).trim());
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach(function (node) {
      node.textContent = value;
    });
  }

  function setLanguage(language) {
    currentLanguage = copy[language] ? language : "it";
    document.documentElement.lang = currentLanguage;

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      const key = node.getAttribute("data-i18n");
      if (copy[currentLanguage][key]) {
        node.textContent = copy[currentLanguage][key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
      const key = node.getAttribute("data-i18n-placeholder");
      if (copy[currentLanguage][key]) {
        node.setAttribute("placeholder", copy[currentLanguage][key]);
      }
    });

    languageButtons.forEach(function (button) {
      const isActive = button.getAttribute("data-lang") === currentLanguage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (fields.language) {
      fields.language.value = currentLanguage;
    }

    clearErrors();
  }

  function clearErrors() {
    document.querySelectorAll(".field-error").forEach(function (node) {
      node.textContent = "";
    });
    if (formStatus) {
      formStatus.textContent = "";
    }
  }

  function setFieldError(id, message) {
    const node = document.querySelector(`[data-error-for="${id}"]`);
    if (node) {
      node.textContent = message;
    }
  }

  function setBotChallenge() {
    const first = Math.floor(Math.random() * 7) + 2;
    const second = Math.floor(Math.random() * 7) + 2;

    if (fields.botA) {
      fields.botA.value = String(first);
    }

    if (fields.botB) {
      fields.botB.value = String(second);
    }

    if (botQuestion) {
      botQuestion.textContent = `${first} + ${second}`;
    }

    if (botAnswer) {
      botAnswer.value = "";
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function googleMapsLink(latitude, longitude) {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  function googleMapEmbed(latitude, longitude) {
    return `https://www.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`;
  }

  function clearFoundCoordinates() {
    if (fields.latitude) {
      fields.latitude.value = "";
    }

    if (fields.longitude) {
      fields.longitude.value = "";
    }

    if (fields.mapsLink) {
      fields.mapsLink.value = "";
    }

    if (mapsPreview) {
      mapsPreview.classList.add("is-hidden");
      mapsPreview.removeAttribute("href");
    }

    if (coordinatesPreview) {
      coordinatesPreview.textContent = "";
      coordinatesPreview.classList.add("is-hidden");
    }

    if (foundMap && foundMapFrame) {
      foundMap.classList.add("is-hidden");
      foundMapFrame.removeAttribute("src");
    }
  }

  function setFoundCoordinates(latitude, longitude) {
    const mapsLink = googleMapsLink(latitude, longitude);

    if (fields.latitude) {
      fields.latitude.value = latitude;
    }

    if (fields.longitude) {
      fields.longitude.value = longitude;
    }

    if (fields.mapsLink) {
      fields.mapsLink.value = mapsLink;
    }

    if (coordinatesPreview) {
      coordinatesPreview.textContent = `${copy[currentLanguage].coordinatesLabel}: ${latitude}, ${longitude}`;
      coordinatesPreview.classList.remove("is-hidden");
    }

    if (mapsPreview) {
      mapsPreview.href = mapsLink;
      mapsPreview.classList.remove("is-hidden");
    }

    if (foundMap && foundMapFrame) {
      foundMapFrame.src = googleMapEmbed(latitude, longitude);
      foundMap.classList.remove("is-hidden");
    }
  }

  function clearAddressSuggestions() {
    addressResults = [];

    if (addressSuggestions) {
      addressSuggestions.innerHTML = "";
      addressSuggestions.classList.add("is-hidden");
    }

    if (foundLocationInput) {
      foundLocationInput.setAttribute("aria-expanded", "false");
    }
  }

  function renderAddressSuggestions(results) {
    addressResults = results;

    if (!addressSuggestions || !foundLocationInput) {
      return;
    }

    if (!results.length) {
      clearAddressSuggestions();
      if (addressSearchStatus) {
        addressSearchStatus.textContent = copy[currentLanguage].addressEmpty;
      }
      return;
    }

    addressSuggestions.innerHTML = results.map(function (item, index) {
      return `
        <button type="button" role="option" data-address-index="${index}">
          <strong>${escapeHtml(item.name || item.display_name)}</strong>
          <span>${escapeHtml(item.display_name)}</span>
        </button>
      `;
    }).join("");
    addressSuggestions.classList.remove("is-hidden");
    foundLocationInput.setAttribute("aria-expanded", "true");

    if (addressSearchStatus) {
      addressSearchStatus.textContent = copy[currentLanguage].addressSearchHint;
    }
  }

  async function searchAddress(query) {
    if (!query || query.length < 3) {
      clearAddressSuggestions();
      if (addressSearchStatus) {
        addressSearchStatus.textContent = copy[currentLanguage].addressSearchHint;
      }
      return;
    }

    if (addressSearchController) {
      addressSearchController.abort();
    }

    addressSearchController = new AbortController();

    if (addressSearchStatus) {
      addressSearchStatus.textContent = copy[currentLanguage].addressSearching;
    }

    const searchUrl = new URL("https://nominatim.openstreetmap.org/search");
    searchUrl.searchParams.set("format", "jsonv2");
    searchUrl.searchParams.set("addressdetails", "1");
    searchUrl.searchParams.set("limit", "5");
    searchUrl.searchParams.set("accept-language", currentLanguage);
    searchUrl.searchParams.set("q", query);

    try {
      const response = await fetch(searchUrl.toString(), {
        headers: {
          Accept: "application/json"
        },
        signal: addressSearchController.signal
      });

      if (!response.ok) {
        throw new Error("Address search failed");
      }

      const data = await response.json();
      renderAddressSuggestions(Array.isArray(data) ? data : []);
    } catch (error) {
      if (error && error.name === "AbortError") {
        return;
      }

      clearAddressSuggestions();
      if (addressSearchStatus) {
        addressSearchStatus.textContent = copy[currentLanguage].addressError;
      }
    }
  }

  function queueAddressSearch() {
    window.clearTimeout(addressSearchTimer);
    addressSearchTimer = window.setTimeout(function () {
      searchAddress(foundLocationInput ? foundLocationInput.value.trim() : "");
    }, 650);
  }

  function selectAddress(index) {
    const item = addressResults[index];
    if (!item || !foundLocationInput) {
      return;
    }

    const latitude = Number(item.lat);
    const longitude = Number(item.lon);

    suppressAddressInput = true;
    foundLocationInput.value = item.display_name || item.name || foundLocationInput.value;
    suppressAddressInput = false;
    clearAddressSuggestions();

    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      setFoundCoordinates(latitude.toFixed(6), longitude.toFixed(6));
      locationStatus.textContent = copy[currentLanguage].addressSelected;
      locationStatus.className = "location-status is-success";
    }
  }

  function validateForm() {
    clearErrors();
    let isValid = true;
    const requiredFields = [
      document.querySelector("#place-type"),
      document.querySelector("#found-location"),
      document.querySelector("#message"),
      document.querySelector("#finder-name"),
      document.querySelector("#contact-method"),
      document.querySelector("#finder-contact"),
      botAnswer
    ];

    requiredFields.forEach(function (field) {
      if (!field || field.value.trim()) {
        return;
      }
      setFieldError(field.id, copy[currentLanguage].requiredError);
      isValid = false;
    });

    const privacyConsent = document.querySelector("#privacy-consent");
    if (privacyConsent && !privacyConsent.checked) {
      setFieldError("privacy-consent", copy[currentLanguage].consentError);
      isValid = false;
    }

    if (botAnswer && fields.botA && fields.botB) {
      const expected = Number(fields.botA.value) + Number(fields.botB.value);
      const supplied = Number(botAnswer.value.trim());

      if (!Number.isFinite(supplied) || supplied !== expected) {
        setFieldError("bot-answer", copy[currentLanguage].antiBotError);
        isValid = false;
      }
    }

    return isValid;
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      locationStatus.textContent = copy[currentLanguage].locationUnsupported;
      locationStatus.className = "location-status is-error";
      return;
    }

    locationStatus.textContent = copy[currentLanguage].locationLoading;
    locationStatus.className = "location-status";
    locationButton.disabled = true;

    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);

        setFoundCoordinates(latitude, longitude);
        locationStatus.textContent = copy[currentLanguage].locationSuccess;
        locationStatus.className = "location-status is-success";
        locationButton.disabled = false;
      },
      function (error) {
        const denied = error && error.code === error.PERMISSION_DENIED;
        locationStatus.textContent = denied ? copy[currentLanguage].locationDenied : copy[currentLanguage].locationUnavailable;
        locationStatus.className = "location-status is-error";
        clearFoundCoordinates();
        locationButton.disabled = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  }

  async function submitForm(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isPlaceholder(config.formEndpoint)) {
      formStatus.textContent = copy[currentLanguage].endpointMissing;
      formStatus.className = "form-status is-error";
      return;
    }

    submitButton.disabled = true;
    formStatus.textContent = copy[currentLanguage].sending;
    formStatus.className = "form-status";

    try {
      const payload = new URLSearchParams();
      new FormData(form).forEach(function (value, key) {
        payload.append(key, String(value));
      });

      const response = await fetch(config.formEndpoint, {
        method: "POST",
        body: payload
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      form.reset();
      fields.bagId.value = bagId;
      fields.pageUrl.value = isPlaceholder(config.siteUrl) ? window.location.href : config.siteUrl;
      fields.language.value = currentLanguage;
      clearFoundCoordinates();
      clearAddressSuggestions();
      setBotChallenge();
      formStatus.textContent = "";
      formStatus.className = "form-status";
      if (locationStatus) {
        locationStatus.textContent = "";
        locationStatus.className = "location-status";
      }
      successScreen.classList.remove("is-hidden");
      successScreen.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      formStatus.textContent = copy[currentLanguage].sendError;
      formStatus.className = "form-status is-error";
    } finally {
      submitButton.disabled = false;
    }
  }

  const bagId = config.bagId || "BAG-ID";

  bagIdNodes.forEach(function (node) {
    node.textContent = bagId;
  });

  if (fields.bagId) {
    fields.bagId.value = bagId;
  }

  if (fields.pageUrl) {
    fields.pageUrl.value = isPlaceholder(config.siteUrl) ? window.location.href : config.siteUrl;
  }

  languageButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setLanguage(button.getAttribute("data-lang"));
    });
  });

  if (locationButton && locationStatus) {
    locationButton.addEventListener("click", requestLocation);
  }

  if (foundLocationInput) {
    foundLocationInput.addEventListener("input", function () {
      if (suppressAddressInput) {
        return;
      }

      clearFoundCoordinates();
      queueAddressSearch();
    });
  }

  if (addressSuggestions) {
    addressSuggestions.addEventListener("click", function (event) {
      const button = event.target && event.target.closest("[data-address-index]");
      if (!button) {
        return;
      }

      selectAddress(Number(button.getAttribute("data-address-index")));
    });
  }

  document.addEventListener("click", function (event) {
    if (!addressSuggestions || !foundLocationInput) {
      return;
    }

    if (event.target === foundLocationInput || addressSuggestions.contains(event.target)) {
      return;
    }

    clearAddressSuggestions();
  });

  if (form) {
    form.addEventListener("submit", submitForm);
  }

  setText("[data-bag-id]", bagId);
  setLanguage(currentLanguage);
  setBotChallenge();
}());
