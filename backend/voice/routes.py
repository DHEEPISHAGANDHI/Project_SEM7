from fastapi import APIRouter, HTTPException, UploadFile, File

from .service import transcribe_audio_bytes, VoiceTranscriptionError


voice_router = APIRouter(prefix="/api/voice", tags=["voice"])


@voice_router.post("/transcribe")
async def transcribe_voice(audio: UploadFile = File(...)):
    try:
        audio_bytes = await audio.read()
        if not audio_bytes:
            raise HTTPException(status_code=400, detail="No audio data received.")

        return transcribe_audio_bytes(
            audio_bytes,
            audio.filename or "voice-input.webm",
            audio.content_type or "application/octet-stream",
        )
    except VoiceTranscriptionError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error transcribing voice input: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while transcribing audio.")
