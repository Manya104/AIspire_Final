import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_FILE = os.path.join(BASE_DIR, "data", "nco_full_data.json")
AUDIT_FILE = os.path.join(BASE_DIR, "audit_log.json")
CAREER_PATHS_FILE = os.path.join(BASE_DIR, "data", "career_paths.json")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
JWT_SECRET = os.getenv("JWT_SECRET", "aispire-dev-secret-change-in-prod")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "aispire2025")
