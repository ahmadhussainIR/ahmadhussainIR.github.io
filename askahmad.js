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
            keywords: ["research", "publication", "publish", "abstract", "paper", "manuscript", "project"],
            response:
                "Start with a narrow, clinically useful question—not a broad topic. Define one patient population, one intervention or exposure, one comparison when relevant, and one primary outcome. Read 5–10 recent papers first so you can identify what is already known and where the gap is. Then create a one-page project brief with the question, study design, data source, inclusion/exclusion criteria, planned variables, timeline, and the role you can realistically own. For a first project, a focused retrospective review, systematic review, case report, or quality-improvement study is often more achievable than a large prospective trial. Aim to finish a clean abstract or poster before building toward a manuscript."
        },
        {
            keywords: ["usmle", "step", "uworld", "nbme", "exam", "board"],
            response:
                "Build your USMLE plan around questions and review, rather than passive reading. Start with a baseline assessment, choose a realistic exam window, and divide your preparation into foundation-building, mixed timed blocks, and final assessment phases. Review every incorrect answer deeply: identify the concept, why your choice was tempting, and the clue that should have changed your decision. Use spaced repetition for persistent weaknesses and take regular NBME-style assessments to guide—not merely score—your plan. Protect sleep, exercise, and one sustainable day off when needed; consistency over several months matters more than a perfect but unrepeatable schedule."
        },
        {
            keywords: ["career", "radiology", "interventional", "ir", "residency", "match"],
            response:
                "For a radiology or IR career, develop a coherent narrative rather than a list of disconnected activities. Build it around clinical exposure, mentors, research, presentations, teaching or service, and a genuine understanding of the specialty. Shadow early and keep a log of procedures, anatomy, patient conversations, and questions that stayed with you. Join a departmental conference or interest group, look for a manageable project with a mentor, and learn to present your work clearly. When it is time to apply, your CV and personal statement should show why image-guided diagnosis or therapy fits your way of thinking—not simply that you accumulated experiences."
        },
        {
            keywords: ["cv", "resume", "application", "eras"],
            response:
                "A strong CV is easy to scan, accurate, and specific about your contribution. Use clear sections for education, clinical experience, research, publications, presentations, leadership, service, awards, and technical skills. In each role, write what you actually did and what resulted: screened patients, performed chart review, analyzed imaging, built a database, drafted a manuscript, taught students, or presented findings. Keep citation formatting consistent and separate published work from abstracts, manuscripts under review, and works in progress. For ERAS or residency applications, tailor the most meaningful experiences so the reader understands your role, growth, and the connection to your future specialty."
        },
        {
            keywords: ["mentor", "mentorship", "email", "network", "connect"],
            response:
                "Good mentorship outreach is short, respectful, and specific. In the first paragraph, say who you are and your current stage. In the second, mention one concrete aspect of the person’s work that interests you; avoid generic praise. Then explain what you hope to learn or contribute, and make a low-pressure request such as a 15-minute conversation or advice on one starter project. Attach a clean one-page CV if appropriate, follow up once after about a week, and always arrive prepared with questions. The best mentor relationships grow from reliability: complete small tasks well, communicate early if you are delayed, and show appreciation for feedback."
        },
        {
            keywords: ["elective", "rotation", "observer", "shadow", "clinical"],
            response:
                "Choose electives and observerships where you can see the specialty’s full workflow: consults, pre-procedure planning, imaging review, the procedure suite, follow-up, and multidisciplinary conferences. Before each day, review the common procedures and relevant anatomy; after it, record what you observed, what clinical question led to the intervention, and one point to read about. Be helpful, punctual, and attentive to patient privacy. Thoughtful questions at appropriate moments are more valuable than trying to impress people with volume. At the end of the experience, thank your supervisors, ask for targeted feedback, and keep a concise record of meaningful cases for your CV and future interviews."
        },
        {
            keywords: ["data", "analysis", "statistics", "r", "python", "spss"],
            response:
                "For clinical research, the first data skill is translating a clinical idea into a defensible analysis plan. Learn descriptive statistics, study populations and bias, confidence intervals, common group comparisons, regression basics, survival analysis when relevant, and clear data visualization. R or Python can make your work reproducible, but software should follow the question—not drive it. Before analyzing anything, define the primary outcome, exposure, covariates, missing-data approach, and how you will check assumptions. Keep a data dictionary and version-controlled analysis notes so someone else can understand your work. When in doubt, involve a statistician early, especially before collecting data or testing multiple outcomes."
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

        return "Good question. I would break it into three steps: clarify your goal, find one mentor or senior student who has done it, and choose a small next action you can finish this week. You can ask me more specifically about research, USMLE, radiology, CVs, electives, or mentorship.";
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
