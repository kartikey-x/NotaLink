NotaLink: AI-Powered Note Sharing
NotaLink is a sleek, real-time note-sharing application that allows users to create, save, and instantly share notes via a unique link. The standout feature is an integrated AI assistant, powered by an embedded chatbot, designed to help users with writing, formatting, and general questions.

✨ Features
Instant Note Creation: A clean interface with header and empty-state buttons to immediately start a new note.

Real-time Sharing: Generate a unique URL to share your note with anyone.

Local Storage: Notes are automatically saved in the browser for persistence.

AI Assistant: An embedded conversational chatbot (e.g., from Chatbase) to assist with writing tips and answer questions.

Modern UI: A clean, dark-themed, and responsive interface built with React and Tailwind CSS.

Saved Notes Management: A modal interface to view, load, and delete previously saved notes.

🛠️ Tech Stack
Frontend: React, Vite, TypeScript

Styling: Tailwind CSS

AI Chatbot: Chatbase (or any similar embeddable widget service)

Icons: Lucide React

🚀 Getting Started
To run this project locally, follow these steps:

Prerequisites

Node.js (v18 or higher)

An account with a chatbot provider like Chatbase

Installation & Setup

Clone the repository:

Bash:
git clone https://github.com/your-username/notalink-ai-notes.git
cd notalink-ai-notes
Install dependencies:

Bash:
npm install
Configure the AI Assistant:

Sign up for a service like Chatbase.

Create and train a new chatbot with your desired data.

Find the "Embed" or "Integrate" section and copy the provided <script> tag.

Open the index.html file in the root of your project.

Paste the script you copied right before the closing </body> tag.

Run the development server:

Bash:
npm run dev
