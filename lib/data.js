// ---------------------------------------------------------------------------
// Single source of truth for every piece of content on the site.
// Edit this file and the whole portfolio updates. No component holds copy.
// ---------------------------------------------------------------------------

export const profile = {
  name: "Arjun Gupta",
  first: "Arjun",
  last: "Gupta",
  role: "AI/ML Engineer & Computer Science Student",
  tagline: "Building intelligent systems for a better tomorrow.",
  blurb:
    "BCA student at Kanpur Institute of Technology. I reproduce research papers, ship them as products, and care about the gap between a benchmark number and something a person can actually use.",
  location: "Kanpur, India",
  email: "titanxarestren@gmail.com",
  phone: "+91 9258532276",
  github: "Neural-GPT",
  githubUrl: "https://github.com/Neural-GPT",
  resumeFile: "Arjun_Gupta_Resume.pdf", // drop the PDF into /public
  avatar: "/avatar.jpg", // drop your photo into /public
  keywords: ["AI/ML", "NLP", "RAG", "Computer Vision", "Python", "PyTorch", "FastAPI", "Next.js"],
};

export const education = {
  school: "Kanpur Institute of Technology",
  city: "Kanpur",
  degree: "Bachelor of Computer Applications",
  short: "BCA",
  graduation: "2028",
  coursework: [
    "Data Structures & Algorithms",
    "Machine Learning",
    "Software Engineering",
    "Web Development",
  ],
};

export const highlights = [
  "Research intern at IIT Bhubaneswar — NLP / RAG",
  "Paid ML internship at IIT Roorkee incoming (Nov 2026)",
  "LeetTrack: 150+ students, 3+ instructors on campus",
  "PatchCore reproduction at 0.99 AUC on MVTec AD",
  "Nominee, JST Sakura Science Exchange (Japan)",
];

export const nav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Research", href: "#research" },
  { label: "Skills", href: "#skills" },
  { label: "Activity", href: "#activity" },
  { label: "Contact", href: "#contact" },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const projects = [
  {
    id: "leettrack",
    name: "LeetTrack",
    subtitle: "DSA preparation platform",
    date: "August 2026",
    summary:
      "Full-stack assignment platform for DSA practice, adopted by 150+ students and 3+ instructors across my university.",
    bullets: [
      "Teacher-assigned LeetCode problem tracking, competitive leaderboards and deadline management.",
      "OTP-based student authentication, feedback system, public chat and notifications.",
      "Nemotron 3 Ultra 550B wired in over the NVIDIA API to generate contextual hints instead of answers.",
    ],
    stack: ["FastAPI", "Next.js", "PostgreSQL", "Google OAuth", "Render"],
    metric: { value: "150+", label: "students onboard" },
    links: [{ label: "Live site", href: "https://leettrack-cyan.vercel.app" }],
    accent: "cyan",
    featured: true,
  },
  {
    id: "jal-rakshak",
    name: "Jal Rakshak",
    subtitle: "Smart water tank overflow detection",
    date: "June 2026",
    summary:
      "Real-time overflow detection that classifies tank-fill sounds from a wireless mic, trained on 28 minutes of audio I recorded at home.",
    bullets: [
      "Custom self-recorded dataset of tank-fill audio; YAMNet embeddings for classification.",
      "Deployed to Android and Windows with an auto-train loop that retrains on user-labeled clips.",
      "Accuracy keeps improving after deployment rather than freezing at ship time.",
    ],
    stack: ["TensorFlow", "YAMNet", "Flutter", "Android SDK"],
    metric: { value: "28 min", label: "hand-recorded dataset" },
    links: [{ label: "Source", href: "https://github.com/Neural-GPT/Jal-Rakshak" }],
    accent: "sky",
    featured: true,
  },
  {
    id: "patchcore",
    name: "Industrial Anomaly Detection",
    subtitle: "PatchCore reproduction",
    date: "March 2026",
    summary:
      "Reproduced the PatchCore anomaly detection paper on MVTec AD, reaching 0.99 AUC with WideResNet50 features.",
    bullets: [
      "Coreset subsampling and KNN anomaly scoring implemented from scratch.",
      "Memory bank shrunk by more than 90% with negligible loss in detection accuracy.",
    ],
    stack: ["Python", "PyTorch", "WideResNet50"],
    metric: { value: "0.99", label: "AUC on MVTec AD" },
    links: [
      {
        label: "Source",
        href: "https://github.com/Neural-GPT/Industrial-Anomaly-Detection-With-PatchCore",
      },
    ],
    accent: "cyan",
    featured: true,
  },
  {
    id: "smart-attendance",
    name: "Smart Attendance System",
    subtitle: "On-device face recognition",
    date: "October 2025",
    summary:
      "Mobile attendance pipeline built around MobileNetV2, tuned to work from a deliberately tiny 50-sample dataset.",
    bullets: [
      "Optimized MobileNetV2 for low-compute mobile inference under a hard 50-sample constraint.",
      "Flutter + Android SDK pipeline running inference locally, with no round trip to a server.",
    ],
    stack: ["TensorFlow", "MobileNetV2", "Flutter", "Android SDK"],
    metric: { value: "50", label: "training samples" },
    links: [
      { label: "Source", href: "https://github.com/Neural-GPT/Aviothic2.0_ActoProtector" },
    ],
    accent: "sky",
    featured: true,
  },
];

