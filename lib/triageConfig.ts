export interface TriageQuestion {
    key: string
    text: string
}

export interface TriageDomainConfig {
    stepId: string
    key: string
    title: string
    questions: TriageQuestion[]
}

export const TRIAGE_DOMAINS: TriageDomainConfig[] = [
    {
        stepId: "1C-1",
        key: "selfCare",
        title: "I. Self-Care | Energy, Boundaries & Restoration",
        questions: [
            {
                key: "q1",
                text: "Describe your current self-care rhythm (daily, weekly, seasonal).",
            },
            {
                key: "q2",
                text: "Which practices are non-negotiable for you at this stage of life?",
            },
            {
                key: "q3",
                text: "Where do you most notice fatigue, overextension, or energy loss?",
            },
            {
                key: "q4",
                text: "What aspect of your self-care or personal discipline are you most proud of?",
            },
            {
                key: "q5",
                text: "What single refinement or support would most elevate your self-care right now?",
            },
        ],
    },
    {
        stepId: "1C-2",
        key: "wealthCreation",
        title: "II. Wealth Creation | Income, Assets & Stewardship",
        questions: [
            {
                key: "q1",
                text: "Briefly outline your current wealth-building structure (income streams, assets, or ventures).",
            },
            {
                key: "q2",
                text: "What systems or advisors currently support your financial decision-making?",
            },
            {
                key: "q3",
                text: "What feels stable and well-managed, and what feels incomplete or heavy?",
            },
            {
                key: "q4",
                text: "What financial milestone or decision are you most proud of?",
            },
            {
                key: "q5",
                text: "What one area of financial clarity or support would create the greatest peace or momentum?",
            },
        ],
    },
    {
        stepId: "1C-3",
        key: "literacy",
        title: "III. Literacy | Communication, Discernment & Decision-Making",
        questions: [
            {
                key: "q1",
                text: "How do you currently acquire knowledge or perspective (study, mentorship, faith, learning environments)?",
            },
            {
                key: "q2",
                text: "Where do you feel confident and articulate in your thinking and expression?",
            },
            {
                key: "q3",
                text: "Where do you desire greater clarity, language, or discernment?",
            },
            {
                key: "q4",
                text: "What growth in understanding or communication are you most proud of?",
            },
            {
                key: "q5",
                text: "What single literacy support would most strengthen your leadership right now?",
            },
        ],
    },
    {
        stepId: "1C-4",
        key: "actualization",
        title: "IV. Actualization & Purpose | Alignment & Fulfillment",
        questions: [
            {
                key: "q1",
                text: "How would you describe your sense of purpose in this season?",
            },
            {
                key: "q2",
                text: "Which roles or responsibilities feel deeply aligned with who you are becoming?",
            },
            {
                key: "q3",
                text: "Where do you sense misalignment, obligation, or quiet dissatisfaction?",
            },
            {
                key: "q4",
                text: "What purposeful decision or season of alignment are you most proud of?",
            },
            {
                key: "q5",
                text: "What one level of support would help you lead from deeper alignment and ease?",
            },
        ],
    },
    {
        stepId: "1C-5",
        key: "succession",
        title: "V. Succession & Legacy | Impact Beyond You",
        questions: [
            {
                key: "q1",
                text: "How have you begun thinking about legacy, succession, or long-term impact?",
            },
            {
                key: "q2",
                text: "What documentation or structures currently exist (estate planning, values, teachings, policies, playbooks)?",
            },
            {
                key: "q3",
                text: "What do you most desire to leave intact, transferable, and meaningful?",
            },
            {
                key: "q4",
                text: "What intentional legacy choice are you most proud of?",
            },
            {
                key: "q5",
                text: "What single area of support is most needed to preserve or document your impact?",
            },
        ],
    },
    {
        stepId: "1C-6",
        key: "outreach",
        title: "VI. Outreach & Contribution | Service & Influence",
        questions: [
            {
                key: "q1",
                text: "What communities, causes, or initiatives are you currently contributing to?",
            },
            {
                key: "q2",
                text: "Are there any forms of outreach you feel called to expand or explore?",
            },
            {
                key: "q3",
                text: "How do you desire to steward your time, voice, or resources moving forward?",
            },
            {
                key: "q4",
                text: "What contribution or service are you most proud of?",
            },
            {
                key: "q5",
                text: "What one support refinement would allow you to contribute sustainably?",
            },
        ],
    },
    {
        stepId: "1C-7",
        key: "relationships",
        title: "VII. Relationships | Priority Connections for This Season",
        questions: [
            {
                key: "q1",
                text: "Identify the five most important relationships to nurture in this season (roles only if preferred).",
            },
            {
                key: "q2",
                text: "What does intentional presence look like within these relationships?",
            },
            {
                key: "q3",
                text: "Where do you sense distance, strain, or a desire for deeper connection?",
            },
            {
                key: "q4",
                text: "What relational boundary, decision, or investment are you most proud of?",
            },
            {
                key: "q5",
                text: "What single relational support would most strengthen your life right now?",
            },
        ],
    },
    {
        stepId: "1C-8",
        key: "health",
        title: "VIII. Health | Physical, Emotional & Mental Well-Being",
        questions: [
            {
                key: "q1",
                text: "How would you describe your overall health journey up to this moment?",
            },
            {
                key: "q2",
                text: "What health goals or intentions are currently top priority?",
            },
            {
                key: "q3",
                text: "What challenges (past or present) feel most important for us to be aware of?",
            },
            {
                key: "q4",
                text: "What health choice, recovery, or resilience are you most proud of?",
            },
            {
                key: "q5",
                text: "What one form of health support would most enhance your quality of life?",
            },
        ],
    },
    {
        stepId: "1C-9",
        key: "openReflection",
        title: "IX. Open Reflection | Your Voice",
        questions: [
            {
                key: "q1",
                text: "Please share anything else you desire us to know — context, aspirations, concerns, or insights that feel important but do not fit neatly above.",
            },
        ],
    },
]

export const STEP_TO_DOMAIN: Record<string, TriageDomainConfig> =
    Object.fromEntries(TRIAGE_DOMAINS.map((d) => [d.stepId, d]))
