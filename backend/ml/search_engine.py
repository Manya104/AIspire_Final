import json
import os
import math
import numpy as np
from sentence_transformers import SentenceTransformer, util
from collections import Counter

from backend.config import DATA_FILE


class HybridSearchEngine:
    """
    Hybrid search combining:
    1. Sentence-BERT semantic similarity (all-MiniLM-L6-v2)
    2. BM25 lexical matching
    With learned fusion weight alpha.
    """

    def __init__(self, alpha=0.7):
        self.alpha = alpha  # weight for SBERT; (1-alpha) for BM25
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.job_data = []
        self.job_embeddings = None
        self.doc_freqs = {}
        self.avg_dl = 0
        self.doc_lengths = []
        self._load_data()

    def _load_data(self):
        if not os.path.exists(DATA_FILE):
            raise FileNotFoundError(f"Data file not found: {DATA_FILE}")

        with open(DATA_FILE, "r", encoding="utf-8") as f:
            self.job_data = json.load(f)

        combined_texts = [
            f"{job.get('title', '')}. {job.get('description', '')}"
            for job in self.job_data
        ]

        self.job_embeddings = self.model.encode(
            combined_texts, convert_to_tensor=True, show_progress_bar=False
        )

        self._build_bm25_index(combined_texts)
        print(f"Loaded {len(self.job_data)} jobs with hybrid index.")

    def _build_bm25_index(self, texts):
        self.tokenized_docs = []
        df = Counter()

        for text in texts:
            tokens = text.lower().split()
            self.tokenized_docs.append(tokens)
            unique_tokens = set(tokens)
            for t in unique_tokens:
                df[t] += 1

        self.doc_freqs = df
        self.doc_lengths = [len(d) for d in self.tokenized_docs]
        self.avg_dl = sum(self.doc_lengths) / len(self.doc_lengths) if self.doc_lengths else 1
        self.N = len(self.tokenized_docs)

    def _bm25_score(self, query_tokens, doc_idx, k1=1.5, b=0.75):
        doc_tokens = self.tokenized_docs[doc_idx]
        dl = self.doc_lengths[doc_idx]
        tf_map = Counter(doc_tokens)
        score = 0.0

        for qt in query_tokens:
            if qt not in tf_map:
                continue
            tf = tf_map[qt]
            df = self.doc_freqs.get(qt, 0)
            idf = math.log((self.N - df + 0.5) / (df + 0.5) + 1)
            tf_norm = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * dl / self.avg_dl))
            score += idf * tf_norm

        return score

    def hybrid_search(self, query, top_k=10):
        if not query.strip():
            return []

        query_embedding = self.model.encode(query, convert_to_tensor=True)
        sbert_scores = util.cos_sim(query_embedding, self.job_embeddings)[0].cpu().numpy()

        query_tokens = query.lower().split()
        bm25_scores = np.array([
            self._bm25_score(query_tokens, i) for i in range(len(self.job_data))
        ])

        sbert_norm = sbert_scores / (sbert_scores.max() + 1e-8)
        bm25_norm = bm25_scores / (bm25_scores.max() + 1e-8) if bm25_scores.max() > 0 else bm25_scores

        final_scores = self.alpha * sbert_norm + (1 - self.alpha) * bm25_norm

        top_indices = final_scores.argsort()[::-1][:top_k]

        results = []
        for idx in top_indices:
            job = self.job_data[idx]
            results.append({
                "code": job.get("code", ""),
                "title": job.get("title", ""),
                "description": job.get("description", ""),
                "confidence_score": round(float(final_scores[idx]) * 100, 2),
                "raw_score": float(final_scores[idx]),
                "sbert_score": round(float(sbert_scores[idx]) * 100, 2),
                "bm25_score": round(float(bm25_scores[idx]), 4),
            })

        return results

    def total_jobs(self):
        return len(self.job_data)

    def reload_data(self):
        print("Reloading data and recomputing embeddings...")
        self._load_data()
        print("Data reloaded successfully.")

    def get_embeddings_numpy(self):
        return self.job_embeddings.cpu().numpy()
