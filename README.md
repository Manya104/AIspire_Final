AIspire – AI-Enabled Semantic Search for NCO-2015
Intent-Aware Occupation Retrieval from Natural Language Queries to Standardized NCO Codes
🚀 Overview

AIspire is an AI-powered semantic search engine built to make India’s
National Classification of Occupations (NCO–2015) accessible, intuitive, and intelligent.

Instead of relying on rigid keyword searches, AIspire understands the meaning and intent behind user queries—whether typed or spoken—and retrieves the most relevant matching occupations from the official NCO dataset.

This project integrates NLP, semantic embeddings, multilingual AI models, voice input, and accessibility features to create an inclusive and future-ready occupational search system.

🌟 Key Features
🔍 AI-Enabled Semantic Search

Understands contextual, descriptive queries like:

“Jobs for women in agriculture”

“Career options after diploma in electronics”

Uses Sentence-BERT / mBERT embeddings to find the closest NCO matches.

🗣️ Voice-Based Search

Supports speech input for low-literacy and accessibility-focused users.

🌐 Multilingual Support

Query in English, Hindi, or Hinglish.

Utilizes multilingual transformer models for cross-lingual understanding.

♿ Accessibility Portal

High-contrast mode

Text-to-Speech reading of results

Simplified UI for visually or cognitively impaired users

🧭 Career Path Visualizer (Optional Module)

Visualizes growth pathways within select job families.

🧠 Why AIspire Matters

India’s NCO-2015 exists mostly as a static PDF, making it difficult for:

Rural users

Non-English speakers

Students and job seekers

Persons with disabilities

AIspire modernizes occupational search with:

Semantic intelligence

Multilingual retrieval

Voice interaction

Adaptive accessibility tools

This aligns with national initiatives such as Digital India, Skill India, and Employment Enablement for All.

🛠️ Tech Stack
Backend

Python

Flask

Sentence-Transformers (MiniLM / mBERT)

PyTorch

JSON / MongoDB (optional for scalable storage)

Frontend

HTML, CSS, JavaScript

React.js (optional for advanced UI version)

Select2 for searchable dropdowns

Vis.js (for Career Path Visualization)

📁 Project Structure
nco-sem-py/
│
├── extracter_nco.py                 # Script for extracting NCO data
├── README.md                        # Project documentation
├── requirements.txt                 # Python dependencies
│
├── backend/                         # Flask backend API
│   ├── app.py                       # Main Flask application
│   ├── audit_log.json               # Audit logs for API usage
│   ├── model_embedder.py            # Sentence transformer model for embeddings
│   ├── nco-embeddings.json          # Precomputed embeddings for NCO data
│   ├── __pycache__/                 # Python bytecode cache (ignored)
│   └── data/                        # Data files
│       ├── career_paths.json        # Career path data
│       ├── nco_full_data.json       # Full NCO dataset
│       └── training_centers_noida.json  # Training center information
│
├── evaluation/                      # Evaluation and testing scripts
│   ├── app_baseline.py              # Baseline evaluation app
│   ├── evaluation_results.csv       # Results of evaluations
│   ├── model_test.py                # Model testing script
│   ├── nco_full_data.json           # NCO data for evaluation
│   └── test_queries_updated.csv     # Test queries for evaluation
│
├── frontend/                        # Web frontend
│   ├── accessible.css               # Styles for accessibility features
│   ├── accessible.html              # Accessible version of the interface
│   ├── accessible.js                # JavaScript for accessibility
│   ├── admin.html                   # Admin interface
│   ├── admin.js                     # Admin JavaScript
│   ├── audit.html                   # Audit log viewer
│   ├── career-path.html             # Career path visualization page
│   ├── index.html                   # Main search interface
│   ├── landing.html                 # Landing page
│   ├── map.html                     # Map view for training centers
│   ├── script.js                    # Main JavaScript for search
│   ├── skill_india_jobs_with_skills.json  # Skills data
│   ├── skillcard.html               # Skill card display
│   ├── style.css                    # Main styles
│   └── translations.js              # Multilingual translations
│
└── stitch_aispire_landing_page/      # Landing page assets
    ├── code.html                    # HTML code for landing page
    └── screen.png                   # Screenshot or image

⚙️ Installation & Setup Guide
Prerequisites

Python 3.9+

pip

A modern browser (Chrome/Edge recommended)

🖥️ Backend Setup (Python)
1. Clone the repository
git clone https://github.com/SVJSurya/AIspire.git
cd AIspire/backend

2. Create a virtual environment
python -m venv venv

3. Activate the virtual environment

Windows

venv\Scripts\activate


Mac/Linux

source venv/bin/activate

4. Install dependencies
pip install -r requirements.txt

5. Start the backend server
python app.py


The API will be running at:

http://127.0.0.1:5000

🌐 Frontend Setup

You can simply open the frontend files in your browser.

1. Go to the frontend folder
cd ../frontend

2. Open the main interface

Open:

index.html


or

accessible.html


🎉 You can now use AIspire locally with full semantic search functionality.

🧪 Testing the System

Try searches like:

“Jobs for people with disabilities”

“Farming jobs related to women”

“IT roles after diploma”

“Healthcare support jobs”

You should receive relevant NCO-matched occupations ranked by semantic similarity.

📈 Future Enhancements

Integration with live employment datasets (NCS Portal)

Real-time analytics dashboard for policymakers

Personalized career recommendations using user profiles

Voice output in multiple Indian languages

Mobile app version

🤝 Contributing

Contributions are welcome!
Please open an Issue or submit a Pull Request if you would like to improve the system.

📜 License

Open-source. MIT License.
