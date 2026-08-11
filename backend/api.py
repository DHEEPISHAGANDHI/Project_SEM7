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
from voice.routes import voice_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="NyaayaBot API",
    description="API for the NyaayaBot RAG system"
)

origins = [
    "http://localhost:3000", 
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(voice_router)

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


def get_homepage_content() -> Dict[str, Any]:
    return {
        "topics": [
            {
                "icon": "fas fa-home",
                "title": "Property Rights",
                "description": "Understand your rights related to property ownership, tenancy, and real estate transactions.",
                "category": "civil",
            },
            {
                "icon": "fas fa-briefcase",
                "title": "Labor Rights",
                "description": "Learn about workplace rights, minimum wages, working conditions, and employee benefits.",
                "category": "work",
            },
            {
                "icon": "fas fa-users",
                "title": "Family Law",
                "description": "Navigate through marriage, divorce, child custody, and inheritance legal matters.",
                "category": "family",
            },
            {
                "icon": "fas fa-shopping-cart",
                "title": "Consumer Rights",
                "description": "Know your rights as a consumer, including product safety and fair trade practices.",
                "category": "civil",
            },
            {
                "icon": "fas fa-heartbeat",
                "title": "Healthcare Rights",
                "description": "Understand your rights to healthcare access, medical privacy, and patient care.",
                "category": "health",
            },
            {
                "icon": "fas fa-graduation-cap",
                "title": "Education Rights",
                "description": "Learn about your right to education, school policies, and student protections.",
                "category": "education",
            },
        ],
        "services": [
            {
                "image": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop",
                "title": "Free Legal Consultation",
                "description": "Start with a free first conversation so you can understand your options before taking action.",
                "actionText": "Talk to a Lawyer",
                "action": "consultation",
                "icon": "fas fa-user-tie",
            },
            {
                "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop",
                "title": "Document Templates",
                "description": "Open practical legal templates for common procedures and everyday disputes.",
                "actionText": "Open Templates",
                "action": "templates",
                "icon": "fas fa-file-contract",
            },
            {
                "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
                "title": "Local Legal Clinics",
                "description": "Find nearby legal aid clinics and organizations when you need in-person assistance.",
                "actionText": "Locate Clinics",
                "action": "clinics",
                "icon": "fas fa-map-location-dot",
            },
        ],
        "testimonials": [
            {
                "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
                "name": "Rajesh Kumar",
                "location": "Farmer, Uttar Pradesh",
                "quote": "LegalAid India helped me understand my land rights and resolve a property dispute that had been going on for years. The information was clear and in Hindi, which made all the difference.",
            },
            {
                "photo": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop",
                "name": "Priya Sharma",
                "location": "Teacher, Maharashtra",
                "quote": "When I faced workplace discrimination, the chatbot guided me through my rights and connected me with a local lawyer. I got justice and my job back within months.",
            },
            {
                "photo": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
                "name": "Amit Patel",
                "location": "Small Business Owner, Gujarat",
                "quote": "The document templates saved me thousands of rupees in legal fees. I was able to draft proper contracts and agreements for my business without hiring expensive lawyers.",
            },
        ],
    }


@app.get("/api/content")
def get_content(language: str = "en"):
    content = get_homepage_content()
    content["language"] = language
    return content


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