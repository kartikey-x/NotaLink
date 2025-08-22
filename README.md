NotaLink: AI-Powered Note Sharing
NotaLink is a sleek, real-time note-sharing application that allows users to create, save, and instantly share notes via a unique link. The standout feature is an integrated AI assistant, powered by a custom n8n workflow, designed to help users with writing, formatting, and general questions.

✨ Features
Instant Note Creation: Start typing immediately to create a new note.

Real-time Sharing: Generate a unique URL to share your note with anyone.

Local Storage: Notes are automatically saved in the browser for persistence.

AI Assistant: A conversational chatbot, powered by a custom n8n workflow and Google Gemini, to assist with:

Writing tips and content generation.

Answering questions contextually.

Conversational memory for follow-up questions.

Modern UI: A clean, dark-themed, and responsive interface built with React and Tailwind CSS.

Saved Notes Management: View, load, and delete previously saved notes.

🛠️ Tech Stack
Frontend: React, Vite, TypeScript

Styling: Tailwind CSS

AI & Automation: n8n.io

Language Model: Google Gemini

Icons: Lucide React

🚀 Getting Started
To run this project locally, follow these steps:

Prerequisites
Node.js (v18 or higher)

An active n8n workflow with a webhook URL

A Google Gemini API Key

Installation & Setup
Clone the repository:

Bash

git clone https://github.com/your-username/notalink-ai-notes.git
cd notalink-ai-notes
Install dependencies:

Bash

npm install
Configure the AI Assistant:

Open src/api.ts (or src/components/ChatBot.tsx).

Find the N8N_WEBHOOK_URL constant.

Replace the placeholder with your own n8n production webhook URL.

Run the development server:

Bash

npm run dev
