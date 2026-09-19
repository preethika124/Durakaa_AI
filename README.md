# DARUKAA.EARTH 🌍

### AI-Powered Biodiversity & Environmental Intelligence System

DARUKAA.EARTH is an AI-powered environmental intelligence platform designed to analyze ecological conditions, retrieve scientific evidence, identify causal relationships, and provide evidence-backed recommendations for sustainable land and ecosystem management.

The system combines **React, Node.js, FastAPI, RAG, custom ecological embeddings, Gemini AI, SQLite/PostgreSQL, and a causal simulation engine** to create an interactive environmental decision-support platform.

---

## ✨ Features

* 🌱 **Environmental Baseline Profiling**

  * Soil organic carbon
  * pH
  * Moisture
  * Nutrients
  * Erosion
  * Compaction
  * Rainfall
  * Temperature
  * Land use
  * Crop type
  * Tillage practices
  * Pesticide usage
  * Biodiversity indicators

* 🤖 **AI Environmental Consultation**

  * Ask natural-language environmental questions.
  * Analyze the current environmental profile.
  * Generate structured assessments and recommendations.

* 🔎 **Retrieval-Augmented Generation (RAG)**

  * Retrieves relevant ecological knowledge before generating responses.
  * Uses semantic similarity, lexical matching, and evidence credibility.
  * Maintains traceability between recommendations and supporting evidence.

* 📚 **Scientific Knowledge Base**

  * Structured ecological knowledge documents.
  * Document chunking for targeted retrieval.
  * Evidence sources and publication metadata.

* 🧬 **Causal Simulation**

  * Model relationships between environmental factors.
  * Simulate the expected effects of interventions.
  * Compare environmental changes across different scenarios.

* 📊 **Knowledge Base Explorer**

  * Browse environmental knowledge.
  * Explore domains, mechanisms, metrics, and evidence.

* 🔍 **Retrieval Audit Logs**

  * Track RAG queries.
  * View retrieved chunks.
  * Inspect similarity scores.
  * Improve transparency of AI-generated results.

* 🔄 **Environmental Presets**

  * Degraded Arable Plain
  * Sahelian Dryland Rangeland
  * Sloped Mediterranean Basin
  * Compacted Clay Broadacre

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │       User           │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React Frontend     │
                         │   Vite + Tailwind    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │  Node.js / Express   │
                         │   API Proxy / Server │
                         └──────────┬───────────┘
                                    │
                          /api requests
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    FastAPI Backend   │
                         └──────────┬───────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          ┌────────────┐    ┌─────────────┐    ┌─────────────┐
          │    RAG     │    │   Causal    │    │ Gemini AI   │
          │   Engine   │    │   Engine    │    │   Service   │
          └─────┬──────┘    └─────────────┘    └─────────────┘
                │
                ▼
       ┌─────────────────────┐
       │ Knowledge Base      │
       │ Documents + Chunks  │
       │ + Evidence Sources  │
       └─────────────────────┘
```

---

# 🧠 How RAG Works

DARUKAA.EARTH uses a Retrieval-Augmented Generation pipeline.

```text
User Query
    │
    ▼
Generate Query Representation
    │
    ▼
Search Knowledge Chunks
    │
    ├── Semantic Similarity
    ├── Keyword Matching
    └── Evidence Credibility
    │
    ▼
Select Top-K Relevant Chunks
    │
    ▼
Build Evidence Context
    │
    ▼
Gemini AI Analysis
    │
    ▼
Environmental Assessment
    │
    ▼
Evidence-backed Recommendations
```

### Knowledge Processing

Each knowledge document is divided into smaller searchable chunks:

```text
Knowledge Document
       │
       ├── Diagnostic Overview
       │
       ├── Scientific Mechanisms
       │
       └── Evidence Sources
```

This allows the retrieval system to find the most relevant scientific information instead of passing the entire knowledge base to the AI model.

---

# 🧬 Embedding System

The current implementation uses a custom **64-dimensional ecological representation**.

The embedding system combines:

* Ecological semantic dimensions
* Domain-specific environmental concepts
* Token matching
* Subword/partial matching
* Hash-based lexical features
* Bigram interactions
* L2 normalization

These representations are used to calculate similarity between user queries and knowledge chunks.

```text
User Query
     │
     ▼
64-Dimensional Representation
     │
     ▼
Compare with Chunk Representations
     │
     ▼
Cosine Similarity
     │
     ▼
Relevant Knowledge
```

---

# ⚙️ Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

## Backend

* Node.js
* Express.js
* FastAPI
* Python
* Uvicorn

## AI / RAG

* Google Gemini API
* Custom ecological embedding system
* Cosine similarity
* Retrieval-Augmented Generation

## Database

### Current Development Database

* SQLite

### Production Architecture

* PostgreSQL
* pgvector

## Other Technologies

* REST APIs
* JSON
* Environment variables
* Git/GitHub
* Render deployment

---

# 📁 Project Structure

```text
DARUKAA.EARTH/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── ...
│   │
│   └── data/
│
├── components/
│   ├── Header.tsx
│   ├── BaselineProfilePanel.tsx
│   ├── ConsultationView.tsx
│   ├── KnowledgeBaseExplorer.tsx
│   ├── CausalSimulatorView.tsx
│   └── AuditLogView.tsx
│
├── App.tsx
├── server.ts
├── vite.config.ts
├── package.json
├── requirements.txt
├── tsconfig.json
├── .env
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* Python 3
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/preethika124/Darukaa_earth.git
```

```bash
cd Darukaa_earth
```

---

## 2. Install Node Dependencies

```bash
npm install
```

---

## 3. Create Python Virtual Environment

### Windows

```bash
python -m venv .venv
```

Activate it:

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv .venv
```

