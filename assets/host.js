// Host area: decrypt assets/host.enc.json with the passcode, inject the content,
// then draw the bearing lines on the map canvas.

const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

async function decryptBlob(passcode){
  const blob = await (await fetch("assets/host.enc.json", {cache: "no-store"})).json();
  const enc = new TextEncoder();
  const base = await crypto.subtle.importKey("raw", enc.encode(passcode), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    {name: "PBKDF2", salt: b64(blob.salt), iterations: blob.iterations, hash: "SHA-256"},
    base, {name: "AES-GCM", length: 256}, false, ["decrypt"]);
  const plain = await crypto.subtle.decrypt({name: "AES-GCM", iv: b64(blob.iv)}, key, b64(blob.ct));
  return new TextDecoder().decode(plain);
}

function drawBearings(data, teamId){
  const img = document.getElementById("hostmap");
  const cv = document.getElementById("bearings");
  if (!img || !cv) return;
  const W = 1797, H = 1270;             // pixel space of UT_Map_Preview.png (coords in data.coords)
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  ctx.clearRect(0, 0, W, H);
  const team = data.teams.find(t => t.id === teamId);
  if (!team) return;
  const colors = ["#b4471f", "#1f5f8b", "#2a7a4b"];
  team.stations.forEach((s, i) => {
    const [sx, sy] = data.coords[String(parseInt(s, 10))];
    const a = team.bearings[i] * Math.PI / 180;
    const L = 2200;
    ctx.strokeStyle = colors[i]; ctx.lineWidth = 4; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + L * Math.sin(a), sy - L * Math.cos(a)); ctx.stroke();
    ctx.fillStyle = colors[i]; ctx.beginPath(); ctx.arc(sx, sy, 14, 0, 2 * Math.PI); ctx.fill();
    ctx.font = "bold 30px sans-serif"; ctx.fillText(`${["A", "B", "C"][i]} ${s} → ${String(team.bearings[i]).padStart(3, "0")}°`, sx + 18, sy - 12);
  });
  const [tx, ty] = data.coords[team.target];
  ctx.strokeStyle = "#000"; ctx.lineWidth = 5; ctx.setLineDash([10, 8]);
  ctx.beginPath(); ctx.arc(tx, ty, 40, 0, 2 * Math.PI); ctx.stroke();
}

function initHost(data){
  const tabs = document.getElementById("teamtabs");
  if (!tabs) return;
  data.teams.forEach(t => {
    const b = document.createElement("button");
    b.textContent = `Crew ${String(t.id).padStart(2, "0")} → ${t.target}`;
    b.className = "secondary";
    b.onclick = () => { [...tabs.children].forEach(x => x.classList.remove("active")); b.classList.add("active"); drawBearings(data, t.id); };
    tabs.appendChild(b);
  });
  tabs.firstChild.click();
}

document.getElementById("gateform").addEventListener("submit", async e => {
  e.preventDefault();
  const err = document.getElementById("gateerr"); err.hidden = true;
  const pc = document.getElementById("pc").value.trim();
  try {
    const html = await decryptBlob(pc);
    const host = document.getElementById("hostcontent");
    host.innerHTML = html;
    // give sections ids matching the nav
    [...host.querySelectorAll("section")].forEach((s, i) => s.id = "h" + (i + 1));
    document.getElementById("gate").hidden = true;
    const data = JSON.parse(document.getElementById("hostdata").textContent);
    initHost(data);
    try { sessionStorage.setItem("langezijds_pc", pc); } catch (_) {}
  } catch (_) {
    err.hidden = false;
  }
});

// Re-unlock automatically within the same browser tab session.
try {
  const saved = sessionStorage.getItem("langezijds_pc");
  if (saved) { document.getElementById("pc").value = saved; document.getElementById("gateform").requestSubmit(); }
} catch (_) {}
