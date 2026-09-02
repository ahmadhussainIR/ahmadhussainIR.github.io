(function () {
  const BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
  const TOPIC = '("musculoskeletal embolization"[Title/Abstract] OR "genicular artery embolization"[Title/Abstract] OR "shoulder artery embolization"[Title/Abstract] OR "musculoskeletal intervention"[Title/Abstract])';
  const JOURNALS = '("J Vasc Interv Radiol"[jour] OR "Cardiovasc Intervent Radiol"[jour] OR "Radiol Artif Intell"[jour])';

  function date(daysAgo) {
    const value = new Date();
    value.setDate(value.getDate() - daysAgo);
    return value.toISOString().slice(0, 10);
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
  }

  async function getArticles(daysAgo) {
    const term = `${TOPIC} AND ${JOURNALS} AND (${date(daysAgo)}[pdat] : ${date(0)}[pdat])`;
    const search = new URL(`${BASE}esearch.fcgi`);
    search.search = new URLSearchParams({ db: "pubmed", retmode: "json", retmax: "6", sort: "pub date", term });
    const searchData = await fetch(search).then((response) => response.json());
    const ids = searchData.esearchresult.idlist || [];
    if (!ids.length) return [];
    const summary = new URL(`${BASE}esummary.fcgi`);
    summary.search = new URLSearchParams({ db: "pubmed", retmode: "json", id: ids.join(",") });
    const summaryData = await fetch(summary).then((response) => response.json());
    return ids.map((id) => summaryData.result[id]).filter(Boolean);
  }

  function render(target, articles, label) {
    if (!articles.length) {
      target.innerHTML = `<p class="resource-empty">No new matching papers were indexed in the ${label}. Browse the journals directly for the wider literature.</p>`;
      return;
    }
    target.innerHTML = articles.map((article, index) => {
      const authors = (article.authors || []).slice(0, 3).map((author) => author.name).join(", ");
      const citation = [authors, article.source, article.pubdate].filter(Boolean).join(" · ");
      return `<a class="resource-item" href="https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(article.uid)}/" target="_blank" rel="noopener noreferrer"><span>${String(index + 1).padStart(2, "0")}</span><div><h3>${escapeHtml(article.title)}</h3><p>${escapeHtml(citation)}</p></div><b>Read abstract ↗</b></a>`;
    }).join("");
  }

  async function load(targetId, daysAgo, label) {
    const target = document.getElementById(targetId);
    try {
      render(target, await getArticles(daysAgo), label);
    } catch (error) {
      target.innerHTML = `<p class="resource-empty">The live reading list is temporarily unavailable. <a href="https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(`${TOPIC} AND ${JOURNALS}`)}" target="_blank" rel="noopener noreferrer">Browse matching articles on PubMed ↗</a></p>`;
    }
  }

  load("weeklyArticles", 7, "past week");
  load("monthlyArticles", 30, "past month");
}());
