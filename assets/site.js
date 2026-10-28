// Shared helpers for the public page and the host page.
const LETTERS = "ACDEFGHILMNOPRSTUWY".split("");

function vigenereTable(el){
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let h = "<table><tr><th>KEY↓ / PLAIN→</th>";
  for (const c of A) h += `<th>${c}</th>`;
  h += "</tr>";
  for (let r = 0; r < 26; r++){
    h += `<tr><th>${A[r]}</th>`;
    for (let c = 0; c < 26; c++) h += `<td>${A[(r + c) % 26]}</td>`;
    h += "</tr>";
  }
  el.innerHTML = h + "</table>";
}

function shuffledGallery(el){
  // Deterministic shuffle so the page looks the same for everyone and reveals no order.
  const order = [...LETTERS];
  let seed = 9009;
  for (let i = order.length - 1; i > 0; i--){
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  el.innerHTML = order.map(L => `<figure><img loading="lazy" src="assets/landsat/${L}.jpg" alt="Landsat frame"></figure>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const g = document.getElementById("gallery"); if (g) shuffledGallery(g);
  const v = document.getElementById("vig"); if (v) vigenereTable(v);
});
