# NyaayaBot Voice Integration

This document describes the complete voice flow in the NyaayaBot project.

The project has two separate voice features:

1. **Voice-to-text input**: the user speaks into the microphone, and the backend converts the recording into text.
2. **Text-to-speech output**: the user clicks the speaker icon below a chatbot answer, and the browser reads that answer aloud.

The microphone feature uses the backend. The speaker feature currently uses the browser and does not call the backend.

## 1. Complete Voice-to-Text Flow

```text
User opens the chatbot
        |
        v
User clicks the microphone button
        |
        v
Browser requests microphone permission
        |
        v
MediaRecorder captures audio chunks
        |
        v
User clicks the microphone button again
        |
        v
Frontend creates an audio Blob
        |
        v
Frontend sends multipart/form-data to POST /api/voice/transcribe
        |
        v
FastAPI receives the uploaded audio file
        |
        v
Faster-Whisper loads and transcribes the temporary audio file
        |
        v
Backend returns the recognized English text
        |
        v
Frontend places the text in the input and sends it to POST /api/query
        |
        v
RAG retrieves legal context and generates the legal answer
        |
        v
Chatbot displays the answer
```

## 2. Complete Text-to-Speech Flow

```text
Bot answer is displayed
        |
        v
User clicks the small speaker icon under the answer
        |
        v
Browser creates SpeechSynthesisUtterance
        |
        v
Browser reads the answer aloud
        |
        v
User clicks the same icon again to stop speaking
```

This output feature is intentionally frontend-only. It uses the browser's installed speech engine and does not require an audio-generating backend service.

## 3. Files Used by Voice-to-Text

### Backend

- `backend/voice/__init__.py`
  - Marks `voice` as a Python package.

- `backend/voice/routes.py`
  - Creates the FastAPI voice router.
  - Exposes `POST /api/voice/transcribe`.
  - Reads the uploaded file.
  - Rejects empty audio.
  - Converts service exceptions into HTTP responses.

- `backend/voice/service.py`
  - Loads the Faster-Whisper model.
  - Detects an appropriate temporary-file extension.
  - Saves the uploaded bytes temporarily.
  - Transcribes and translates speech to English.
  - Normalizes the recognized text.
  - Deletes the temporary file after processing.

- `backend/api.py`
  - Imports `voice_router`.
  - Registers it with `app.include_router(voice_router)`.
  - Configures CORS for the React development server.

- `backend/requirements.txt`
  - `python-multipart` is required for FastAPI file uploads.
  - `faster-whisper` performs the transcription.

### Frontend

- `frontend/src/components/Chatbot.js`
  - Detects microphone support.
  - Requests microphone access.
  - Records audio with `MediaRecorder`.
  - Stops and releases microphone tracks.
  - Sends the audio Blob to the API service.
  - Places the returned transcript in the input.
  - Automatically sends the transcript as a chatbot question.
  - Shows recording, transcription, and error states.

- `frontend/src/components/Chatbot.module.css`
  - Styles the microphone button.
  - Styles the active recording state.
  - Styles voice status and error messages.
  - Styles the speaker button below bot answers.

- `frontend/src/services/api.js`
  - Defines the Axios API client.
  - Uses `http://localhost:8000/api` as the backend base URL.
  - Exports `transcribeAudio`.
  - Sends the recorded Blob under the multipart field name `audio`.

## 4. Backend API Contract

### Endpoint

```text
POST http://localhost:8000/api/voice/transcribe
```

### Request

The request must use `multipart/form-data` and contain one uploaded file:

```text
field name: audio
```

Example request with PowerShell and curl:

```powershell
curl.exe -X POST `
  -F "audio=@voice-input.webm" `
  http://localhost:8000/api/voice/transcribe
```

The frontend normally creates this request in `transcribeAudio`:

```javascript
const formData = new FormData();
formData.append('audio', audioBlob, 'voice-input.webm');
```

### Successful response

```json
{
  "text": "What are my rights if I am arrested?",
  "detected_language": "en",
  "language_probability": 0.98,
  "translated_to": "en",
  "source": "faster-whisper"
}
```

The `text` field is the value used by the frontend to submit the chatbot question.

### Error responses

- `400`: no audio data was received.
- `503`: voice transcription is unavailable or Faster-Whisper failed to initialize.
- `500`: an unexpected transcription error occurred.

The frontend converts these errors into messages shown below the chatbot input.

## 5. Faster-Whisper Configuration

The model is loaded lazily and cached once per backend process. Configuration is read from environment variables:

```text
VOICE_WHISPER_MODEL_SIZE=base
VOICE_WHISPER_DEVICE=cpu
VOICE_WHISPER_COMPUTE_TYPE=int8
```

Defaults used by the project:

- Model size: `base`
- Device: `cpu`
- Compute type: `int8`

A larger model may improve accuracy but requires more memory and processing time. GPU configuration can be used by setting the device and compute type supported by the local installation.

The model is loaded only when the first voice request arrives. This avoids loading Faster-Whisper during normal text-only startup.

## 6. Audio Processing Details

The browser records using this preference:

```text
 audio/webm;codecs=opus 
```

If that codec is not supported, the frontend falls back to:

```text
audio/webm
```

The backend determines the temporary file suffix from the uploaded filename or content type. Supported suffixes include:

