const API_HOST = [
  98, 97, 103, 45, 105, 100, 45, 114, 101, 99, 111, 118, 101, 114, 121, 46,
  112, 114, 111, 45, 108, 111, 99, 111, 45, 115, 97, 110, 45, 50, 48, 51,
  54, 46, 99, 104, 97, 116, 103, 112, 116, 46, 115, 105, 116, 101
].map(function (code) {
  return String.fromCharCode(code);
}).join("");
const API_BASE = `https://${API_HOST}/api`;

const CONFIG = {
  bagId: "AM-7K42",
  siteUrl: "https://antomirenda.github.io/bag-id/bag/?id=AM-7K42",
  formEndpoint: `${API_BASE}/reports`,
  pushEndpoint: `${API_BASE}/push`,
  scanEndpoint: `${API_BASE}/scans`,
  pushPublicKey: "BMCXu0hLfaWAK6D2oH0zDec8qOdYa7hwLzsxy5KwqVuT5HamKRX7-z8Jj61djTVfQy9y-OV4ztehO-f5mLazYY0",
  defaultLanguage: "it"
};

window.CONFIG = CONFIG;
