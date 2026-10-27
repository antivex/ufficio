# Costruisce index.html dal modello e dai pezzi della scena 3D (src/), gli stessi dei video della serie.
from pathlib import Path
QUI = Path(__file__).parent
m = (QUI / "modello.html").read_text(encoding="utf-8")
out = m.replace("/*PEZZI_ROSTER*/", (QUI / "src/roster.js").read_text(encoding="utf-8")).replace("/*PEZZI_SCENA*/", (QUI / "src/scena.js").read_text(encoding="utf-8"))
(QUI / "index.html").write_text(out, encoding="utf-8")
print("index.html", len(out))