- `.webm`
- `.ogg`
- `.wav`
- `.mp3`
- `.m4a`

The backend then calls Faster-Whisper with:

```python
model.transcribe(
    temp_path,
    task="translate",
    vad_filter=True,
)
```

`task="translate"` makes the returned text English. `vad_filter=True` helps ignore periods without speech.

Temporary files are deleted in a `finally` block after transcription, including after an error.

## 7. Frontend Recording States

The chatbot maintains these voice states:

- `voiceSupported`: whether the browser provides `getUserMedia` and `MediaRecorder`.
- `isRecording`: whether microphone recording is active.
- `isTranscribing`: whether the audio is being sent to the backend and processed.
- `voiceError`: the latest microphone or transcription error.
- `audioChunksRef`: recorded audio chunks waiting to be combined.
- `mediaRecorderRef`: the active `MediaRecorder` instance.
- `mediaStreamRef`: the microphone stream that must be stopped after recording.
- `cancelVoiceResultRef`: prevents a closed chatbot from submitting a recording.

The microphone button is disabled while a chatbot request is loading or while transcription is running.

## 8. Text-to-Speech Implementation

The answer speaker button is implemented in `frontend/src/components/Chatbot.js`.

Browser support is checked with:

```javascript
window.speechSynthesis
window.SpeechSynthesisUtterance
```

Each bot message receives one compact speaker button. The button:

- Reads only its own message.
- Changes to a stop icon while speaking.
- Stops speech when clicked again.
- Cancels an existing answer before starting another answer.
- Is disabled when the browser does not support speech synthesis.

Before reading, simple Markdown characters are removed so symbols such as `*`, `_`, backticks, and headings are not spoken awkwardly.

Speech is cancelled when the chatbot component is unmounted.

## 9. RAG Connection After Transcription

Voice transcription does not directly generate a legal answer. After the transcript is returned, the frontend calls the existing text query flow:

```text
POST /api/query
```

That request is processed by:

- `backend/api.py`
- `backend/query_data.py`
- ChromaDB in `backend/chroma`
- Ollama embedding model `nomic-embed-text`
- Ollama language model `llama3.1:latest`

This keeps voice input and typed input consistent: both become normal chatbot text queries before the RAG process runs.

## 10. Installation and Startup

### Backend installation

From the backend directory:

```powershell
cd "A:\FINAL YEAR_S7\Project_SEM7\backend"
pip install -r requirements.txt
```

The local system must also have the required Faster-Whisper runtime dependencies available.

### Start the backend

```powershell
cd "A:\FINAL YEAR_S7\Project_SEM7\backend"
python api.py
```

The backend runs at:

```text
http://localhost:8000
```

### Start the frontend

In a second terminal:

```powershell
cd "A:\FINAL YEAR_S7\Project_SEM7\frontend"
npm install
npm start
```

The frontend runs at:

```text
http://localhost:3000
```

The backend CORS configuration currently allows:

- `http://localhost:3000`
- `http://localhost:3001`

## 11. Manual Test Checklist

1. Start the backend.
2. Confirm `http://localhost:8000/api/health` returns a successful response.
3. Start the frontend.
4. Open the chatbot.
5. Allow microphone permission when the browser asks.
6. Click the microphone icon.
7. Speak a legal question.
8. Click the microphone icon again to stop recording.
9. Confirm that the transcript appears and is automatically submitted.
10. Confirm that the legal answer is displayed.
11. Click the speaker icon below the answer.
12. Confirm that the browser reads the answer aloud.
13. Click the speaker icon again and confirm that speech stops.
14. Test typing a question to confirm the normal text path still works.
15. Test closing the chatbot while recording and confirm the recording is cancelled.

## 12. Troubleshooting

### Microphone button is disabled

Check that the browser supports:

```javascript
navigator.mediaDevices.getUserMedia
window.MediaRecorder
```

Use a secure context such as `localhost`, and allow microphone permission.

### Microphone permission was denied

Enable microphone access in the browser site permissions. Typed questions continue to work without microphone access.

### Backend returns `503`

Check that Faster-Whisper is installed in the active Python environment:

```powershell
pip install faster-whisper
```

Also check the model configuration and available CPU/GPU resources.

### Backend returns `400`

The uploaded audio payload was empty. Confirm that the browser created audio chunks and that the multipart field is named `audio`.

### Frontend cannot connect to the voice endpoint

Confirm that the backend is running on port `8000` and that the frontend API base URL is correct in `frontend/src/services/api.js`.

### Speaker icon does not read the answer

Check whether the browser supports:

```javascript
window.speechSynthesis
window.SpeechSynthesisUtterance
```

The speaker feature depends on the browser's speech engine and does not depend on Faster-Whisper.

### Dataset and vector database are unrelated to recording

Voice-to-text only produces the question text. The legal answer still depends on the existing ChromaDB and Ollama RAG setup. If RAG is unavailable, typed and voice questions will both fail at the query stage.

## 13. Important Separation

The project intentionally keeps these responsibilities separate:

```text
Microphone input  -> Browser MediaRecorder -> FastAPI -> Faster-Whisper -> Text
Text question     -> FastAPI -> RAG -> Legal answer
Answer playback   -> Browser SpeechSynthesis
```

There is currently no backend text-to-speech endpoint and no generated audio file stored on the server. The only server-side voice operation is transcription.
