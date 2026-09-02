(function () {
  const BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";
  const TOPIC = '("interventional radiology"[Title/Abstract] OR embolization[Title/Abstract] OR musculoskeletal[Title/Abstract] OR "radiology AI"[Title/Abstract])';
  const JOURNALS = '("J Vasc Interv Radiol"[jour] OR "Cardiovasc Intervent Radiol"[jour] OR "Radiol Artif Intell"[jour] OR "Radiology"[jour] OR "Radiographics"[jour])';
  const CURATED_GAE = ["42487072", "42118083", "42303879", "42567951", "36991094", "37051829"];
  const CURATED_AI = ["41879561", "41258794", "34136816"];
  const CURATED_IDS = [...CURATED_GAE, ...CURATED_AI];
  const CACHE_KEY = "ahmad-radiology-resources-v6";
  const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

  const SEED_ARTICLES = [
    {
      uid: "42487072",
      title: "Genicular Artery Embolization for Chronic Knee Pain: Expert Consensus Recommendations on Indications, Technique and Clinical Care Using a Delphi Process",
      source: "Cardiovasc Intervent Radiol",
      pubdate: "2026",
      authors: [{ name: "A Taheri Amin" }, { name: "J Golzarian" }, { name: "K Abd El Tawab" }],
      articleids: [{ idtype: "doi", value: "10.1007/s00270-026-04547-8" }],
      abstract: "To develop expert-consensus recommendations for patient selection, technique and clinical management in genicular artery embolization (GAE) using a Delphi process. A working group developed a 75-statement questionnaire. A panel of musculoskeletal and interventional radiologists, selected based on clinical experience, scientific expertise and geographic diversity, scored each response using a 10-point Likert scale across three rounds. Consensus was predefined as at least 75% of ratings at least 7/10. Twenty-nine interventional radiologists completed all three rounds. Consensus inclusion criteria for GAE include knee pain refractory to conservative treatment for at least 3 months due to osteoarthritis, tendinopathies or prior knee surgery and recurrent hemarthrosis. Pre-procedural assessment should include standardized outcome measures, clinical examination and knee radiographs. Contrast-enhanced MRI is optional for osteoarthritis phenotyping and grading of synovitis, differential diagnosis and outcome prediction. Via an ipsilateral antegrade transfemoral access, all visible genicular arteries should be catheterized and embolized upon detection of a hypervascular blush. No evidence of superiority of either temporary or permanent embolic agents in terms of safety or efficacy has been demonstrated. Structured long-term follow-up is recommended, with clinical success defined as achievement of the minimal clinically important difference or individual patient satisfaction. Contralateral or repeat GAE may be considered for bilateral knee pain, insufficient response or pain recurrence. This Delphi study establishes expert-derived consensus recommendations for GAE, emphasizing broad indications, patient-tailored technique and an active role of the interventional radiologist in multidisciplinary longitudinal care."
    },
    {
      uid: "42118083",
      title: "Society of Interventional Radiology Position Statement on Genicular Artery Embolization for Symptomatic Knee Osteoarthritis",
      source: "J Vasc Interv Radiol",
      pubdate: "2026",
      authors: [{ name: "O Ahmed" }, { name: "B Taslakian" }, { name: "Y Okuno" }],
      articleids: [{ idtype: "doi", value: "10.1016/j.jvir.2026.108803" }],
      abstract: "Knee osteoarthritis is a prevalent musculoskeletal condition characterized by a significant therapeutic gap between the failure of conservative medical therapies and surgical arthroplasty. Contemporary evidence supports a model in which chronic synovitis and pathologic neoangiogenesis, closely coupled to perivascular nociceptive nerve growth, serve as significant contributors of pain and peripheral sensitization in knee osteoarthritis. Genicular artery embolization has emerged as a targeted, joint-preserving vascular intervention performed by interventional radiologists that directly addresses the inflammatory and neurovascular components of knee osteoarthritis. The purpose of this societal-endorsed position statement is to synthesize the current knowledge base for genicular artery embolization and review its biologic rationale, clinical evidence, technical considerations, safety profile, and evolving regulatory landscape."
    },
    {
      uid: "42303879",
      title: "Outcome and Safety of Genicular Artery Embolization for Knee Osteoarthritis: A Systematic Review and Meta-Analysis",
      source: "Cardiovasc Intervent Radiol",
      pubdate: "2026",
      authors: [{ name: "A T Amin" }, { name: "I E M Safar" }, { name: "R B Trujillo" }],
      articleids: [{ idtype: "doi", value: "10.1007/s00270-026-04502-7" }],
      abstract: "This systematic review and meta-analysis evaluated pain and functional outcomes, safety, and differences between embolic agents in genicular artery embolization for knee osteoarthritis. Forty-five studies including 2205 patients were analyzed. Across predominantly uncontrolled studies, clinically relevant improvements were observed, with pooled Visual Analogue Scale reductions of 37.5 points at 1 month and 37.1 points at 12 months. Western Ontario and McMaster Universities Osteoarthritis Index improved by 28.9 points at 1 month, and Knee Injury and Osteoarthritis Outcome Score-Pain by 23.6 points at 6 months. Mean changes exceeded clinically important thresholds. No significant subgroup interaction between permanent and temporary embolic agents was observed. The most frequent adverse events were transient skin discoloration (11%) and hematoma (3%). Overall, the certainty of evidence ranged from very low to low."
    },
    {
      uid: "42567951",
      title: "Musculoskeletal Embolization: Are We Witnessing Evidence-Based Progress or Evidence-Limited Enthusiasm?",
      source: "Cardiovasc Intervent Radiol",
      pubdate: "2026",
      authors: [{ name: "R Loffroy" }],
      articleids: [{ idtype: "doi", value: "10.1007/s00270-026-04575-4" }],
      abstract: "No abstract is available in PubMed for this commentary."
    },
    {
      uid: "36991094",
      title: "Genicular Artery Embolization as a Treatment for Osteoarthritis Related Knee Pain: A Systematic Review and Meta-analysis",
      source: "Cardiovasc Intervent Radiol",
      pubdate: "2023",
      authors: [{ name: "Y Epelboym" }, { name: "J C Mandell" }, { name: "J E Collins" }],
      articleids: [{ idtype: "doi", value: "10.1007/s00270-023-03422-0" }],
      abstract: "Genicular artery embolization (GAE) is a minimally invasive therapy for symptomatic osteoarthritis in patients with knee pain refractory to conservative management. The purpose of this study was to evaluate evidence on the effectiveness of GAE for osteoarthritis-related knee pain as part of a systematic review and meta-analysis. Using Embase, PubMed, and Web of Science, a systematic review was performed to identify studies evaluating treatment of knee osteoarthritis with GAE. The primary outcome measure was change in pain scale score at 6 months. A Hedge's g was computed as a measure of effect size, selecting Visual Analog Scale first if available and Knee Injury and Osteoarthritis Outcome Score and Western Ontario and McMaster Universities Osteoarthritis Index if VAS was not available. After screening titles, abstracts, and the full text, 10 studies met inclusion criteria. A total of 351 treated knees were included. Patients who underwent GAE demonstrated declines in VAS pain scores at 1, 3, 6, and 12 months. GAE provides durable reductions in pain scores for patients suffering with mild, moderate, and severe osteoarthritis."
    },
    {
      uid: "37051829",
      title: "Genicular artery embolization for early-stage knee osteoarthritis: results from a triple-blind single-centre randomized controlled trial",
      source: "Bone Jt Open",
      pubdate: "2023",
      authors: [{ name: "S Landers" }, { name: "R Hely" }, { name: "A Hely" }],
      articleids: [{ idtype: "doi", value: "10.1302/2633-1462.43.BJO-2022-0161.R2" }],
      abstract: "This study investigated the effects of transcatheter arterial embolization on pain, function, and quality of life in people with early-stage symptomatic knee osteoarthritis compared with a sham procedure. A total of 59 participants with symptomatic Kellgren-Lawrence grade 2 knee osteoarthritis were randomly allocated to embolization or a sham procedure. The primary outcome was knee pain at 12 months according to the Knee injury and Osteoarthritis Outcome Score pain scale. Overall, 58 participants provided questionnaire data at 12 months. No significant differences were found for the primary and secondary outcomes, with both groups improving following the procedure. At 12 months, KOOS pain scores improved by 41.3% and 29.4% in the intervention and control groups, respectively. No adverse events occurred. Subgroup analysis indicated that the complete embolization group had significantly better KOOS Sports and Recreation, KOOS Quality of Life, and Global Change scores than the control group. Transcatheter arterial embolization might produce benefits above placebo, but only when complete embolization of all genicular arteries is performed. Further comparative studies are required before definitive conclusions regarding effectiveness can be made."
    },
    {
      uid: "41879561",
      title: "Bone Metastasis Detection at CT with Deep Learning Models Trained Using Multicenter, Multimodal Reference Standards: Development and Evaluation",
      source: "Radiol Artif Intell",
      pubdate: "2026",
      authors: [{ name: "J-O Lee" }, { name: "D H Kim" }, { name: "H-D Chae" }],
      articleids: [{ idtype: "doi", value: "10.1148/ryai.250283" }],
      abstract: "Purpose: To develop and validate deep learning models for detecting bone metastases on abdominal and thoracic CT scans, considering lesion visibility, and to compare model performance against human readers. Materials and Methods: This retrospective multicenter study included CT scans in patients with bone metastases at four medical centers from August 2013 to October 2021. MRI and PET/CT served as reference standards to categorize lesions as visible, indeterminate, or invisible based on CT visibility. Two nnU-Net models were trained: model 1 with only CT-visible metastases and model 2 with both visible and indeterminate metastases. Results: A total of 502 CT scans in 332 patients with 4999 bone metastases were included. Although lesion-level precision was similar between both models, model 2 achieved higher recall overall and among visible lesions. Both models' precision exceeded that of radiologists in training and musculoskeletal radiologists. Only model 2 achieved recall and scan-level performance comparable with both reader groups. Conclusion: The deep learning model trained with multimodal reference standards achieved expert-level bone metastasis detection performance at body CT."
    },
    {
      uid: "41258794",
      title: "Economic Value of AI in Radiology: A Systematic Review",
      source: "Radiol Artif Intell",
      pubdate: "2026",
      authors: [{ name: "I Molwitz" }, { name: "I Ristow" }, { name: "J Erley" }],
      articleids: [{ idtype: "doi", value: "10.1148/ryai.250090" }],
      abstract: "Purpose: To summarize the evidence of artificial intelligence's economic value across the radiologic workflow. Materials and Methods: A comprehensive search of PubMed, Business Source Ultimate, and EconLit was conducted for original research articles published between January 2010 and November 2024. Studies were selected based on explicit quantification of economic outcomes, excluding those with only soft outcome criteria such as time savings without cost quantification. Results: From the initial 1879 search results, 21 studies met the inclusion criteria. AI demonstrated economic value through cost savings or incremental cost-effectiveness ratios in resource-intensive tasks when accuracy matched human performance and costs were fixed. AI increased costs when specificity was lower than humans' or when using pay-per-use models. In fast tasks such as radiograph evaluations, AI showed value in settings with radiologist shortages. AI reduced costs through protocol optimization and increased revenue via improved follow-up compliance. Conclusion: AI's value in radiology is context dependent, varying with task complexity, examination volume, and implementation model. Further high-quality economic evaluations are essential."
    },
    {
      uid: "34136816",
      title: "Deep Generative Adversarial Networks: Applications in Musculoskeletal Imaging",
      source: "Radiol Artif Intell",
      pubdate: "2021",
      authors: [{ name: "Y Shin" }, { name: "J Yang" }, { name: "Y H Lee" }],
      articleids: [{ idtype: "doi", value: "10.1148/ryai.2021200157" }],
      abstract: "In recent years, deep learning techniques have been applied in musculoskeletal radiology to increase the diagnostic potential of acquired images. Generative adversarial networks, which are deep neural networks that can generate or transform images, have the potential to aid in faster imaging by generating images with a high level of realism across multiple contrasts and modalities from existing imaging protocols. This review introduces the key architectures of generative adversarial networks as well as their technical background and challenges. Key research trends are highlighted, including reconstruction of high-resolution MRI; image synthesis with different modalities and contrasts; image enhancement that efficiently preserves high-frequency information suitable for human interpretation; pixel-level segmentation with annotation sharing between domains; and applications to different musculoskeletal anatomies. In addition, an overview is provided of the key issues wherein clinical applicability is challenging to capture with conventional performance metrics and expert evaluation. When clinically validated, generative adversarial networks have the potential to improve musculoskeletal imaging."
    }
  ];

  function date(daysAgo) {
    const value = new Date();
    value.setDate(value.getDate() - daysAgo);
    return value.toISOString().slice(0, 10);
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
  }

  function mergeArticles(primary, fallback) {
    const articles = new Map(fallback.map((article) => [article.uid, article]));
    primary.forEach((article) => {
      const seeded = articles.get(article.uid);
      const merged = { ...seeded, ...article };
      if (!article.abstract && seeded?.abstract) merged.abstract = seeded.abstract;
      articles.set(article.uid, merged);
    });
    return Array.from(articles.values());
  }

  async function getArticles(daysAgo) {
    const term = `(${TOPIC}) AND ${JOURNALS} AND (${date(daysAgo)}[pdat] : ${date(0)}[pdat])`;
    const search = new URL(`${BASE}esearch.fcgi`);
    search.search = new URLSearchParams({ db: "pubmed", retmode: "json", retmax: "60", sort: "pub date", term });
    const searchData = await fetch(search).then((response) => {
      if (!response.ok) throw new Error("PubMed search failed");
      return response.json();
    });
    const recentIds = searchData.esearchresult.idlist || [];
    const ids = [...new Set([...CURATED_IDS, ...recentIds])];
    if (!ids.length) return [];
    const summary = new URL(`${BASE}esummary.fcgi`);
    summary.search = new URLSearchParams({ db: "pubmed", retmode: "json", id: ids.join(",") });
    const summaryData = await fetch(summary).then((response) => {
      if (!response.ok) throw new Error("PubMed summary failed");
      return response.json();
    });
    const abstractRequest = new URL(`${BASE}efetch.fcgi`);
    abstractRequest.search = new URLSearchParams({ db: "pubmed", id: ids.join(","), retmode: "xml" });
    const abstractXml = await fetch(abstractRequest).then((response) => {
      if (!response.ok) throw new Error("PubMed abstract fetch failed");
      return response.text();
    });
    const document = new DOMParser().parseFromString(abstractXml, "text/xml");
    const abstracts = new Map(Array.from(document.querySelectorAll("PubmedArticle")).map((record) => {
      const id = record.querySelector("PMID")?.textContent;
      const text = Array.from(record.querySelectorAll("Abstract AbstractText")).map((node) => node.textContent?.trim()).filter(Boolean).join(" ");
      return [id, text];
    }));
    return ids.map((id) => ({ ...summaryData.result[id], abstract: abstracts.get(id) || "" })).filter((article) => article.uid);
  }

  function render(target, articles, label, limit = 4) {
    if (!articles.length) {
      target.innerHTML = `<p class="resource-empty">No new matching papers were indexed this week in ${label}. <a href="https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(`${TOPIC} AND ${JOURNALS}`)}" target="_blank" rel="noopener noreferrer">Browse the journal literature on PubMed ↗</a></p>`;
      return;
    }
    target.innerHTML = articles.slice(0, limit).map((article, index) => {
      const authors = (article.authors || []).slice(0, 3).map((author) => author.name).join(", ");
      const citation = [authors, article.source, article.pubdate].filter(Boolean).join(" · ");
      const abstract = article.abstract || "No abstract is available in PubMed for this article.";
      const doi = (article.articleids || []).find((identifier) => identifier.idtype === "doi")?.value;
      const fullText = doi ? `https://doi.org/${encodeURIComponent(doi)}` : `https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(article.uid)}/`;
      return `<article class="resource-item"><span>${String(index + 1).padStart(2, "0")}</span><div><a href="https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(article.uid)}/" target="_blank" rel="noopener noreferrer"><h3>${escapeHtml(article.title)}</h3><p>${escapeHtml(citation)}</p></a><div class="article-abstract"><strong>Abstract</strong><p>${escapeHtml(abstract)}</p></div><div class="article-actions"><a href="https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(article.uid)}/" target="_blank" rel="noopener noreferrer">PubMed record ↗</a><a href="${fullText}" target="_blank" rel="noopener noreferrer">Full text ↗</a></div></div></article>`;
    }).join("");
  }

  const journals = [
    { id: "jvirArticles", source: "J Vasc Interv Radiol", label: "JVIR" },
    { id: "cvirArticles", source: "Cardiovasc Intervent Radiol", label: "CVIR" },
    { id: "radiologyArticles", source: "Radiology", label: "Radiology" },
    { id: "radiographicsArticles", source: "Radiographics", label: "RadioGraphics" },
    { id: "raiArticles", source: "Radiol Artif Intell", label: "Radiology: AI" }
  ];

  function renderAll(articles) {
    journals.forEach((journal) => render(document.getElementById(journal.id), articles.filter((article) => article.source === journal.source), journal.label));
    render(document.getElementById("gaeArticles"), CURATED_GAE.map((id) => articles.find((article) => article.uid === id)).filter(Boolean), "GAE essentials", 6);
  }

  const seeds = mergeArticles([], SEED_ARTICLES);
  render(document.getElementById("gaeArticles"), CURATED_GAE.map((id) => seeds.find((article) => article.uid === id)).filter(Boolean), "GAE essentials", 6);
  render(document.getElementById("raiArticles"), seeds.filter((article) => CURATED_AI.includes(article.uid)), "Radiology: AI", 3);

  (async function () {
    try {
      const stored = JSON.parse(window.localStorage.getItem(CACHE_KEY) || "null");
      const cacheIsFresh = stored && Array.isArray(stored.articles) && (Date.now() - stored.savedAt) < CACHE_DURATION;
      const articles = cacheIsFresh ? mergeArticles(stored.articles, seeds) : mergeArticles(await getArticles(90), seeds);
      if (!cacheIsFresh) window.localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), articles }));
      renderAll(articles);
    } catch (error) {
      const fallback = `<p class="resource-empty">The weekly journal feed is temporarily unavailable. <a href="https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(`${TOPIC} AND ${JOURNALS}`)}" target="_blank" rel="noopener noreferrer">Browse matching articles on PubMed ↗</a></p>`;
      journals.filter((journal) => journal.id !== "raiArticles").forEach((journal) => { document.getElementById(journal.id).innerHTML = fallback; });
    }
  }());
}());
