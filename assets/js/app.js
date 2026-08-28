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
    mapsLink: document.querySelector("#maps-link-field")
  };
  const locationButton = document.querySelector("#location-button");
  const locationStatus = document.querySelector("#location-status");
  const coordinatesPreview = document.querySelector("#coordinates-preview");
  const mapsPreview = document.querySelector("#maps-preview");
  const formStatus = document.querySelector("#form-status");
  const submitButton = document.querySelector("#submit-button");
  const successScreen = document.querySelector("#success-screen");

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
      locationPlaceholder: "Luogo o riferimento preciso...",
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
      submitButton: "INVIA AL PROPRIETARIO",
      successTitle: "MESSAGGIO INVIATO",
      successText: "Grazie per il tuo aiuto. La tua segnalazione è stata inviata al proprietario della valigia.",
      footerText: "Questa pagina scoraggia l'indicizzazione, ma chi possiede l'URL può comunque visitarla.",
      requiredError: "Campo obbligatorio.",
      consentError: "Per inviare il messaggio serve questa autorizzazione.",
      endpointMissing: "Configura prima l'endpoint Formspree in assets/js/config.js.",
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
      locationPlaceholder: "Place or precise reference...",
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
      submitButton: "SEND TO OWNER",
      successTitle: "MESSAGE SENT",
      successText: "Thank you for your help. Your message has been sent to the bag owner.",
      footerText: "This page discourages indexing, but anyone with the URL can still visit it.",
      requiredError: "This field is required.",
      consentError: "This authorization is required before sending.",
      endpointMissing: "Configure the Formspree endpoint in assets/js/config.js first.",
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

  function validateForm() {
    clearErrors();
    let isValid = true;
    const requiredFields = [
      document.querySelector("#place-type"),
      document.querySelector("#found-location"),
      document.querySelector("#message"),
      document.querySelector("#finder-name"),
      document.querySelector("#contact-method"),
      document.querySelector("#finder-contact")
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
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

        fields.latitude.value = latitude;
        fields.longitude.value = longitude;
        fields.mapsLink.value = mapsLink;
        locationStatus.textContent = copy[currentLanguage].locationSuccess;
        locationStatus.className = "location-status is-success";
        if (coordinatesPreview) {
          coordinatesPreview.textContent = `${copy[currentLanguage].coordinatesLabel}: ${latitude}, ${longitude}`;
          coordinatesPreview.classList.remove("is-hidden");
        }
        if (mapsPreview) {
          mapsPreview.href = mapsLink;
          mapsPreview.classList.remove("is-hidden");
        }
        locationButton.disabled = false;
      },
      function (error) {
        const denied = error && error.code === error.PERMISSION_DENIED;
        locationStatus.textContent = denied ? copy[currentLanguage].locationDenied : copy[currentLanguage].locationUnavailable;
        locationStatus.className = "location-status is-error";
        if (mapsPreview) {
          mapsPreview.classList.add("is-hidden");
          mapsPreview.removeAttribute("href");
        }
        if (coordinatesPreview) {
          coordinatesPreview.textContent = "";
          coordinatesPreview.classList.add("is-hidden");
        }
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
      const response = await fetch(config.formEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      form.reset();
      fields.bagId.value = bagId;
      fields.pageUrl.value = isPlaceholder(config.siteUrl) ? window.location.href : config.siteUrl;
      fields.language.value = currentLanguage;
      fields.latitude.value = "";
      fields.longitude.value = "";
      fields.mapsLink.value = "";
      if (locationStatus) {
        locationStatus.textContent = "";
        locationStatus.className = "location-status";
      }
      if (mapsPreview) {
        mapsPreview.classList.add("is-hidden");
        mapsPreview.removeAttribute("href");
      }
      if (coordinatesPreview) {
        coordinatesPreview.textContent = "";
        coordinatesPreview.classList.add("is-hidden");
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

  if (form) {
    form.addEventListener("submit", submitForm);
  }

  setText("[data-bag-id]", bagId);
  setLanguage(currentLanguage);
}());
