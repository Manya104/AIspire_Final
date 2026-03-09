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
AIspire/
│
├── backend/
│   ├── app.py
│   ├── model_embedder.py
│   ├── data/
│   │   ├── nco_full_data.json
│   │   └── career_paths.json
│   └── ...
│
├── frontend/
│   ├── index.html
│   ├── accessible.html
│   ├── style.css
│   ├── script.js
│   ├── accessible.js
│   └── career_path.js
│
└── README.md

⚙️ Installation & Setup Guide
Prerequisites

Python 3.9+

pip

A modern browser (Chrome/Edge recommended)

🖥️ Backend Setup (Python)
1. Clone the repository
git clone https://github.com/your-username/AIspire.git
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
