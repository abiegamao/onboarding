export interface QuestionField {
    key: string
    label: string
    placeholder?: string
    hint?: string
}

export interface QuestionStepConfig {
    stepId: string
    phase: number
    stepLabel: string
    description?: string
    questions: QuestionField[]
}

export const QUESTION_SEEDS: QuestionStepConfig[] = [
    // ─── Phase 1 ────────────────────────────────────────────────────────────────
    {
        stepId: "1B",
        phase: 1,
        stepLabel: "Getting to Know You",
        description: "Personal background and lifestyle questions.",
        questions: [
            {
                key: "favoriteFoodSnacks",
                label: "What's your favorite food and snacks?",
                placeholder: "Example: stuffed mushrooms",
            },
            {
                key: "hobbiesJoy",
                label: "What do you like to do for fun — what hobbies bring you joy?",
                placeholder:
                    "Example: nature, short adventures, dancing, star watching, beach, parks, taking pictures of nature",
            },
            {
                key: "selfCareTop3",
                label: "What are your top 3 favorite things to do for self-care? Choose your Top 3.",
                placeholder:
                    "One per line or comma-separated. Example: Meditation, Nature Walks, Journaling",
            },
            {
                key: "favoriteMoviesShows",
                label: "What are your favorite movies or shows you could rewatch anytime?",
                placeholder: "Example: anything funny",
            },
            {
                key: "dreamDestinationsTop3",
                label: "If you could travel anywhere, what are your top 3 dream destinations you haven't been to yet?",
                placeholder:
                    "One per line or comma-separated. Example: Paris, Dubai, Hawaii",
            },
            {
                key: "financialGoals",
                label: "What are your financial goals for this year and over the next 12 months?",
                placeholder:
                    "Example: learn how to flow off written budget, set a spending plan, start a savings plan",
            },
            {
                key: "bucketListTop3",
                label: "What are the top 3 things on your bucket list?",
                placeholder:
                    "One per line or comma-separated. Example: take a cruise, get on an airplane, visit somewhere I need a passport",
            },
            {
                key: "proudGrowth",
                label: "If we were looking back a year from now, what would make you feel proud of your growth?",
                placeholder:
                    "Example: remain consistent and true to myself without giving up",
            },
            {
                key: "workBusiness",
                label: "Tell me a little about your work or business — what do you love most, and what drains you the most?",
                placeholder: "Share what you love most and what drains you most",
            },
            {
                key: "boundaries",
                label: "When you think about your boundaries with family, friends, and clients, what feels easy for you? What feels hard?",
                placeholder: "Share what feels easy and what feels hard",
            },
            {
                key: "importantPeople",
                label: "Who are the most important people in your life right now?",
                placeholder:
                    "Example: girls, grandbaby, grandmother, family, close connections",
            },
            {
                key: "personalPrinciples",
                label: "What personal principles guide your decisions in life and leadership?",
                placeholder: "Share the principles that guide your decisions",
            },
            {
                key: "uncompromisableStandards",
                label: "What standards do you hold for yourself that you'd never compromise on?",
                placeholder: "Share your non-negotiables",
            },
        ],
    },
    {
        stepId: "1C-1",
        phase: 1,
        stepLabel: "Triage: Self-Care",
        description: "I. Self-Care | Energy, Boundaries & Restoration",
        questions: [
            {
                key: "q1",
                label: "Describe your current self-care rhythm (daily, weekly, seasonal).",
            },
            {
                key: "q2",
                label: "Which practices are non-negotiable for you at this stage of life?",
            },
            {
                key: "q3",
                label: "Where do you most notice fatigue, overextension, or energy loss?",
            },
            {
                key: "q4",
                label: "What aspect of your self-care or personal discipline are you most proud of?",
            },
            {
                key: "q5",
                label: "What single refinement or support would most elevate your self-care right now?",
            },
        ],
    },
    {
        stepId: "1C-2",
        phase: 1,
        stepLabel: "Triage: Wealth Creation",
        description: "II. Wealth Creation | Income, Assets & Stewardship",
        questions: [
            {
                key: "q1",
                label: "Briefly outline your current wealth-building structure (income streams, assets, or ventures).",
            },
            {
                key: "q2",
                label: "What systems or advisors currently support your financial decision-making?",
            },
            {
                key: "q3",
                label: "What feels stable and well-managed, and what feels incomplete or heavy?",
            },
            {
                key: "q4",
                label: "What financial milestone or decision are you most proud of?",
            },
            {
                key: "q5",
                label: "What one area of financial clarity or support would create the greatest peace or momentum?",
            },
        ],
    },
    {
        stepId: "1C-3",
        phase: 1,
        stepLabel: "Triage: Literacy",
        description:
            "III. Literacy | Communication, Discernment & Decision-Making",
        questions: [
            {
                key: "q1",
                label: "How do you currently acquire knowledge or perspective (study, mentorship, faith, learning environments)?",
            },
            {
                key: "q2",
                label: "Where do you feel confident and articulate in your thinking and expression?",
            },
            {
                key: "q3",
                label: "Where do you desire greater clarity, language, or discernment?",
            },
            {
                key: "q4",
                label: "What growth in understanding or communication are you most proud of?",
            },
            {
                key: "q5",
                label: "What single literacy support would most strengthen your leadership right now?",
            },
        ],
    },
    {
        stepId: "1C-4",
        phase: 1,
        stepLabel: "Triage: Actualization",
        description: "IV. Actualization & Purpose | Alignment & Fulfillment",
        questions: [
            {
                key: "q1",
                label: "How would you describe your sense of purpose in this season?",
            },
            {
                key: "q2",
                label: "Which roles or responsibilities feel deeply aligned with who you are becoming?",
            },
            {
                key: "q3",
                label: "Where do you sense misalignment, obligation, or quiet dissatisfaction?",
            },
            {
                key: "q4",
                label: "What purposeful decision or season of alignment are you most proud of?",
            },
            {
                key: "q5",
                label: "What one level of support would help you lead from deeper alignment and ease?",
            },
        ],
    },
    {
        stepId: "1C-5",
        phase: 1,
        stepLabel: "Triage: Succession",
        description: "V. Succession & Legacy | Impact Beyond You",
        questions: [
            {
                key: "q1",
                label: "How have you begun thinking about legacy, succession, or long-term impact?",
            },
            {
                key: "q2",
                label: "What documentation or structures currently exist (estate planning, values, teachings, policies, playbooks)?",
            },
            {
                key: "q3",
                label: "What do you most desire to leave intact, transferable, and meaningful?",
            },
            {
                key: "q4",
                label: "What intentional legacy choice are you most proud of?",
            },
            {
                key: "q5",
                label: "What single area of support is most needed to preserve or document your impact?",
            },
        ],
    },
    {
        stepId: "1C-6",
        phase: 1,
        stepLabel: "Triage: Outreach",
        description: "VI. Outreach & Contribution | Service & Influence",
        questions: [
            {
                key: "q1",
                label: "What communities, causes, or initiatives are you currently contributing to?",
            },
            {
                key: "q2",
                label: "Are there any forms of outreach you feel called to expand or explore?",
            },
            {
                key: "q3",
                label: "How do you desire to steward your time, voice, or resources moving forward?",
            },
            {
                key: "q4",
                label: "What contribution or service are you most proud of?",
            },
            {
                key: "q5",
                label: "What one support refinement would allow you to contribute sustainably?",
            },
        ],
    },
    {
        stepId: "1C-7",
        phase: 1,
        stepLabel: "Triage: Relationships",
        description:
            "VII. Relationships | Priority Connections for This Season",
        questions: [
            {
                key: "q1",
                label: "Identify the five most important relationships to nurture in this season (roles only if preferred).",
            },
            {
                key: "q2",
                label: "What does intentional presence look like within these relationships?",
            },
            {
                key: "q3",
                label: "Where do you sense distance, strain, or a desire for deeper connection?",
            },
            {
                key: "q4",
                label: "What relational boundary, decision, or investment are you most proud of?",
            },
            {
                key: "q5",
                label: "What single relational support would most strengthen your life right now?",
            },
        ],
    },
    {
        stepId: "1C-8",
        phase: 1,
        stepLabel: "Triage: Health",
        description: "VIII. Health | Physical, Emotional & Mental Well-Being",
        questions: [
            {
                key: "q1",
                label: "How would you describe your overall health journey up to this moment?",
            },
            {
                key: "q2",
                label: "What health goals or intentions are currently top priority?",
            },
            {
                key: "q3",
                label: "What challenges (past or present) feel most important for us to be aware of?",
            },
            {
                key: "q4",
                label: "What health choice, recovery, or resilience are you most proud of?",
            },
            {
                key: "q5",
                label: "What one form of health support would most enhance your quality of life?",
            },
        ],
    },
    {
        stepId: "1C-9",
        phase: 1,
        stepLabel: "Triage: Open Reflection",
        description: "IX. Open Reflection | Your Voice",
        questions: [
            {
                key: "q1",
                label: "Please share anything else you desire us to know — context, aspirations, concerns, or insights that feel important but do not fit neatly above.",
            },
        ],
    },
    {
        stepId: "1D",
        phase: 1,
        stepLabel: "Open Share",
        description:
            "A safe space to share anything before the orientation call.",
        questions: [
            {
                key: "openShare",
                label: "Before we meet, is there anything on your heart, your mind, or your plate that you want me to be aware of?",
                placeholder: "Share your thoughts here...",
                hint: "Nothing is too BIG or small for us to hold.",
            },
        ],
    },
    // ─── Phase 2 ────────────────────────────────────────────────────────────────
    {
        stepId: "2B",
        phase: 2,
        stepLabel: "Historical Growth Inputs",
        description:
            "Consolidate breakthroughs from previous leadership or personality assessments.",
        questions: [
            {
                key: "growthTakeaways",
                label: "Key Takeaways & Breakthroughs",
                placeholder:
                    "What patterns or insights have you already uncovered?",
            },
        ],
    },
    {
        stepId: "2C",
        phase: 2,
        stepLabel: "Evening Pulse",
        description: "Release. Reflect. Realign.",
        questions: [
            {
                key: "peaceLevel",
                label: "Current Peace Level",
                hint: "Rate from 1 (Extreme Chaos) to 10 (Deep Peace)",
            },
            {
                key: "whatWentWell",
                label: "What went well today?",
                placeholder: "Celebrate a small win...",
            },
            {
                key: "whatFeltHeavy",
                label: "What felt heavy today?",
                placeholder: "What are you ready to release?",
            },
        ],
    },
    {
        stepId: "2D",
        phase: 2,
        stepLabel: "Home Audit",
        description: "Honest inventory. No judgment. Just clarity.",
        questions: [
            {
                key: "q1",
                label: "What currently feels the most out of control in your home right now?",
                placeholder: "Describe what feels most out of control...",
                hint: "Where is the loudest chaos?",
            },
            {
                key: "q2",
                label: "When during the day do you feel the most overwhelmed — and what is happening at that time?",
                placeholder: "Morning rush? After school? Evening?",
                hint: "Find the pressure points.",
            },
            {
                key: "q3",
                label: "What are the 3-5 things you're mentally tracking every day that no one else is helping with?",
                placeholder: "List the things only you are holding...",
                hint: "This reveals invisible labor.",
            },
            {
                key: "q4",
                label: "If nothing changed, what would your home feel like 90 days from now?",
                placeholder: "Be honest about the trajectory...",
                hint: "Confront the cost of staying stuck.",
            },
            {
                key: "q5",
                label: "What routines currently exist in your home (morning, after school, bedtime) — and are they actually followed?",
                placeholder:
                    "Describe the routines that exist and how consistently they run...",
                hint: "Honest audit, not ideal version.",
            },
            {
                key: "q6",
                label: "Where do things tend to pile up or break down the most?",
                placeholder:
                    "Name the areas or systems that constantly break down...",
                hint: "Laundry, dishes, backpacks, paperwork, schedules, etc.",
            },
            {
                key: "q7",
                label: "What responsibilities are clearly assigned — and what is just 'assumed' you will handle?",
                placeholder:
                    "What's officially yours vs. what just defaults to you?",
                hint: "This is where resentment lives.",
            },
            {
                key: "q8",
                label: "If your family had to describe how the home runs right now in one word, what would it be?",
                placeholder: "One word, then explain...",
                hint: "Chaos, rushed, reactive, peaceful, structured, etc.",
            },
            {
                key: "q9",
                label: "What do your kids (and/or partner) currently own vs. what do they wait for you to direct?",
                placeholder: "What do they own? What do they wait on you for?",
                hint: "Dependency vs. leadership culture.",
            },
            {
                key: "q10",
                label: "Where are you over-functioning — and where should you actually be leading instead of doing?",
                placeholder: "Where are you doing things others should own?",
            },
            {
                key: "q11",
                label: "What would a 'peaceful and well-run home' actually look like for YOU — not Instagram?",
                placeholder:
                    "Describe what peace in your home actually looks like...",
                hint: "Define your version of peace.",
            },
            {
                key: "q12",
                label: "If you could fix just ONE system this week that would make everything feel lighter, what would it be?",
                placeholder: "Name the one thing...",
                hint: "This creates immediate traction.",
            },
            {
                key: "embodiment",
                label: "What's one small change you are willing to commit to this week to move your home toward peace?",
                placeholder: "I commit to...",
                hint: "Step Towards Embodiment — this is where the shift happens.",
            },
        ],
    },
    // ─── Phase 3 ────────────────────────────────────────────────────────────────
    {
        stepId: "3C",
        phase: 3,
        stepLabel: "Ideal Day Narrative",
        description:
            "Walk through your perfect day, from the moment you wake up to the moment you drift off to sleep.",
        questions: [
            {
                key: "idealDayStory",
                label: "Describe your ideal day in full detail.",
                placeholder: "The sun begins to peek through my window...",
            },
        ],
    },
    {
        stepId: "3D",
        phase: 3,
        stepLabel: "Word of the Year",
        description: "What single word will anchor your journey this year?",
        questions: [
            {
                key: "wordOfYear",
                label: "Your word of the year",
                placeholder: "ANCHOR",
            },
        ],
    },
    {
        stepId: "3E",
        phase: 3,
        stepLabel: "Family Mission",
        description:
            "Define the core values and mission that unite your home.",
        questions: [
            {
                key: "missionStatement",
                label: "Mission Statement",
                placeholder: "In this house, we...",
            },
        ],
    },
]

export const QUESTION_SEED_MAP: Record<string, QuestionStepConfig> =
    Object.fromEntries(QUESTION_SEEDS.map((s) => [s.stepId, s]))
