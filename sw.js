self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", function (event) {
  const adminUrl = new URL("admin.html", self.registration.scope).href;

  event.waitUntil(
    self.registration.showNotification("Nuova segnalazione valigia", {
      body: "Apri il pannello Bag ID per leggere il messaggio.",
      badge: "assets/icons/suitcase.svg",
      icon: "assets/icons/suitcase.svg",
      tag: "bag-id-report",
      renotify: true,
      data: {
        url: adminUrl
      }
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  const targetUrl = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : new URL("admin.html", self.registration.scope).href;

  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clients) {
      const existingClient = clients.find(function (client) {
        return client.url === targetUrl || client.url.startsWith(targetUrl + "?");
      });

      if (existingClient) {
        return existingClient.focus();
      }

      return self.clients.openWindow(targetUrl);
    })
  );
});
