# AIspire – AI-Enabled Semantic Search for NCO-2015

**Intent-Aware Occupation Retrieval from Natural Language Queries to Standardized NCO Codes**

## Overview

AIspire is an AI-powered semantic search engine built to make India's National Classification of Occupations (NCO-2015) accessible, intuitive, and intelligent.

Instead of relying on rigid keyword searches, AIspire understands the meaning and intent behind user queries — whether typed or spoken — and retrieves the most relevant matching occupations from the official NCO dataset (3,600+ occupations across 52 sectors).

## Key Features

- **Hybrid Search (SBERT + BM25)** — Combines semantic embeddings with lexical matching for best-of-both-worlds retrieval
- **Query Intent Classification** — Trained ML model (F1=0.85) classifies queries into: skill_based, education_based, demographic, sector_based, location_based, general
- **Named Entity Recognition** — Extracts SKILL, EDUCATION, LOCATION, SECTOR, DEMOGRAPHIC entities from queries
- **Job Clustering & Visualization** — K-Means clustering on SBERT embeddings with interactive t-SNE scatter plot
- **Voice Search** — Speech input via Web Speech API for English and Hindi
- **Multilingual Support** — English/Hindi toggle with real-time translation
- **Career Path Visualizer** — Interactive directed graph showing NCO-based career progression
- **Training Center Map** — Leaflet map with PMKVY centers across NCR, Lucknow, Gurgaon
- **Accessibility Portal** — High-contrast mode, text-to-speech, simplified UI
- **Admin Panel** — JWT-authenticated CRUD for NCO data with audit logging
- **Skill Cards** — Skill India job cards with NCO occupation matching

## Tech Stack

### Backend
| Component | Technology |
|---|---|
| Framework | Flask (Blueprints) |
| ML Model | Sentence-BERT (all-MiniLM-L6-v2) |
| Lexical Search | BM25 (custom implementation) |
| Intent Classifier | TF-IDF + Logistic Regression (scikit-learn) |
| Clustering | K-Means + t-SNE (scikit-learn) |
| NER | Rule-based entity extraction |
| Authentication | JWT (PyJWT) |
| Translation | deep-translator (Google Translate) |
| Runtime | Python 3.9+ |

### Frontend
| Component | Technology |
|---|---|
| Framework | React 18 (Vite) |
| Styling | Tailwind CSS v4 |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Charts | Chart.js + react-chartjs-2 |
| Maps | Leaflet + react-leaflet |
| Graph Viz | vis-network |
| Voice | Web Speech API |

## Project Structure

```
AIspire/
├── package.json                    # Root convenience scripts
├── requirements.txt                # Python dependencies
├── extracter_nco.py                # NCO PDF data extraction script
│
├── backend/                        # Flask backend
│   ├── app_new.py                  # Main entry point (new)
│   ├── app.py                      # Legacy entry point
│   ├── config.py                   # Configuration (paths, secrets)
│   ├── model_embedder.py           # Legacy embedder
│   │
│   ├── routes/                     # Flask Blueprints
│   │   ├── auth_routes.py          # POST /auth/login
│   │   ├── search_routes.py        # GET /search
│   │   ├── career_routes.py        # GET /api/careers, /career-path
│   │   ├── admin_routes.py         # CRUD endpoints (JWT protected)
│   │   └── ml_routes.py            # GET /api/intent, /api/clusters
│   │
│   ├── ml/                         # ML modules
│   │   ├── search_engine.py        # Hybrid SBERT + BM25 engine
│   │   ├── intent_classifier.py    # Query intent classifier
│   │   ├── job_clustering.py       # K-Means + t-SNE clustering
│   │   └── ner_extractor.py        # Named entity extraction
│   │
│   ├── utils/
│   │   └── auth.py                 # JWT token create/verify/decorator
│   │
│   └── data/
│       ├── nco_full_data.json      # 3,067 NCO occupations
│       ├── career_paths.json       # Career progression graphs
│       └── training_centers_noida.json
│
├── frontend-react/                 # React frontend (new)
│   ├── index.html
│   ├── vite.config.js              # Vite config with API proxy
│   └── src/
│       ├── App.jsx                 # Routes
│       ├── main.jsx                # Entry point
│       ├── index.css               # Tailwind + custom styles
│       ├── components/             # Shared components
│       │   ├── Header.jsx
│       │   ├── Footer.jsx
│       │   ├── Layout.jsx
│       │   └── JobCard.jsx
│       ├── pages/                  # Page components
│       │   ├── Landing.jsx
│       │   ├── Search.jsx
│       │   ├── CareerPath.jsx
│       │   ├── Map.jsx
│       │   ├── SkillCard.jsx
│       │   ├── Clusters.jsx
│       │   ├── Accessible.jsx
│       │   ├── Admin.jsx
│       │   ├── Audit.jsx
│       │   └── Login.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── LanguageContext.jsx
│       ├── hooks/
│       │   └── useVoiceInput.js
│       └── services/
│           └── api.js              # Axios API client
│
└── frontend/                       # Legacy HTML frontend (reference)
```

## Setup Instructions

### Prerequisites

- **Python 3.9+** (check: `python --version`)
- **Node.js 18+** (check: `node --version`)
- **npm 9+** (check: `npm --version`)
- **pip** (check: `pip --version`)
- **Git** (check: `git --version`)
- A modern browser (Chrome or Edge recommended for voice input)

### Step 1: Clone the Repository

