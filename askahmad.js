(function () {
    const form = document.getElementById("askAhmadForm");
    const input = document.getElementById("askAhmadInput");
    const messages = document.getElementById("askAhmadMessages");
    const chips = document.querySelectorAll(".prompt-chips button");

    if (!form || !input || !messages) {
        return;
    }

    const answers = [
        {
            keywords: ["step 1", "step one"],
            response:
                "For USMLE Step 1, begin with a baseline assessment and build a schedule around your available weeks. Phase 1: review core systems while completing targeted question blocks; use one main reference and avoid collecting too many resources. Phase 2: move to mixed, timed questions and review every incorrect answer by identifying the missed concept, the clue you overlooked, and why your chosen option was tempting. Phase 3: take regular NBME-style assessments, focus on recurring weak areas, and practice full testing days. Keep a short error log, use spaced repetition only for facts you repeatedly miss, and protect sleep and exercise. Because Step 1 is pass/fail, the goal is a reliable passing margin across more than one practice exam—not chasing perfect resource completion."
        },
        {
            keywords: ["step 2", "step two", "step 2 ck"],
            response:
                "For USMLE Step 2 CK, make clinical questions the center of preparation. Phase 1: complete system-based blocks while reviewing diagnosis, next-best-step management, screening, ethics, and patient safety. Phase 2: switch to mixed timed blocks and train yourself to identify the clinical task before looking at the options. Phase 3: use NBME and self-assessment results to target weak specialties and improve pacing. Maintain an error log organized by reasoning failure—knowledge gap, misread clue, changed correct answer, or poor time management. Review algorithms and preventive-care guidance repeatedly. Schedule the exam only when several recent assessments support your target range and you can complete full blocks without losing accuracy late in the day."
        },
        {
            keywords: ["step 3", "step three"],
            response:
                "For USMLE Step 3, prepare around both multiple-choice reasoning and CCS case management. First, refresh common outpatient, inpatient, emergency, preventive-care, ethics, and biostatistics topics. Second, complete mixed timed question blocks while practicing CCS cases several times each week. For CCS, learn to stabilize the patient, order focused tests, begin appropriate treatment, reassess the response, and arrange follow-up without unnecessary interventions. Third, simulate the two-day format so fatigue and pacing are familiar. Keep a concise list of missed management decisions and review it regularly. If you are preparing during residency or research training, use a smaller daily target that you can sustain rather than relying on an unrealistic final-week sprint."
        },
        {
            keywords: ["observership", "observership email", "observer email", "email for observership", "cold email", "observership outreach"],
            response:
                "An observership email should be brief, individualized, and easy to answer. Use a subject such as “Medical graduate seeking IR observership — [preferred dates].” Introduce yourself in one sentence with your school, current role, and career interest. Mention one specific clinical or research area from the physician or department that genuinely connects with your goals. State the exact experience you are requesting, your date range, and whether you need sponsorship or institutional paperwork. A useful core request is: “If your department permits observers, I would be grateful for the opportunity to observe your service during [dates] and learn more about [specific area].” Attach a clean CV, thank them for their time, and follow up once after 7–10 days. Do not send the same generic message to many faculty members or imply that an observership guarantees a recommendation."
        },
        {
            keywords: ["elective", "rotation", "observer", "shadow", "clinical exposure"],
            response:
                "Choose electives that provide meaningful exposure to the specialty’s full workflow rather than only a famous institution’s name. Before applying, confirm eligibility, dates, fees, visa requirements, malpractice coverage, immunizations, and whether the experience is hands-on or observational. Prioritize rotations where you can attend consults, review imaging, observe procedures, join conferences, and receive feedback. Before each day, review the relevant anatomy, indications, contraindications, and common complications. Keep a private learning log without patient identifiers. Be punctual, helpful, and thoughtful about when to ask questions. Near the end, request specific feedback and ask whether the supervisor would feel comfortable supporting your application. Send a concise thank-you message and maintain the relationship with occasional meaningful updates."
        },
        {
            keywords: ["data", "analysis", "statistics", "biostatistics", "r programming", "python", "spss"],
            response:
                "For clinical research, the first data skill is translating a clinical idea into a defensible analysis plan. Step 1: define the study population, exposure or intervention, comparison, primary outcome, time window, and important sources of bias. Step 2: create a data dictionary and prespecified plan covering descriptive statistics, missing data, group comparisons, covariates, assumption checks, and any regression or survival analysis. Step 3: produce reproducible tables, figures, and code with version-controlled notes so another researcher can follow the work. Learn confidence intervals, effect sizes, common statistical tests, regression basics, and survival analysis when relevant. R or Python can improve reproducibility, but the software should follow the question—not drive it. Involve a statistician before data collection whenever possible, especially for sample-size planning or multiple outcomes."
        },
        {
            keywords: ["career", "radiology", "interventional", "ir career", "residency", "match"],
            response:
                "Build a radiology or IR career in three layers. First, gain informed exposure through shadowing, electives, multidisciplinary conferences, and conversations with residents and faculty; keep notes on the clinical problems, procedures, and patient interactions that genuinely interest you. Second, develop evidence of commitment through one reliable mentor relationship, a focused research project, teaching or service, and presentations when appropriate. Learn anatomy, imaging fundamentals, procedural indications, complications, and the longitudinal role of IR in patient care. Third, translate those experiences into a coherent application narrative. Your CV, personal statement, and interviews should explain why the specialty fits how you think and work, not merely list activities. Seek honest feedback early, understand the training pathway for your applicant category, and keep a parallel plan for strengthening any gaps."
        },
        {
            keywords: ["mentor", "mentorship", "network", "connect", "faculty email"],
            response:
                "Approach mentorship as a professional relationship built through small, reliable contributions. First, identify people whose clinical or research work overlaps with a specific interest of yours. Second, send a short email introducing your current stage, naming the relevant work, and requesting either a brief conversation or advice about one realistic starter task. Attach a one-page CV when appropriate. Third, prepare for the meeting with two or three focused questions and leave with a clearly defined next action. Follow up once after about a week if there is no reply. Once someone helps you, communicate progress, meet deadlines, ask for clarification early, and credit everyone appropriately. A strong mentorship relationship usually grows from consistent work rather than repeated requests for opportunities."
        },
        {
            keywords: ["systematic review", "meta-analysis", "literature review"],
            response:
                "For a systematic review, start by confirming that the question is useful and not already answered by a recent high-quality review. Define the population, intervention or exposure, comparator, outcomes, eligible designs, and date or language limits before searching. Write a protocol, develop the search with a librarian when possible, and use two reviewers for screening and data extraction. Record exclusion reasons, assess risk of bias with an appropriate tool, and decide whether the studies are sufficiently similar for meta-analysis. Do not pool studies simply because software allows it. Report the search and selection transparently, interpret heterogeneity and certainty, and keep the screening log, extraction sheet, analysis code, and manuscript versions organized from the beginning."
        },
        {
            keywords: ["publication", "publish", "abstract", "paper", "manuscript", "conference", "authorship"],
            response:
                "Turn a project into a publication by planning the output early. Start with a narrow question and agree on the study design, primary outcome, timeline, responsibilities, and authorship expectations with the team. Build a one-page protocol, obtain the necessary ethics approval, and create a clean data dictionary before extraction. Once the analysis is complete, make the tables and figures first; they will clarify the story the manuscript needs to tell. Draft the methods and results before the introduction and discussion. For a conference abstract, follow the meeting’s exact structure and word limit, report actual results, and avoid conclusions that exceed the data. Select a journal based on scope and audience, follow its author instructions, and respond to reviewers point by point with a professional revision letter."
        },
        {
            keywords: ["cv", "resume", "application", "eras"],
            response:
                "A strong medical CV is accurate, consistent, and easy to scan. Use sections for education, clinical experience, research, publications, presentations, leadership, service, awards, and relevant technical skills. Separate peer-reviewed publications from abstracts, manuscripts under review, and ongoing projects. For each role, state your actual contribution—patient screening, chart review, imaging analysis, database design, statistics, manuscript drafting, teaching, or coordination—and include a result when one exists. Use one citation style throughout, verify every date and DOI, and avoid inflated titles. Keep a master CV, then create a shorter version tailored to observerships, research positions, or residency. Your most meaningful experiences should show responsibility, growth, and connection to your future specialty."
        },
        {
            keywords: ["research", "project", "clinical study", "clinical research"],
            response:
                "Start clinical research in three steps. Step 1: choose one narrow, clinically relevant question and read 5–10 recent papers to understand what is known, what remains uncertain, and whether the data are realistically available. Step 2: write a one-page project brief covering the population, exposure or intervention, comparison, primary outcome, study design, inclusion and exclusion criteria, variables, ethics requirements, timeline, and your specific role. Step 3: agree on responsibilities with a mentor, build the data dictionary, obtain approval before accessing patient data, and begin with a small pilot sample to identify problems. For a first project, a focused retrospective study, systematic review, case report, or quality-improvement project is often more manageable than a prospective trial. Aim for a completed, defensible output rather than joining many unfinished projects."
        },
        {
            keywords: ["personal statement", "interview", "letter of recommendation", "recommendation"],
            response:
                "For application writing and interviews, identify two or three experiences that explain your direction, growth, and readiness. A personal statement should connect those experiences into a clear narrative without repeating the CV. Use concrete moments, explain what you learned, and show why the specialty fits your values and working style. For recommendation letters, ask someone who has directly observed your work and give them your CV, goals, deadline, and a short summary of projects you completed together. Prepare interview answers around specific examples of teamwork, setbacks, feedback, ethical judgment, and curiosity. Keep the tone honest and professional; specificity is more convincing than exaggerated claims."
        }
    ];

    function addMessage(role, text) {
        const message = document.createElement("div");
        message.className = `chat-message ${role}`;

        const label = document.createElement("strong");
        label.textContent = role === "user" ? "You" : "askAhmad";

        const body = document.createElement("span");
        body.textContent = text;

        message.append(label, body);
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

    function addEmailFollowUp(question) {
        const followUp = document.createElement("a");
        const subject = "Question from Ask Ahmad";
        const body = `Hello Ahmad,\n\nI have a follow-up question from your website:\n\n${question}\n\nThank you.`;
        followUp.className = "chat-follow-up";
        followUp.href = `mailto:ahussain8@bwh.harvard.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        followUp.textContent = "More questions? Email Ahmad directly ↗";
        messages.appendChild(followUp);
        messages.scrollTop = messages.scrollHeight;
    }

    function getAnswer(question) {
        const normalized = question.toLowerCase();
        const match = answers.find((item) => item.keywords.some((keyword) => normalized.includes(keyword)));

        if (match) {
            return match.response;
        }

        return "I would approach this in three steps: define the exact goal and your current stage, identify the most relevant mentor or reliable source, and choose one concrete action you can complete this week. Ask a more specific question about USMLE Step 1, Step 2 CK, Step 3, clinical research, data analysis, radiology or IR careers, observership emails, electives, mentorship, publications, CVs, or applications for a detailed answer.";
    }

    function ask(question) {
        const trimmed = question.trim();
        if (!trimmed) {
            return;
        }

        addMessage("user", trimmed);
        input.value = "";

        window.setTimeout(() => {
            addMessage("bot", getAnswer(trimmed));
            addEmailFollowUp(trimmed);
        }, 260);
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        ask(input.value);
    });

    chips.forEach((chip) => {
        chip.addEventListener("click", () => {
            ask(chip.dataset.question || chip.textContent || "");
        });
    });
}());
