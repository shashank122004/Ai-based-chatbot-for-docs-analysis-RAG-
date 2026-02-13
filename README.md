Here’s a well-structured README for your DocBot project. I’ve made it detailed, covering setup, usage, and deployment. You can save it as README.md in your project root.

DocBot – PDF Chatbot with FastAPI & React

DocBot is a full-stack web application that allows users to upload PDF documents and interact with them via a chatbot interface. The application extracts content from the PDFs, generates embeddings, and uses a retrieval-augmented generation (RAG) approach to answer user queries.

It features a dark-mode, attractive frontend, real-time chat experience, drag-and-drop PDF upload, and smooth loading indicators.

Table of Contents

Features

Tech Stack

Project Structure

Setup & Installation

Running the Project

Usage

Deployment

Environment Variables

Contributing

License

Features

Upload and process PDF files.

Chat with your documents using a retrieval-augmented LLM.

Dark mode toggle for a visually appealing interface.

Drag-and-drop or file browse PDF upload.

Chat history persists until a new session is started.

Loading indicators while the chatbot is generating answers.

Single-page application for seamless user experience.

Tech Stack

Frontend: React.js, Tailwind CSS

Backend: FastAPI, Uvicorn

Database: MongoDB (to store embeddings and documents)

Machine Learning: Sentence Transformers for embeddings, LLM for answer generation

Other Libraries: Axios (HTTP requests), python-multipart (file uploads), Pydantic (data validation)

Project Structure
DocBot/
│
├── |
│   ├── app/
│   │   ├── main.py           # FastAPI application
│   │   ├── pdf.py            # PDF ingestion & embedding
│   │   ├── rag.py            # Retrieval of relevant chunks
│   │   ├── llm.py            # LLM answer generation
│   │   └── ...               # Other backend utilities
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables (ignored in Git)
│
├── frontend/
│   ├── src/
│   │   ├── DocBot.jsx        # React main component
│   │   └── ...               # Other React components
│   ├── public/
│   ├── package.json
│   └── ...                  
│
├── .gitignore
└── README.md

Setup & Installation
1. Clone the repository
git clone https://github.com/yourusername/docbot.git
cd docbot

2. Backend setup (FastAPI)
cd backend
python -m venv .venv
source .venv/bin/activate   # Linux/Mac
# .venv\Scripts\activate     # Windows

pip install --upgrade pip
pip install -r requirements.txt

3. Frontend setup (React)
cd ../frontend
npm install

Environment Variables

Create a .env file inside the backend/ folder:

GOOGLE_API_KEY=your_google_api_key_here
MONGOURI=your_mongodb_connection_uri


Important: .env is added to .gitignore to keep keys private.

Running the Project
Option 1: Development (React + FastAPI separately)
# Backend
cd backend
uvicorn app.main:app --reload

# Frontend
cd ../frontend
npm start


React dev server runs on http://localhost:3000

FastAPI backend runs on http://localhost:8000

Option 2: Production (Serve React via FastAPI)

Build React:

cd frontend
npm run build


Start FastAPI server:

cd ../backend
uvicorn app.main:app --host 0.0.0.0 --port 8000


Now the app runs on http://localhost:8000 and serves the React frontend.

Option 3: Using Docker
docker build -t docbot-app .
docker run -p 8000:8000 docbot-app

Usage

Open the application in your browser.

Drag & drop a PDF or click to browse and upload.

Wait for the upload confirmation.

Start asking questions in the chat box.

Click “New Chat” to end the session and clear previous messages.

Contributing

Contributions are welcome! You can:

Improve UI/UX or add new themes.

Add support for other document types (Word, TXT, etc.).

Optimize embedding and retrieval logic.