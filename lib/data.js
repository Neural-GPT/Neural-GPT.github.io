// ---------------------------------------------------------------------------
// Single source of truth for every piece of content on the site.
// Edit this file and the whole portfolio updates. No component holds copy.
// ---------------------------------------------------------------------------

export const profile = {
  name: "Arjun Gupta",
  first: "Arjun",
  last: "Gupta",
  role: "ML Research Intern & CS Student",
  tagline: "I reproduce ML papers, then find out what breaks.",
  blurb:
    "BCA student at Kanpur Institute of Technology. I take a paper, rebuild it, and check whether the result still holds on real data and real hardware. Lately that has meant transformer compression, EEG decoding and anomaly detection.",
  location: "Kanpur, India",
  email: "titanxarestren@gmail.com",
  phone: "+91 9258532276",
  github: "Neural-GPT",
  githubUrl: "https://github.com/Neural-GPT",
  resumeFile: "Arjun_Gupta_Resume.pdf", // drop the PDF into /public
  avatar: "/avatar.jpg", // drop your photo into /public
  keywords: ["AI/ML", "NLP", "RAG", "Computer Vision", "EEG decoding", "Python", "PyTorch"],
};

export const education = {
  school: "Kanpur Institute of Technology",
  city: "Kanpur",
  degree: "Bachelor of Computer Applications",
  short: "BCA",
  graduation: "2028",
  coursework: [
    "Linear Algebra",
    "Calculus",
    "Data Structures & Algorithms",
    "Machine Learning",
    "Software Engineering",
  ],
};

export const highlights = [
  "Research intern at IIT Bhubaneswar (NLP and RAG), April to July 2026",
  "ML intern at IIT Roorkee's Financial Analytics Lab, building Bloomberg and GDELT pipelines",
  "JST Sakura Science Exchange confirmed: a week in Japan at Iwate Prefectural University, January 2027",
  "PatchCore reproduced at 0.99 AUC on MVTec AD",
  "NeuroVision: 18.6% top-1 zero-shot retrieval from raw EEG",
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
    id: "neurovision",
    name: "NeuroVision",
    subtitle: "EEG to image retrieval",
    date: "October 2026",
    summary:
      "Works out what someone was looking at from their EEG. A small CNN encoder learns to land near frozen ResNet-50 features, then has to pick the right image out of 200 it has never seen.",
    bullets: [
      "Trained with a contrastive InfoNCE loss on THINGS-EEG2. Zero-shot, it picks the right image first 18.6% of the time and puts it in the top five 43.8% of the time (chance is 0.5% and 2.5%).",
      "Beats a ridge-regression baseline, which manages 14.2% top-1.",
      "The signal lives in the first 400 ms. Top-1 is 9.8% for 0–200 ms, 11.9% for 200–400 ms, and only 1.5% for 400–790 ms.",
    ],
    stack: ["PyTorch", "SciPy", "EEG", "ResNet-50"],
    metric: { value: "18.6%", label: "top-1 on 200 unseen images" },
    links: [{ label: "Source", href: "https://github.com/Neural-GPT/NeuroVision" }],
    accent: "cyan",
    featured: true,
  },
  {
    id: "patchcore",
    name: "Industrial Anomaly Detection",
    subtitle: "PatchCore reproduction",
    date: "March 2026",
    summary:
      "A reproduction of the PatchCore paper on MVTec AD. With WideResNet50 features it reaches 0.99 AUC.",
    bullets: [
      "Wrote the coreset subsampling and the KNN anomaly scoring from scratch.",
      "The memory bank shrinks by more than 90% with almost no loss in detection accuracy.",
    ],
    stack: ["Python", "PyTorch", "WideResNet50"],
    metric: { value: "0.99", label: "AUC on MVTec AD" },
    links: [
      {
        label: "Source",
        href: "https://github.com/Neural-GPT/Industrial-Anomaly-Detection-With-PatchCore",
      },
    ],
    accent: "sky",
    featured: true,
  },
  {
    id: "orbital-x",
    name: "Orbital-X",
    subtitle: "Exoplanet radial-velocity orbit fitting",
    date: "August 2026",
    summary:
      "A head-to-head of three ways to fit exoplanet orbits from radial-velocity data: classical least-squares, a physics-informed neural network and a Neural ODE. Least-squares won.",
    bullets: [
      "About 6,000 batched, checkpointed fits, guarded by 10 automated correctness checks.",
      "On 40 held-out systems the classical fit rebuilt the true RV curve 0.25 m/s more accurately than both neural methods (p=0.0001), and beat the PINN on held-out RMSE, 2.19 vs 2.84 m/s (p=0.003).",
      "Parameter recovery was a statistical tie (95% vs 92.5% and 90%), and the classical fit was 5 to 70× cheaper in amortised runtime.",
    ],
    stack: ["PyTorch", "Astropy", "SciPy", "PINN"],
    metric: { value: "5–70×", label: "cheaper than the neural fits" },
    links: [{ label: "Source", href: "https://github.com/Neural-GPT/Orbital-X" }],
    accent: "cyan",
    featured: true,
  },
  {
    id: "jal-rakshak",
    name: "Jal Rakshak",
    subtitle: "Smart water tank overflow detection",
    date: "June 2026",
    summary:
      "Listens to a water tank filling and flags the overflow before it happens. A wireless mic streams the sound, and the classifier runs on Android and Windows.",
    bullets: [
      "Trained on 40 minutes of tank-fill audio that I recorded at home.",
      "An auto-train feature retrains the model on clips users label, so accuracy keeps improving after deployment.",
    ],
    stack: ["TensorFlow", "YAMNet", "Flutter", "Android SDK"],
    metric: { value: "40 min", label: "self-recorded dataset" },
    links: [{ label: "Source", href: "https://github.com/Neural-GPT/Jal-Rakshak" }],
    accent: "sky",
    featured: true,
  },
];

