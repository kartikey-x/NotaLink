# NotaLink ✍️

**NotaLink** is a modern, AI-powered note-taking and sharing app. Write notes with a clean, distraction-free editor, transform your text with inline AI actions, share any note instantly via a unique URL, and access everything offline — no account required.

---

## ✨ Features

- **Instant Note Creation** — A focused editor lets you start writing immediately, with a magnetic "New Note" button and animated empty-state prompt.
- **AI Writing Assistant** — Select any text to reveal an inline popover powered by **Google Gemini 2.5 Flash**. Choose from three actions:
  - ✦ **Summarize** — Condenses your text to its core idea.
  - ⚡ **Make it Punchy** — Rewrites for impact and energy.
  - ✔ **Fix Grammar** — Corrects spelling, punctuation, and flow.
- **Real-Time Sharing via Unique URLs** — Share any note by clicking the Share button. The note is saved to **Supabase** and a unique link (`#note={id}`) is copied to your clipboard instantly. Recipients can view it in any browser, no login needed.
- **Offline-First Local Storage** — Notes are saved in the browser's `localStorage` under a prefixed key (`notalink_note_{id}`), keeping them available even without an internet connection.
- **Saved Notes Management** — A modal interface lets you browse, load, and delete any previously saved note, sorted by most recently updated.
- **Dark / Light Mode** — System-aware theming with a manual toggle, preference persisted across sessions.
- **Command Palette / Menu** — A quick-access panel (via the menu button) for New Note, theme toggle, and more — with a frosted-glass backdrop.
- **Animated Background** — Subtle Framer Motion canvas animations that respond to the current theme.
- **Embedded AI Chat Widget** — A Chatbase-powered floating chat assistant embedded in the app for general writing help and Q&A.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 |
| **Language** | TypeScript ~5.8 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 3 |
| **Animations** | Framer Motion 11 |
| **AI — Inline Actions** | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| **AI — Chat Widget** | Chatbase (embedded script in `index.html`) |
| **Cloud DB — Sharing** | Supabase (`@supabase/supabase-js`) |
| **Local Storage** | Browser `localStorage` (no backend needed) |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- A **Google Gemini API key** — get one free at [aistudio.google.com](https://aistudio.google.com)
- A **Supabase** project with a `notes` table (for the sharing feature)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/notalink.git
cd notalink
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root (this file is gitignored):

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

> **Note:** Variables must be prefixed with `VITE_` to be accessible in the browser via `import.meta.env`.

### 4. Set up Supabase

In your Supabase project, create the `notes` table with the following schema:

```sql
create table notes (
  id   text primary key,
  content text not null,
  created_at timestamptz default now()
);
```

### 5. (Optional) Configure the Chatbase widget

The floating chat assistant is embedded via a script in `index.html`. To replace it with your own:

1. Sign up at [chatbase.co](https://www.chatbase.co) and create a chatbot.
2. Go to the **Embed** section and copy the provided `<script>` snippet.
3. Open `index.html` and replace the existing Chatbase script block in the `<head>` with your new snippet.

### 6. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```
NotaLink/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── AIPopover.tsx          # Inline AI action popover (Summarize / Punchy / Grammar)
│   │   ├── AnimatedBackground.tsx # Framer Motion canvas background
│   │   ├── CommandPalette.tsx     # Quick-access menu panel
│   │   ├── Header.tsx             # Top bar with New Note, Saved Notes, Menu buttons
│   │   ├── MagneticButton.tsx     # Custom interactive button component
│   │   ├── NoteEditor.tsx         # Main rich-text note editor
│   │   ├── SavedNotesModal.tsx    # Modal for browsing / loading / deleting notes
│   │   ├── ShareButton.tsx        # Generates & copies unique share URL
│   │   └── SuccessToast.tsx       # Animated toast notification
│   ├── constants/
│   │   └── aiActions.tsx          # AI action definitions (id, label, icon, prompt)
│   ├── utils/
│   │   ├── aiActions.ts           # AIAction type definition
│   │   ├── aiService.ts           # Calls Gemini 2.5 Flash SDK for text transformation
│   │   ├── noteStorage.ts         # localStorage read/write/delete helpers
│   │   └── supabase.ts            # Supabase client + saveNoteToCloud / loadNoteFromCloud
│   ├── App.tsx                    # Root component, state management, routing logic
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── index.html                     # Entry point — includes Chatbase embed script
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🔗 How Note Sharing Works

1. User writes a note and clicks **Share**.
2. The note content is saved to Supabase with an auto-generated 8-character ID.
3. A URL is constructed: `https://your-app.com/#note={id}`
4. The URL is auto-copied to clipboard and a toast confirms success.
5. Anyone opening that URL will have the note loaded from Supabase into a read-only view.

---

## 🤖 How the AI Assistant Works

1. User selects text inside the note editor.
2. An animated **AIPopover** appears above the selection with three action buttons.
3. Clicking an action sends the selected text + a crafted prompt to the **Gemini 2.5 Flash** API (`temperature: 0.7`).
4. The transformed text replaces the original selection in-place.

The AI key is read from `import.meta.env.VITE_GEMINI_API_KEY` — never hardcoded.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is open source. See `LICENSE` for details.
