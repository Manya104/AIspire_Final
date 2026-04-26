"""
Named Entity Recognition for AIspire queries.

Extracts structured entities from user queries:
- SKILL: programming, welding, typing
- EDUCATION: diploma, MBA, 10th pass, engineering
- LOCATION: Noida, Delhi, Mumbai
- SECTOR: agriculture, IT, healthcare
- DEMOGRAPHIC: women, disabled, senior citizens

Uses rule-based + keyword matching approach.
Can be upgraded to fine-tuned spaCy NER model.
"""

import re


SKILL_KEYWORDS = {
    "programming", "coding", "welding", "typing", "carpentry", "plumbing",
    "electrical", "machine learning", "data analysis", "cooking", "sewing",
    "driving", "accounting", "design", "repair", "maintenance", "software",
    "hardware", "networking", "communication", "management", "teaching",
    "nursing", "photography", "painting", "writing", "marketing",
}

EDUCATION_KEYWORDS = {
    "10th", "12th", "diploma", "iti", "btech", "bsc", "ba", "bca", "bba",
    "mba", "mtech", "msc", "ma", "phd", "doctorate", "engineering",
    "graduate", "postgraduate", "degree", "certificate", "medical",
    "law", "nursing", "polytechnic",
}

LOCATION_KEYWORDS = {
    "noida", "delhi", "mumbai", "bangalore", "bengaluru", "hyderabad",
    "chennai", "kolkata", "pune", "gurgaon", "gurugram", "lucknow",
    "jaipur", "ahmedabad", "chandigarh", "bhopal", "indore", "patna",
    "uttar pradesh", "maharashtra", "karnataka", "tamil nadu", "rajasthan",
    "rural", "urban", "india",
}

SECTOR_KEYWORDS = {
    "agriculture", "farming", "healthcare", "medical", "it", "software",
    "construction", "manufacturing", "hospitality", "banking", "finance",
    "education", "textile", "energy", "solar", "transportation", "mining",
    "retail", "pharmaceutical", "telecom", "automotive", "beauty",
    "food", "tourism",
}

DEMOGRAPHIC_KEYWORDS = {
    "women", "woman", "female", "disabled", "disability", "handicapped",
    "impaired", "blind", "deaf", "senior", "elderly", "youth", "tribal",
    "rural", "transgender", "specially abled", "differently abled",
}


class NERExtractor:
    def __init__(self):
        self.categories = {
            "SKILL": SKILL_KEYWORDS,
            "EDUCATION": EDUCATION_KEYWORDS,
            "LOCATION": LOCATION_KEYWORDS,
            "SECTOR": SECTOR_KEYWORDS,
            "DEMOGRAPHIC": DEMOGRAPHIC_KEYWORDS,
        }

    def extract(self, query):
        query_lower = query.lower()
        entities = []

        for label, keywords in self.categories.items():
            for kw in keywords:
                pattern = r'\b' + re.escape(kw) + r'\b'
                if re.search(pattern, query_lower):
                    entities.append({
                        "text": kw,
                        "label": label,
                        "start": query_lower.find(kw),
                        "end": query_lower.find(kw) + len(kw),
                    })

        seen = set()
        unique = []
        for e in entities:
            key = (e["text"], e["label"])
            if key not in seen:
                seen.add(key)
                unique.append(e)

        return unique
