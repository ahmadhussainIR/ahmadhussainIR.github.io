(function () {
  const BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
  const TOPIC = '("interventional radiology"[Title/Abstract] OR embolization[Title/Abstract] OR musculoskeletal[Title/Abstract] OR "radiology AI"[Title/Abstract])';
  const JOURNALS = '("J Vasc Interv Radiol"[jour] OR "Cardiovasc Intervent Radiol"[jour] OR "Radiol Artif Intell"[jour] OR "Radiology"[jour] OR "Radiographics"[jour])';
  const CACHE_KEY = "ahmad-radiology-resources-v3";
  const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

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
    search.search = new URLSearchParams({ db: "pubmed", retmode: "json", retmax: "60", sort: "pub date", term });
    const searchData = await fetch(search).then((response) => response.json());
    const ids = searchData.esearchresult.idlist || [];
    if (!ids.length) return [];
    const summary = new URL(`${BASE}esummary.fcgi`);
    summary.search = new URLSearchParams({ db: "pubmed", retmode: "json", id: ids.join(",") });
    const summaryData = await fetch(summary).then((response) => response.json());
    const abstractRequest = new URL(`${BASE}efetch.fcgi`);
    abstractRequest.search = new URLSearchParams({ db: "pubmed", id: ids.join(","), retmode: "xml" });
    const abstractXml = await fetch(abstractRequest).then((response) => response.text());
    const document = new DOMParser().parseFromString(abstractXml, "text/xml");
    const abstracts = new Map(Array.from(document.querySelectorAll("PubmedArticle")).map((record) => {
      const id = record.querySelector("PMID")?.textContent;
      const text = Array.from(record.querySelectorAll("Abstract AbstractText")).map((node) => node.textContent?.trim()).filter(Boolean).join(" ");
      return [id, text];
    }));
    return ids.map((id) => ({ ...summaryData.result[id], abstract: abstracts.get(id) || "" })).filter(Boolean);
  }

  function render(target, articles, label) {
    if (!articles.length) {
      target.innerHTML = `<p class="resource-empty">No new matching papers were indexed in the ${label}. Browse the journals directly for the wider literature.</p>`;
      return;
    }
    target.innerHTML = articles.slice(0, 4).map((article, index) => {
      const authors = (article.authors || []).slice(0, 3).map((author) => author.name).join(", ");
      const citation = [authors, article.source, article.pubdate].filter(Boolean).join(" · ");
      const abstract = article.abstract || "No abstract is available in PubMed for this article.";
      const doi = (article.articleids || []).find((identifier) => identifier.idtype === "doi")?.value;
      const fullText = doi ? `https://doi.org/${encodeURIComponent(doi)}` : `https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(article.uid)}/`;
      return `<article class="resource-item"><span>${String(index + 1).padStart(2, "0")}</span><div><a href="https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(article.uid)}/" target="_blank" rel="noopener noreferrer"><h3>${escapeHtml(article.title)}</h3><p>${escapeHtml(citation)}</p></a><div class="article-abstract"><strong>Abstract</strong><p>${escapeHtml(abstract)}</p></div><div class="article-actions"><a href="https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(article.uid)}/" target="_blank" rel="noopener noreferrer">PubMed record ↗</a><a href="${fullText}" target="_blank" rel="noopener noreferrer">Full text ↗</a></div></div></article>`;
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

  (async function () {
    const journals = [
      { id: "jvirArticles", source: "J Vasc Interv Radiol", label: "JVIR" },
      { id: "cvirArticles", source: "Cardiovasc Intervent Radiol", label: "CVIR" },
      { id: "radiologyArticles", source: "Radiology", label: "Radiology" },
      { id: "radiographicsArticles", source: "Radiographics", label: "RadioGraphics" },
      { id: "raiArticles", source: "Radiol Artif Intell", label: "Radiology: AI" }
    ];
    try {
      const stored = JSON.parse(window.localStorage.getItem(CACHE_KEY) || "null");
      const cacheIsFresh = stored && Array.isArray(stored.articles) && (Date.now() - stored.savedAt) < CACHE_DURATION;
      const articles = cacheIsFresh ? stored.articles : await getArticles(365);
      if (!cacheIsFresh) window.localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), articles }));
      journals.forEach((journal) => render(document.getElementById(journal.id), articles.filter((article) => article.source === journal.source), journal.label));
    } catch (error) {
      const fallback = `<p class="resource-empty">The live reading list is temporarily unavailable. <a href="https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(`${TOPIC} AND ${JOURNALS}`)}" target="_blank" rel="noopener noreferrer">Browse matching articles on PubMed ↗</a></p>`;
      journals.forEach((journal) => { document.getElementById(journal.id).innerHTML = fallback; });
    }
  }());
}());
