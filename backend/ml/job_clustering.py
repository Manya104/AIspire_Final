"""
Job Clustering Module for AIspire.

Clusters NCO occupations using K-Means on SBERT embeddings,
then generates 2D coordinates via UMAP for visualization.
"""

import numpy as np
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE


class JobClusterModel:
    def __init__(self, search_engine, n_clusters=15):
        self.search_engine = search_engine
        self.n_clusters = n_clusters
        self.labels = None
        self.centers_2d = None
        self.points_2d = None
        self._fit()

    def _fit(self):
        embeddings = self.search_engine.get_embeddings_numpy()

        kmeans = KMeans(n_clusters=self.n_clusters, random_state=42, n_init=10)
        self.labels = kmeans.fit_predict(embeddings)

        sample_size = min(len(embeddings), 2000)
        indices = np.random.RandomState(42).choice(len(embeddings), sample_size, replace=False)
        sample_embeddings = embeddings[indices]

        tsne = TSNE(n_components=2, random_state=42, perplexity=min(30, sample_size - 1))
        coords_2d = tsne.fit_transform(sample_embeddings)

        self.sample_indices = indices
        self.points_2d = coords_2d
        print(f"Job clustering done: {self.n_clusters} clusters over {len(embeddings)} jobs.")

    def get_cluster_data(self):
        jobs = self.search_engine.job_data
        cluster_names = {}

        for cluster_id in range(self.n_clusters):
            member_indices = [i for i, l in enumerate(self.labels) if l == cluster_id]
            titles = [jobs[i].get("title", "") for i in member_indices[:5]]
            cluster_names[cluster_id] = titles[0] if titles else f"Cluster {cluster_id}"

        points = []
        for i, idx in enumerate(self.sample_indices):
            points.append({
                "x": float(self.points_2d[i][0]),
                "y": float(self.points_2d[i][1]),
                "cluster": int(self.labels[idx]),
                "cluster_name": cluster_names[int(self.labels[idx])],
                "title": jobs[idx].get("title", ""),
                "code": jobs[idx].get("code", ""),
            })

        cluster_summary = []
        for cid in range(self.n_clusters):
            members = [i for i, l in enumerate(self.labels) if l == cid]
            sample_titles = [jobs[i].get("title", "") for i in members[:8]]
            cluster_summary.append({
                "id": cid,
                "name": cluster_names[cid],
                "size": len(members),
                "sample_jobs": sample_titles,
            })

        return {
            "points": points,
            "clusters": cluster_summary,
            "total_jobs": len(jobs),
            "n_clusters": self.n_clusters,
        }