export const openSource = {
  repo: "ml-recipes-py",
  href: "https://github.com/cutewizzy11/ml-recipes-py/commit/2b4fafdf71874e54a063cef6bbf78875943cc99b",
  summary:
    "Merged a standardized ML pipeline — structured EDA, automated feature preprocessing and a Logistic Regression baseline — to set the repo's code patterns and documentation conventions.",
};

// ---------------------------------------------------------------------------
// Research & experience timeline
// ---------------------------------------------------------------------------

export const research = [
  {
    id: "iitbbs",
    period: "Apr 2026 — Jul 2026",
    role: "Research Intern, NLP / RAG",
    org: "IIT Bhubaneswar",
    status: "completed",
    href: "https://drive.google.com/drive/folders/1NsWXO1TL9nWFS0ILk4g8y5wJxj0vW2cz",
    bullets: [
      "Implemented and benchmarked advanced RAG chunking strategies from the KET-RAG paper.",
      "Reproduced DynaBERT-style transformer compression under fixed hardware and latency budgets.",
      "Width- and depth-adaptive compression at 0.75× on RoBERTa-base: 21.3% smaller, 1.78× faster inference, 94.6% of baseline accuracy retained on QQP.",
    ],
    stats: [
      { value: "21.3%", label: "smaller model" },
      { value: "1.78×", label: "inference speedup" },
      { value: "94.6%", label: "accuracy retained" },
    ],
  },
  {
    id: "iitr",
    period: "Nov 2026 — Dec 2026",
    role: "Machine Learning in FinTech",
    org: "IIT Roorkee",
    status: "upcoming",
    bullets: ["Paid internship starting November 2026."],
    stats: [],
  },
  {
    id: "sakura",
    period: "Results Nov 2026",
    role: "Nominee, JST Sakura Science Exchange",
    org: "Iwate Prefectural University, Japan",
    status: "pending",
    bullets: [
      "Nominated by the host university for a JST-funded research exchange in advanced computing.",
      "Selection results pending November 2026; potential fully-funded visit in January 2027.",
    ],
    stats: [],
  },
];

export const certifications = [
  {
    name: "Machine Learning Specialization",
    issuer: "Stanford University",
    href: "https://drive.google.com/file/d/1SJmL6cd5VPdsy1M9UCvvKvQ4gYV-nhVl/view?usp=drive_link",
  },
  {
    name: "Deep Learning for Computer Vision and NLP",
    issuer: "IIT Guwahati",
    href: "https://drive.google.com/file/d/1UVNX0Q6NCoV2p16y5wm48j_lO1wFVOOJ/view?usp=drive_link",
  },
];

// ---------------------------------------------------------------------------
// Skills — shaped for Recharts (radar + radial)
// ---------------------------------------------------------------------------

export const skillGroups = [
  {
    id: "ml",
    label: "Machine learning",
    color: "#22d3ee",
    data: [
      { axis: "PyTorch", value: 88 },
      { axis: "TensorFlow", value: 82 },
      { axis: "HuggingFace", value: 80 },
      { axis: "Scikit-learn", value: 84 },
      { axis: "XGBoost", value: 70 },
      { axis: "NumPy / Pandas", value: 90 },
    ],
  },
  {
    id: "concepts",
    label: "Concepts",
    color: "#7dd3fc",
    data: [
      { axis: "RAG", value: 88 },
      { axis: "Transformers", value: 84 },
      { axis: "NLP", value: 82 },
      { axis: "CNNs", value: 84 },
      { axis: "Anomaly detection", value: 86 },
      { axis: "Transfer learning", value: 80 },
    ],
  },
  {
    id: "web",
    label: "Web & deployment",
    color: "#a78bfa",
    data: [
      { axis: "FastAPI", value: 86 },
      { axis: "Next.js", value: 80 },
      { axis: "PostgreSQL", value: 76 },
      { axis: "HTML / CSS", value: 82 },
      { axis: "Render", value: 78 },
      { axis: "Vercel", value: 80 },
    ],
  },
  {
    id: "lang",
    label: "Languages & tools",
    color: "#f472b6",
    data: [
      { axis: "Python", value: 92 },
      { axis: "JavaScript", value: 78 },
      { axis: "C", value: 70 },
      { axis: "Git / GitHub", value: 85 },
      { axis: "Jupyter", value: 88 },
      { axis: "DSA", value: 78 },
    ],
  },
];

// Where the time actually goes — drives the radial "focus" chart.
export const focusSplit = [
  { name: "Research & papers", value: 32, fill: "#22d3ee" },
  { name: "Product / full-stack", value: 26, fill: "#7dd3fc" },
  { name: "Computer vision", value: 18, fill: "#a78bfa" },
  { name: "NLP & RAG", value: 24, fill: "#f472b6" },
];

export const skillList = {
  Languages: ["Python", "JavaScript", "C"],
  "Machine learning": [
    "PyTorch",
    "TensorFlow",
    "Scikit-learn",
    "XGBoost",
    "HuggingFace",
    "NumPy",
    "Pandas",
  ],
  "Web & deployment": [
    "FastAPI",
    "Next.js",
    "HTML/CSS",
    "Render",
    "Vercel",
    "PostgreSQL",
  ],
  Concepts: [
    "Retrieval-Augmented Generation",
    "Transfer Learning",
    "CNNs",
    "Anomaly Detection",
    "Transformers",
    "NLP",
    "DSA in Python",
  ],
  Tools: ["Jupyter", "Git", "GitHub", "VS Code"],
};
