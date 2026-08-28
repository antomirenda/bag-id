(function () {
  "use strict";

  const config = window.CONFIG || {};
  const bagId = config.bagId || "BAG-ID";
  const qrTarget = String(config.siteUrl || "").trim();
  const qrNode = document.querySelector("#qr-code");
  const qrTargetNode = document.querySelector("#qr-target");
  const warningNode = document.querySelector("#tag-warning");
  const printButton = document.querySelector("#print-button");

  function isPlaceholder(value) {
    return !value || /^INSERIRE_/i.test(value);
  }

  document.querySelectorAll("[data-bag-id]").forEach(function (node) {
    node.textContent = bagId;
  });

  if (qrTargetNode) {
    qrTargetNode.textContent = "Il QR usa l'URL pubblico configurato in assets/js/config.js.";
  }

  if (warningNode && isPlaceholder(qrTarget)) {
    warningNode.textContent = "Configura CONFIG.siteUrl prima di stampare il QR definitivo.";
  }

  if (qrNode && window.qrcode) {
    qrNode.textContent = "";
    const qr = window.qrcode(0, "H");
    qr.addData(qrTarget || "https://antomirenda.github.io/bag-id/bag/?id=AM-7K42");
    qr.make();
    qrNode.innerHTML = qr.createSvgTag({
      scalable: true,
      margin: 4
    });
  }

  if (printButton) {
    printButton.addEventListener("click", function () {
      window.print();
    });
  }
}());
