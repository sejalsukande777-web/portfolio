# Sejal's Pixel-Art Portfolio — Project Setup

## 1. Create the project folder

```bash
mkdir portfolio
cd portfolio
```

Drop the `package.json` from this handoff into the root of that folder.

## 2. Install dependencies

```bash
npm install
```

This pulls in React, Vite, and Motion (the animation library used for every
transition — sun/moon movement, dialogue boxes, scene changes, character
movement later on).

## 3. Folder structure to create

```
portfolio/
│
├── index.html
├── package.json
├── vite.config.js
│
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   │
│   ├── components/
│   │   ├── Character/
│   │   ├── Cloud/
│   │   ├── Sun/
│   │   ├── Moon/
│   │   ├── Celestial/          # combined Sun+Moon (what we built in Stage 1)
│   │   ├── Stars/
│   │   ├── House/
│   │   ├── DialogueBox/
│   │   ├── Navigation/
│   │   ├── ProjectObject/
│   │   └── ProjectPanel/
│   │
│   ├── scenes/
│   │   ├── HomeScene/
│   │   ├── AboutScene/
│   │   ├── SkillsScene/
│   │   ├── ProjectsScene/
│   │   └── NightScene/
│   │
│   ├── data/
│   │   ├── projects.js          
│   │   ├── skills.js
│   │   └── content.js            
│   │
│   ├── context/
│   │   └── DayNightContext.jsx  # currentScene, timeOfDay, progress tracking
│   │
│   ├── assets/
│   │   ├── character/
│   │   ├── backgrounds/
│   │   ├── clouds/
│   │   ├── houses/
│   │   ├── objects/              # pixel objects per project (mailbox, robot, etc.)
│   │   ├── projects/
│   │   ├── icons/                # email/LinkedIn/GitHub/Instagram icons
│   │   └── ui/
│   │
│   └── styles/
│       ├── global.css
│       ├── pixel.css             # borders, buttons, panels, color tokens
│       └── animations.css
│
└── public/
    └── resume.pdf                # not used for download button per your call,
                                    # but keep it here in case that changes later
```

## 4. Files to add now

- `vite.config.js` and `index.html` — included in this handoff, drop straight in
- `src/main.jsx` — included, drop straight in
- Your **Stage 1 scaffold** (`pixel_world_scaffold.jsx`) becomes
  `src/scenes/HomeScene/HomeScene.jsx` once we split it into pieces — right now
  it's one file on purpose (per the "don't over-engineer early" rule), we'll
  break it apart into the `components/` pieces above as we add more scenes.

## 5. Run it

```bash
npm run dev
```

Opens at `http://localhost:5173` by default.

## 6. What's already built vs. what's next

**Done (Stage 1):** Sky, sun→moon transition, clouds, stars, ground, house,
day/night stage system, opening dialogue box.

**Next up, in order:** Character (idle/walk) → Quick Navigation menu →
Project objects wired into the world → Project info panels → full scene
routing (About/Skills/Projects/Experience/Contact) → progress-based time
tracking (replacing the temporary stage-chip buttons) → responsive/mobile
tap interactions → accessibility pass → performance pass → deploy to Vercel.

Nothing here needs to be filled in with placeholder content — every project,
skill, and content field is already confirmed from our conversation, sitting
in the `data/` folder is where that content will actually live once we get
there.