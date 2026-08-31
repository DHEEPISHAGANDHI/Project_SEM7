import os
import re
import tempfile
from functools import lru_cache
from pathlib import Path


class VoiceTranscriptionError(Exception):
    pass


def _normalize_audio_suffix(filename: str, content_type: str) -> str:
    suffix = Path(filename).suffix.lower()
    if suffix:
        return suffix

    content_type = (content_type or "").lower()
    if "webm" in content_type:
        return ".webm"
    if "ogg" in content_type:
        return ".ogg"
    if "wav" in content_type:
        return ".wav"
    if "mp3" in content_type:
        return ".mp3"
    if "m4a" in content_type or "aac" in content_type:
        return ".m4a"
    return ".webm"


@lru_cache(maxsize=1)
def _load_whisper_model():
    try:
        from faster_whisper import WhisperModel
    except ImportError as exc:
        raise VoiceTranscriptionError(
            "Voice transcription is not configured. Install the backend dependencies from backend/requirements.txt."
        ) from exc

    model_size = os.getenv("VOICE_WHISPER_MODEL_SIZE", "base")
    device = os.getenv("VOICE_WHISPER_DEVICE", "cpu")
    compute_type = os.getenv("VOICE_WHISPER_COMPUTE_TYPE", "int8")

    return WhisperModel(model_size, device=device, compute_type=compute_type)


def transcribe_audio_bytes(audio_bytes: bytes, filename: str, content_type: str):
    if not audio_bytes:
        raise VoiceTranscriptionError("Empty audio payload received.")

    model = _load_whisper_model()
    suffix = _normalize_audio_suffix(filename, content_type)

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_file.write(audio_bytes)
        temp_path = temp_file.name

    try:
        segments, info = model.transcribe(
            temp_path,
            task="translate",
            vad_filter=True,
        )

        transcript_parts = []
        for segment in segments:
            text = segment.text.strip()
            if text:
                transcript_parts.append(text)

        transcript = " ".join(transcript_parts).strip()
        transcript = re.sub(r"\s+", " ", transcript)

        if not transcript:
            raise VoiceTranscriptionError("No speech could be detected in the audio.")

        return {
            "text": transcript,
            "detected_language": getattr(info, "language", None),
            "language_probability": getattr(info, "language_probability", None),
            "translated_to": "en",
            "source": "faster-whisper",
        }
    except VoiceTranscriptionError:
        raise
    except Exception as exc:
        raise VoiceTranscriptionError(f"Failed to transcribe audio: {exc}") from exc
    finally:
        try:
            Path(temp_path).unlink(missing_ok=True)
        except Exception:
            pass
