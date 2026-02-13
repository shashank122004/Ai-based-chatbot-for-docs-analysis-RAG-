from fastapi import FastAPI, HTTPException,UploadFile, File
from pydantic import BaseModel
from app.pdf import ingest_pdf
from app.rag import get_query_results
from app.llm import generate_answer


class ChatRequest(BaseModel):
    query: str


app=FastAPI()

@app.post("/upload_docs")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF and store its embeddings in MongoDB
    """
    if file.content_type != "application/pdf":
        return {"error": "Only PDF files are supported"}

    pdf_id = ingest_pdf(file)

    return {
        "message": "PDF uploaded and processed successfully",
        "pdf_id": pdf_id
    }

@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Ask a question over all uploaded PDFs
    """
    query = request.query

    # 1. retrieve relevant chunks
    context_docs = get_query_results(query)

    # 2. generate answer using LLM
    answer = generate_answer(query, context_docs)

    return {
        "query": query,
        "answer": answer
    }
