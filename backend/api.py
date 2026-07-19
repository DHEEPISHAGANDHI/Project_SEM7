# backend/api.py
import uvicorn
import asyncio
import os
import json
import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional 
from dotenv import load_dotenv

from query_data import query_rag

# Load environment variables
load_dotenv()

app = FastAPI(
    title="NyaayaBot API",
    description="API for the NyaayaBot RAG system"
)

origins = [
    "http://localhost:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query_text: str
    chat_history: Optional[List[Dict[str, Any]]] = None

# Pydantic model to define the structure of the incoming request data
class DocumentRequest(BaseModel):
    caseType: str
    courtDetails: Dict[str, Any]
    complainantDetails: Dict[str, Any]
    respondentDetails: List[Dict[str, Any]]
    incidentDetails: Dict[str, Any]
    legalGrounds: str
    reliefSought: List[str]


@app.post("/api/query")
async def process_query(request: QueryRequest):
    try:
        response_text, sources = await asyncio.to_thread(
            query_rag, request.query_text, request.chat_history
        )

        advice = "\n\n---\nNext Steps: For specific advice on your situation or to take action, consider contacting a qualified lawyer or the relevant government authority."
        full_response = response_text + advice if response_text else advice

        return {"response": full_response, "sources": sources}
    except Exception as e:
        print(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the query.")

@app.post("/api/generate-document")
async def generate_document(request: DocumentRequest):
    """
    Receives case details and uses a generative AI to draft a legal complaint.
    """
    try:
        # Get the secret API key from environment variables
        api_key = os.getenv('AI_API_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="AI_API_KEY is not configured on the server.")

        # The URL for the generative AI service (e.g., Google's Gemini API)
        ai_api_url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}'

        # The detailed, structured prompt for the AI model
        prompt = f"""
        **SYSTEM PROMPT**
        You are an expert legal drafting assistant with deep knowledge of the Indian legal system. Your primary function is to generate a formal, accurate, and court-ready legal complaint based on structured JSON data provided by a user. You must adhere strictly to Indian legal drafting standards.

        **TASK**
        Generate a complete legal complaint document based on the following JSON object.

        **RULES & FORMATTING INSTRUCTIONS**
        1.  **Structure:** The document must be structured in the following specific order:
            a.  Court Heading
            b.  Case Information (Parties: Complainant vs. Respondent)
            c.  Title of Document
            d.  Introduction (The humble complaint...)
            e.  Facts of the Case (Numbered paragraphs)
            f.  Legal Grounds
            g.  Prayer for Relief
            h.  Verification
            i.  Conclusion (Place, Date, Signature line)
        2.  **Language and Tone:** Use formal, precise, and unambiguous legal language.
        3.  **Output:** Your final output must be ONLY the text of the legal document.

        **JSON INPUT DATA**
        ```json
        {json.dumps(request.dict())}
        ```
        """

        headers = {'Content-Type': 'application/json'}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }

        # Make the async API call using httpx
        async with httpx.AsyncClient() as client:
            response = await client.post(ai_api_url, headers=headers, json=payload, timeout=90.0)
            response.raise_for_status() # Raise an exception for HTTP errors

        result = response.json()
        generated_document = result['candidates'][0]['content']['parts'][0]['text']
        
        return {"document": generated_document}

    except httpx.RequestError as e:
        print(f"Error contacting AI service: {e}")
        raise HTTPException(status_code=502, detail=f"Failed to contact the AI service: {e}")
    except (KeyError, IndexError) as e:
        print(f"Error parsing AI response: {e}")
        raise HTTPException(status_code=500, detail="Invalid response format from the AI service.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "NyaayaBot API is running."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)