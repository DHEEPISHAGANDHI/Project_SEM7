import argparse
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM
from vector_embeddings import get_embedding_function
from typing import List, Dict, Any, Optional 

CHROMA_PATH = "chroma"
PROMPT_TEMPLATE = """

Answer the question based on the context and the previous conversation history.
You are NyaayaBot, a friendly and helpful legal assistant for the common citizen in India. Your goal is to explain complex legal topics in simple, easy-to-understand language.

Your Instructions:
1. Answer the user's question based ONLY on this context.
2. Explain the answer in simple terms, use jargons only when needed.
3.Suggest General Next Steps: After explaining the law, provide the next steps what they can do from the data context.Provide some related data ONLY if it is that data is genuinely related and not a random, confusing connection."
4. Get the content and question but answer in your own words.
5. Give the answers in a formatted manner. Use this format step by step(give all the content as a neet points):
   - Answer: related matching answer(provide more laws only if it is genuinely related)
   - Relevant Laws and explanation
   - Punishment
   - Legal Process
   - Additional Notes
   (IMPORTANT: Each step must be based only on the context. If nothing is available, skip that step.)
6.  Answer using the provided context: 
    If the context fully answers the question, give the answer;
    If the context partially answers, provide what's there.
    If there is only when no relevant information in the context, strictly ONLY say: "It seems the answer to your question isn't covered in the legal texts I have available. My knowledge is limited to the documents I've been provided.And a one line suggestion about where they can find it"
7. Strictly do not hallucinate.
8. Strictly follow these above instructions. And don't go outside the given context and question.

**Refer the Previous Conversation to continuation:**

{chat_history}


**Legal Context from Documents:**

{context}

---

Based on the conversation and the legal context, answer this new question: {question}

"""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("query_text", type=str, help="The query text.")
    args = parser.parse_args()
    query_text = args.query_text
    query_rag(query_text)


def query_rag(query_text: str, chat_history: Optional[List[Dict[str, Any]]] = None):
    embedding_function = get_embedding_function()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    results = db.similarity_search_with_score(query_text, k=5)

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    
    history_str = ""
    if chat_history:
        for message in chat_history:
            if message.get('isUser'):
                history_str += f"User: {message.get('query')}\n"
            else:
                answer = message.get('answer', '')
                history_str += f"Bot: {answer}\n"
    
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(
        context=context_text,
        question=query_text,
        chat_history=history_str
    )

    model = OllamaLLM(model="llama3.2:latest")

    response_text = model.invoke(prompt)

    sources = [doc.metadata.get("id", None) for doc, _score in results]

    return response_text, sources

if __name__ == "__main__":
    main()