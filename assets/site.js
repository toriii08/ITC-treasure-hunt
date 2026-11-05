// Shared helpers for the public page and the host page.
const LETTERS = "ACDEFGHILMNOPRSTUWY".split("");

function vigenereTable(el){
  // Row = key letter, column header = plain letter, cell = cipher letter.
  // Optional data-key / data-cipher on the element highlight one worked example.
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const hr = A.indexOf(el.dataset.key || "");
  const hc = hr < 0 ? -1 : [...A].findIndex((_, c) => A[(hr + c) % 26] === el.dataset.cipher);
  const cls = (...names) => { const n = names.filter(Boolean).join(" "); return n ? ` class="${n}"` : ""; };
  let h = "<table><tr><th>KEY↓ / PLAIN→</th>";
  for (let c = 0; c < 26; c++) h += `<th${cls(c === hc && "hl")}>${A[c]}</th>`;
  h += "</tr>";
  for (let r = 0; r < 26; r++){
    h += `<tr><th${cls(r === hr && "hl")}>${A[r]}</th>`;
    for (let c = 0; c < 26; c++){
      const hit = r === hr && c === hc;
      h += `<td${cls(hit && "hl", !hit && r === hr && "hl-row", !hit && c === hc && hc >= 0 && "hl-col")}>${A[(r + c) % 26]}</td>`;
    }
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