```bash
source .venv/bin/activate
```

---

## 4. Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
```

For production deployment, configure environment variables through the hosting platform instead of committing `.env` to Git.

> **Never commit API keys or other secrets to GitHub.**

---

# ▶️ Run Locally

Start the complete application with:

```bash
npm run dev
```

The application starts:

```text
Frontend:
http://localhost:3000

FastAPI:
http://localhost:8000
```

Open:

```text
http://localhost:3000
```

The Express server automatically starts the FastAPI backend and proxies `/api` requests.

---

# 🏥 API Health Check

Once the application is running, verify the backend:

```text
http://localhost:8000/api/health
```

Or through the Express server:

```text
http://localhost:3000/api/health
```

A healthy response contains the application status and knowledge-base counts.

---

# 🔌 API Endpoints

| Endpoint              | Method | Purpose                                  |
| --------------------- | ------ | ---------------------------------------- |
| `/api/health`         | GET    | Backend health and knowledge-base status |
| `/api/chat`           | POST   | AI environmental consultation            |
| `/api/analyze`        | POST   | Environmental analysis                   |
| `/api/simulate`       | POST   | Causal intervention simulation           |
| `/api/documents`      | GET    | Retrieve knowledge documents             |
| `/api/retrieval-logs` | GET    | View RAG retrieval history               |
| `/api/seed/reload`    | POST   | Reload the seed knowledge base           |

---

# 📊 Environmental Analysis Flow

A typical consultation follows this process:

```text
Environmental Profile
        +
User Question
        │
        ▼
Parameter Extraction
        │
        ▼
Knowledge Retrieval
        │
        ▼
Scientific Evidence
        │
        ▼
AI Analysis
        │
        ▼
Environmental Assessment
        │
        ├── Key Factors
        ├── Causal Relationships
        ├── Recommendations
        ├── Evidence
        └── Confidence
```

---

# 🧪 Example Query

A user can provide a question such as:

```text
My soil has low organic carbon and low moisture.
What practices can improve soil health?
```

DARUKAA.EARTH:

1. Reads the environmental profile.
2. Identifies relevant environmental parameters.
3. Searches the knowledge base.
4. Retrieves relevant scientific evidence.
5. Passes the evidence and environmental context to the AI service.
6. Generates an assessment.
7. Provides recommendations with supporting evidence.

---

# 🔍 Transparency & Auditability

DARUKAA.EARTH provides an audit layer for RAG operations.

For each retrieval operation, the system can record:

* User query
* Retrieved chunk IDs
* Similarity scores
* Retrieval metadata

This allows users and developers to inspect how the knowledge base contributed to an AI response.

---

# 🗄️ Database Architecture

The application supports a structured data model containing:

```text
Users
  │
  ├── Environmental Profiles
  │
  ├── Conversations
  │      └── Messages
  │
  ├── Recommendations
  │
  └── Retrieval Logs

Knowledge Base
  │
  ├── Knowledge Documents
  │      └── Knowledge Chunks
  │
  └── Evidence Sources
```

The current development implementation uses SQLite.

A PostgreSQL + pgvector schema is available for a production-oriented architecture.

---

# 🌐 Deployment

The application can be deployed as a single web service.

### Build

```bash
npm install && npm run build
```

### Start

```bash
npm start
```

The Node.js server:

* Serves the React production build.
* Starts the FastAPI backend.
* Proxies `/api` requests to FastAPI.

### Render Configuration

```text
Build Command:
npm install && npm run build

Start Command:
npm start
```

Required environment variable:

```text
GEMINI_API_KEY
```

The server automatically uses the `PORT` provided by the hosting platform.

---

# 🔒 Security Notes

* API keys are stored using environment variables.
* `.env` should not be committed.
* `.venv` should not be committed.
* `node_modules` should not be committed.
* Production databases should use persistent managed storage.
* API access should be protected appropriately before production use.

Recommended `.gitignore` entries:

```gitignore
.env
.venv/
node_modules/
__pycache__/
*.pyc
dist/
```

---

# 🛠️ Development Commands

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Build production application

```bash
npm run build
```

### Start production server

```bash
npm start
```

### Install Python dependencies

```bash
pip install -r requirements.txt
```

---

# 🎯 Project Goals

DARUKAA.EARTH aims to provide a transparent AI-assisted platform for environmental intelligence by combining:

* Environmental data
* Scientific knowledge
* Retrieval-Augmented Generation
* AI reasoning
* Causal simulation
* Evidence tracking
* Transparent retrieval logs

The goal is to help users understand environmental conditions and explore evidence-backed ecological interventions through an interactive interface.

---

# 👩‍💻 Author

**Penta Preethika**

B.Tech – Computer Science Engineering
Artificial Intelligence & Machine Learning

GitHub:
https://github.com/preethika124

---

# 📄 License

This project is intended for educational, research, and demonstration purposes.
