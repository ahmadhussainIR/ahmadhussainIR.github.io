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
                "Start with a focused question, not a huge topic. Pick one disease, one intervention, one outcome, or one imaging finding. A practical path is: read 5-10 recent papers, write a one-page idea, find a mentor, define the dataset, then aim first for an abstract or poster before a full manuscript."
        },
        {
            keywords: ["usmle", "step", "uworld", "nbme", "exam", "board"],
            response:
                "For USMLE planning, build around active recall and question blocks. Start with a diagnostic baseline, set a realistic test date, use UWorld/NBME-style questions as the center, and review mistakes deeply. The best schedule is the one you can repeat consistently without burning out."
        },
        {
            keywords: ["career", "radiology", "interventional", "ir", "residency", "match"],
            response:
                "For a radiology or IR career, show a clear pattern: clinical exposure, research, mentorship, presentations, and service. Try to shadow early, join radiology conferences or interest groups, document your projects, and build a narrative around why image-guided diagnosis or therapy fits you."
        },
        {
            keywords: ["cv", "resume", "application", "eras"],
            response:
                "A strong CV is organized and specific. Separate publications, abstracts, leadership, volunteering, clinical experience, and skills. For each role, show what you actually did: coordinated patients, analyzed imaging, wrote abstracts, built a student group, taught peers, or presented work."
        },
        {
            keywords: ["mentor", "mentorship", "email", "network", "connect"],
            response:
                "When contacting a mentor, keep it short and specific. Mention who you are, why their work interests you, what skill you can contribute, and ask for a 15-minute meeting or one starter project. Attach a clean CV and suggest 2-3 possible meeting times."
        },
        {
            keywords: ["elective", "rotation", "observer", "shadow", "clinical"],
            response:
                "For electives or shadowing, look for places where you can observe procedures, attend conferences, and ask thoughtful questions. After each day, write down procedures you saw, anatomy learned, and one follow-up question. That habit turns exposure into real growth."
        },
        {
            keywords: ["data", "analysis", "statistics", "r", "python", "spss"],
            response:
                "For data skills, learn enough statistics to answer clinical questions clearly: descriptive stats, group comparisons, regression basics, and good visualization. R or Python is great, but the real skill is knowing what question your analysis is answering."
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
