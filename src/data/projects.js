// Centralized project data. Add/edit/remove projects here only —
// components read from this file, nothing is hardcoded elsewhere.

export const projects = [
  {
    id: "jobhunter",
    title: "JobHunter",
    status: "completed",
    featured: true,
    description:
      "A local, zero-cost internship & job discovery tool that scrapes listings and matches them against your profile with an explainable 0\u2013100 relevance score.",
    problem:
      "Job hunting means scrolling hundreds of listings and guessing which ones are worth your time — this automates the discovery and scoring, without any auto-apply risk.",
    technologies: ["Python"],
    features: [
      "Automated scraping and profile-based matching with explainable scoring",
      "Auto-generates tailored resumes and cover letters per listing",
      "Application tracker with follow-up reminders",
      "Fully local, zero-cost, no cloud dependency, no auto-apply",
    ],
    github: "https://github.com/sejalsukande777-web/JobHunter",
    live: "",
    worldObject: "mailbox",
  },
  {
    id: "askmydoc",
    title: "AskMyDoc",
    status: "completed",
    featured: true,
    description:
      "An AI-powered PDF question-answering system using a RAG architecture with FAISS vector search and a local LLM.",
    problem:
      "Finding specific answers inside long PDFs is slow — this lets you ask questions directly and get grounded, sourced answers.",
    technologies: [
      "Python",
      "FAISS",
      "Sentence Transformers",
      "Ollama",
      "Llama3",
      "Streamlit",
      "PyPDF2",
    ],
    features: [
      "RAG pipeline: PDF text extraction, chunking, and embeddings stored in FAISS",
      "Llama3 via Ollama for context-aware answers, sub-second query response",
      "Interactive Streamlit UI with real-time PDF upload and querying",
    ],
    github: "https://github.com/sejalsukande777-web/AskMyDoc",
    live: "",
    worldObject: "book",
  },
  {
    id: "reflect",
    title: "Reflect",
    status: "completed",
    featured: false,
    description:
      "A full-stack web app for secure daily journaling, mood tracking, and streak monitoring.",
    problem:
      "Personal reflection apps often skip real security or meaningful analytics — this treats journaling data like it matters.",
    technologies: [
      "Node.js",
      "Express.js",
      "MongoDB Atlas",
      "Mongoose",
      "JWT",
      "bcrypt",
      "HTML/CSS/JavaScript",
      "Chart.js",
    ],
    features: [
      "Secure JWT + bcrypt authentication for private journaling and mood tracking",
      "Streak-based consistency tracking with a growth analytics dashboard",
      "MongoDB Atlas + Mongoose schema modeling, Node/Express REST API",
    ],
    github: "https://github.com/sejalsukande777-web/Reflect",
    live: "",
    worldObject: "journal",
  },
  {
    id: "smarthire",
    title: "SmartHire",
    status: "completed",
    featured: false,
    description:
      "A text-based AI mock interview agent that evaluates technical answers using a local LLM and generates detailed performance reports.",
    problem:
      "Interview prep is hard to practice alone with real feedback — this simulates the interviewer and scores your answers.",
    technologies: ["Python", "Ollama", "Llama3", "Streamlit", "Prompt Engineering"],
    features: [
      "Role-specific interview question generation via engineered prompts",
      "Automated answer evaluation and scoring with detailed feedback reports",
      "Clean Streamlit front-end for the full mock-interview workflow",
    ],
    github: "https://github.com/sejalsukande777-web/SmartHire_AI_Interview_Agent",
    live: "",
    worldObject: "robot",
  },
  {
    id: "eduinbox",
    title: "EduInbox",
    status: "completed",
    featured: false,
    description:
      "An AI-powered academic email assistant that classifies and organizes academic emails automatically.",
    problem:
      "Academic inboxes bury deadlines and announcements in noise — this sorts them automatically so nothing gets missed.",
    technologies: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Gmail API",
      "JWT",
      "Sentence Transformers",
      "scikit-learn",
    ],
    features: [
      "Google OAuth 2.0 + JWT-based secure Gmail integration",
      "Classifies emails into Notes, Assignments, Announcements, Deadlines",
      "Responsive React dashboard with timeline view, search, attachment management",
    ],
    github: "https://github.com/sejalsukande777-web/EduInbox",
    live: "",
    worldObject: "mail-sorter",
  },
  {
    id: "emotion-detection",
    title: "Real-Time Emotion Detection",
    status: "completed",
    featured: false,
    description:
      "A facial emotion recognition system using a custom CNN trained on FER-2013, with real-time detection via OpenCV.",
    problem:
      "Demonstrates a full real-time computer vision pipeline, from model training to live webcam inference.",
    technologies: ["Python", "TensorFlow", "Keras", "OpenCV", "NumPy"],
    features: [
      "Custom CNN trained on FER-2013, classifying 7 emotions",
      "Real-time face detection via OpenCV Haar Cascade, reliable across lighting",
      "Live webcam-based inference pipeline",
    ],
    github: "https://github.com/sejalsukande777-web/Real-Time-Emotion-Detection",
    live: "",
    worldObject: "camera",
  },
  {
    id: "bead-pattern-maker",
    title: "Bead Pattern Maker",
    status: "completed",
    featured: false,
    description:
      "A browser-based tool that converts any photo into a grayscale grid pattern sized to real bead/drill diameters for craft workshops.",
    problem:
      "Craft workshop instructors need patterns that physically match real materials — this generates true-to-scale printable patterns from any photo.",
    technologies: ["HTML", "CSS", "JavaScript", "Canvas API"],
    features: [
      "Converts photos to grayscale grid patterns at true 1:1 print scale",
      "Adjustable shade count (3\u201314 tones) with editable, renameable legend",
      "Fully client-side — no backend, free GitHub Pages hosting",
    ],
    github: "https://github.com/sejalsukande777-web/bead_pattern_maker",
    live: "https://sejalsukande777-web.github.io/bead_pattern_maker/",
    worldObject: "craft-table",
  },
  {
    id: "kinfolk-craft",
    title: "Kinfolk & Craft",
    status: "in-progress",
    featured: false,
    description:
      "A marketplace concept connecting artisans who carry traditional, handmade-craft techniques with people who value the story behind what they buy.",
    problem:
      "Still in early design phase — homepage and visual direction in progress.",
    technologies: [],
    features: [
      "Artisan marketplace concept, still in design/early-build phase",
    ],
    github: "https://github.com/sejalsukande777-web/Kinfolk_and_Crafts",
    live: "",
    worldObject: "market-stall",
  },
  {
    id: "airdraw-arena",
    title: "Blind Canvas",
    status: "building",
    featured: false,
    description:
      "A 4-player browser-based multiplayer party game using real-time hand-gesture tracking to draw instead of a mouse.",
    problem:
      "Players draw on separate quadrants of a shared hidden scene, then reassemble their shuffled drawings as a team and guess it together — competing against an AI's independent guess.",
    technologies: [],
    features: [
      "4-player browser-based multiplayer using real-time hand-gesture tracking",
      "Team reassembly and guessing mechanic across shuffled quadrant drawings",
      "Competes against an AI's independent guess of the same scene",
    ],
    github: "",
    live: "",
    worldObject: "arcade-cabinet",
  },
  {
    id: "polaloo",
    title: "Polaloo",
    status: "completed",
    featured: false,
    description:
      "A mobile-first pixel-art photo booth that runs entirely in the browser. Snap four photos, then decorate the strip with pixel filters, frames and stickers.",
    problem:
      "Most photo booth apps look minimal and generic. Polaloo is built around a playful, nostalgic pixel-art look, from the pixel door intro to the chunky outlines and stepped animations.",
    technologies: ["React", "Vite", "HTML Canvas", "JavaScript", "CSS", "Vercel"],
    features: [
      "Four-photo capture with live camera and 3-2-1 countdown, or upload from gallery, with drag and pinch-to-zoom cropping",
      "13 filters including 5 pixel filters (Pixel, Candy, Game Boy, Arcade, 1-Bit) that average the photo into a grid and map it to a limited palette with ordered dithering, so preview and download match",
      "38 strip frames drawn in code at pixel size, plus 160+ pixel-art stickers in 14 categories that you can drag, resize, rotate and delete",
      "Exports a 1200x3600 PNG or JPEG, fully client-side, so photos never leave your device",
    ],
    github: "https://github.com/sejalsukande777-web/Polaloo",
    live: "https://polaloo.vercel.app",
    worldObject: "bike",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
