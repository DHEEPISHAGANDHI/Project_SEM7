# backend/translator.py
import os
import re
import requests
from dotenv import load_dotenv

load_dotenv()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
SARVAM_URL = "https://api.sarvam.ai/translate"

LANG_MAP = {
    "en": "en-IN",
    "ta": "ta-IN",
    "hi": "hi-IN",
    "te": "te-IN",
    "bn": "bn-IN",
    "kn": "kn-IN",
    "ml": "ml-IN",
    "mr": "mr-IN",
    "gu": "gu-IN",
    "pa": "pa-IN",
    "or": "od-IN"
}

def clean_markdown_for_translation(text: str) -> str:
    """Strips markdown syntax that breaks Sarvam AI's translation pipeline."""
    # Remove asterisks used for bolding/italics
    text = re.sub(r'\*+', '', text)
    # Clean up excess dashes or trailing formatting markers
    text = re.sub(r'-{2,}', '', text)
    return text.strip()

def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    if not text or source_lang == target_lang:
        return text

    if not SARVAM_API_KEY:
        print("[Sarvam Warning] SARVAM_API_KEY is missing from environment variables.")
        return text

    source_code = LANG_MAP.get(source_lang, "en-IN")
    target_code = LANG_MAP.get(target_lang, "en-IN")

    # Clean text to prevent Sarvam hallucination loops
    clean_input = clean_markdown_for_translation(text)

    headers = {
        "api-subscription-key": SARVAM_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "input": clean_input[:1000],  # Keep payload small and safe for Sarvam
        "source_language_code": source_code,
        "target_language_code": target_code,
        "model": "sarvam-translate:v1",
        "mode": "formal"
    }

    try:
        response = requests.post(SARVAM_URL, json=payload, headers=headers, timeout=15)
        if response.status_code == 200:
            data = response.json()
            translated = data.get("translated_text", "")
            return translated if translated else text
        else:
            print(f"[Sarvam API Error] Status {response.status_code}: {response.text}")
            return text
    except Exception as e:
        print(f"[Sarvam Connection Error]: {e}")
        return text