```bash
git clone https://github.com/SVJSurya/AIspire.git
cd AIspire
```

### Step 2: Set Up Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate it
# macOS / Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

### Step 3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs: Flask, sentence-transformers, scikit-learn, PyJWT, deep-translator, torch, numpy, scipy, gunicorn, flask-cors.

The first run will also download the SBERT model (~80MB) from HuggingFace automatically.

### Step 4: Start the Backend Server

```bash
python -m backend.app_new
```

You should see this output:
```
Loading Hybrid Search Engine (SBERT + BM25)...
Loaded 3067 jobs with hybrid index.
Loading Intent Classifier...
Intent classifier trained. CV F1-macro: 0.850
Loading NER Extractor...
Building Job Clusters...
Job clustering done: 15 clusters over 3067 jobs.
All models loaded. Server ready.
Starting AIspire server on port 5000...
 * Running on http://127.0.0.1:5000
```

**Keep this terminal open.** The backend must be running for the frontend to work.

### Step 5: Install Frontend Dependencies (New Terminal)

Open a **new terminal** window/tab:

```bash
cd AIspire/frontend-react
npm install
```

### Step 6: Start the Frontend Dev Server

```bash
npm run dev
```

Or from the project root:
```bash
npm run dev
```

Output:
```
  VITE v8.x  ready in XXXms

  ➜  Local:   http://localhost:3000/
```

### Step 7: Open in Browser

Go to **http://localhost:3000** in your browser.

## Environment Variables (Optional)

Create a `.env` file in the project root:

```env
# Gemini API key for optional AI reranking (not required)
GEMINI_API_KEY=your_key_here

# JWT secret for admin authentication (defaults to dev secret)
JWT_SECRET=your-secret-key-here

# Admin credentials (defaults shown)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=aispire2025
```

## Testing the System

### Search (http://localhost:3000/search)
Try these queries:
- `jobs for women in agriculture` — triggers DEMOGRAPHIC intent + SECTOR entity
- `career after diploma in electronics` — triggers EDUCATION_BASED intent
- `IT sector jobs in Noida` — triggers SECTOR + LOCATION entities
- `jobs for visually impaired` — triggers DEMOGRAPHIC intent

### Career Paths (http://localhost:3000/career-path)
- Search `Teacher` → see progression: Teacher → Senior Teacher → Headmaster → Education Administrator
- Search `Software Engineer` → see tech career ladder

### Cluster Visualization (http://localhost:3000/clusters)
- Interactive scatter plot of 3,067 occupations in 15 semantic clusters
- Click any cluster in the sidebar to filter
- Hover over points to see job title and NCO code

### Admin Panel (http://localhost:3000/login)
- Username: `admin`
- Password: `aispire2025`
- Add, edit, delete NCO occupations
- View audit logs of all changes

### Map (http://localhost:3000/map)
- Select NCR / Lucknow / Gurgaon to see PMKVY training centers
- Click "Show My Location" for distance reference

### Accessible Mode (http://localhost:3000/accessible)
- High-contrast toggle for visually impaired users
- "Read Results" button for text-to-speech output

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/search?query=...&lang=en` | No | Hybrid semantic search |
| GET | `/api/intent?query=...` | No | Intent classification + NER |
| GET | `/api/clusters` | No | Job cluster data for visualization |
| GET | `/api/careers` | No | List all career path titles |
| GET | `/career-path?job=...` | No | Get career progression for a job |
| POST | `/auth/login` | No | Get JWT token |
| GET | `/get_embeddings` | JWT | Get all NCO job data |
| POST | `/update_embeddings` | JWT | Update NCO data + auto re-embed |
| POST | `/log_audit` | No | Log an audit event |
| GET | `/get_audit_logs` | JWT | Get all audit logs |

## ML Pipeline Summary

```
User Query
    │
    ├─→ NER Extraction (SKILL, EDUCATION, LOCATION, SECTOR, DEMOGRAPHIC)
    │
    ├─→ Intent Classification (TF-IDF + Logistic Regression, F1=0.85)
    │       → skill_based | education_based | demographic
    │         sector_based | location_based | general
    │
    ├─→ Hybrid Search
    │       → SBERT embedding (all-MiniLM-L6-v2, 384-D)
    │       → BM25 lexical scoring
    │       → Fusion: α × SBERT + (1-α) × BM25, α=0.7
    │
    └─→ Ranked Results (top 10, deduplicated, with confidence scores)

Offline:
    NCO Data (3,067 jobs) → SBERT embeddings → K-Means (k=15) → t-SNE 2D → Cluster visualization
```

## Troubleshooting

| Problem | Solution |
|---|---|
| `ModuleNotFoundError` on backend start | Make sure virtual environment is activated and `pip install -r requirements.txt` completed |
| Frontend shows blank / API errors | Make sure backend is running on port 5000 in a separate terminal |
| `npm run dev` fails from root | Run from `frontend-react/` directory, or ensure root `package.json` exists |
| Voice input not working | Use Chrome or Edge; Safari has limited Web Speech API support |
| Slow first search | First query loads the SBERT model into memory (~5s). Subsequent queries are fast (~18ms) |
| Hindi translation is slow (~6s) | Known limitation — uses Google Translate API in real-time |

## Authors

- Manya Johri, Surya Dev Singh, Suryansh Singh, Uma Tomer, Nitin Tyagi, Biswajeet Pandey
- GL Bajaj Institute of Technology and Management, Greater Noida

## License

Open-source. MIT License.