export const openSource = {
  repo: "ml-recipes-py",
  href: "https://github.com/cutewizzy11/ml-recipes-py/commit/2b4fafdf71874e54a063cef6bbf78875943cc99b",
  summary:
    "Merged a standardized ML pipeline into the repo: structured EDA, automated feature preprocessing and a Logistic Regression baseline. It set the code patterns and documentation standards for later contributions.",
};

// ---------------------------------------------------------------------------
// Research & experience timeline
// ---------------------------------------------------------------------------

export const research = [
  {
    id: "iitbbs",
    period: "Apr 2026 – Jul 2026",
    role: "Research Intern, NLP / RAG",
    org: "IIT Bhubaneswar",
    status: "completed",
    href: "https://drive.google.com/drive/folders/1NsWXO1TL9nWFS0ILk4g8y5wJxj0vW2cz",
    bullets: [
      "Implemented and benchmarked advanced RAG chunking strategies from the KET-RAG paper.",
      "Reproduced DynaBERT-based transformer compression under fixed hardware and latency budgets.",
      "At 0.75× width and depth on RoBERTa-base, the model came out 21.3% smaller and 1.78× faster while keeping 94.6% of baseline accuracy on QQP.",
    ],
    stats: [
      { value: "21.3%", label: "smaller model" },
      { value: "1.78×", label: "inference speedup" },
      { value: "94.6%", label: "accuracy retained" },
    ],
  },
  {
    id: "iitr",
    period: "Nov 2026 – Dec 2026",
    role: "ML Intern, Machine Learning in FinTech",
    org: "IIT Roorkee · Financial Analytics Lab",
    status: "ongoing",
    bullets: [
      "Building data extraction pipelines from Bloomberg and GDELT at the Financial Analytics Lab (Dept. of Management Studies, under Prof. Gaurav Dixit). They feed the lab's downstream analysis and NLP work.",
      "Wrote a Python/blpapi Bloomberg CLI that pulls 240+ fields per security. Pipelining the requests cut retrieval from 7.6s to 1.3s, about 6,100 data points per second.",
    ],
    stats: [
      { value: "5.9×", label: "faster retrieval" },
      { value: "240+", label: "fields per security" },
      { value: "~6,100", label: "data points / s" },
    ],
  },
  {
    id: "sakura",
    period: "Jan 2027",
    role: "JST Sakura Science Exchange",
    org: "Iwate Prefectural University, Japan",
    status: "confirmed",
    bullets: [
      "Selected by the host university for a JST-funded research exchange in advanced computing.",
      "A fully funded one-week visit to Prof. Hirokazu Madokoro's Computer Vision Lab.",
      "Alongside it, a joint study with Prof. Madokoro replicating the OutcropHybNet result: SegFormer MiT-B1 reached 36.67% mIoU against 33.76% for DeepLabV3+ (ResNet-101), with about 3.5× fewer parameters and 45% less training time.",
    ],
    stats: [
      { value: "36.67%", label: "mIoU, SegFormer MiT-B1" },
      { value: "3.5×", label: "fewer params than DeepLabV3+" },
    ],
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
  "Scientific computing": ["SciPy", "Astropy", "TorchDiffEq"],
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
    "Neural ODEs",
    "Physics-informed ML",
    "DSA in Python",
  ],
  Tools: ["Jupyter", "Git", "GitHub", "VS Code"],
};
