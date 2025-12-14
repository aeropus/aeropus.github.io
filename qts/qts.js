/**
 * qts.js – Aeropus Quick Table Grid Scripts
 * Version: 0.1
 * Author: Luković
 * License: MIT
 * Description: Wandelt <qts>-Tags in HTML-Grid um. Styles über QTS-Koordinaten möglich.
 */

(function () {

  function parseQTS() {
    document.querySelectorAll("qts").forEach(qts => {

      // 1. Grid-Definition
      const gridMatch = qts.innerText.match(/grid\s+h:(\d+);w:(\d+)/i);
      if (!gridMatch) return;
      const h = Number(gridMatch[1]);
      const w = Number(gridMatch[2]);

      // 2. Content parsen
      const contentEl = qts.querySelector("qts-content");
      if (!contentEl) return;
      const content = contentEl.innerText
        .trim()
        .split("\n")
        .map(r => r.split(";").map(c => c.replace(/[\[\]]/g, "").trim()));

      // 3. Grid-Container
      const grid = document.createElement("div");
      grid.className = "qts-grid";
      grid.style.display = "grid";
      grid.style.gridTemplateColumns = `repeat(${w}, 1fr)`;
      grid.style.gap = "6px";

      // 4. Zellen erzeugen
      content.forEach((row, y) => {
        row.forEach((cell, x) => {
          const d = document.createElement("div");
          d.className = `qts-cell h${y+1} w${x+1}`;
          d.textContent = cell;
          d.style.padding = "6px 10px";
          d.style.borderRadius = "6px";
          d.style.background = "#1e1e1e";
          d.style.color = "#eee";
          d.style.fontFamily = "system-ui, sans-serif";
          d.style.textAlign = "center";
          grid.appendChild(d);
        });
      });

      // 5. QTS-Styles anwenden
      const styleBlock = qts.querySelector("qts-style");
      if (styleBlock) {
        const style = document.createElement("style");
        style.innerHTML = styleBlock.innerText
          .replace(/coordinate\s+h:(\*|\d+);w:(\*|\d+)/gi, (_, hh, ww) =>
            `.qts-cell${hh==="*"?"":".h"+hh}${ww==="*"?"":".w"+ww}`
          );
        document.head.appendChild(style);
      }

      // 6. Original ersetzen
      qts.replaceWith(grid);
    });
  }

  // Auto starten, sobald DOM fertig
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", parseQTS);
  } else {
    parseQTS();
  }

})();
