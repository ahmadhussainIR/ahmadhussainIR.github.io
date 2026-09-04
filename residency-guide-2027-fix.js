(() => {
  const fileName = "Radiology_Residency_Guide_2027.pdf";
  const bad = "UERGIC9";
  const good = "QREYgL1";
  function b64ToBlob(b64) {
    const raw = atob(b64);
    const size = 8192;
    const chunks = [];
    for (let offset = 0; offset < raw.length; offset += size) {
      const slice = raw.slice(offset, offset + size);
      const bytes = new Uint8Array(slice.length);
      for (let i = 0; i < slice.length; i++) bytes[i] = slice.charCodeAt(i);
      chunks.push(bytes);
    }
    return new Blob(chunks, { type: "application/pdf" });
  }
  async function getGuideData() {
    const response = await fetch("residency-guide-2027.js?v=1", { cache: "no-store" });
    const text = await response.text();
    const match = text.match(/const data = "([^"]+)";/);
    if (!match) throw new Error("Residency guide payload unavailable");
    return match[1].replace(bad, good);
  }
  async function downloadGuide(event) {
    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    const data = await getGuideData();
    const url = URL.createObjectURL(b64ToBlob(data));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2500);
  }
  window.downloadResidencyGuide2027 = downloadGuide;
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-download-residency-guide]").forEach((button) => {
      button.addEventListener("click", downloadGuide, { capture: true });
    });
  });
})();
