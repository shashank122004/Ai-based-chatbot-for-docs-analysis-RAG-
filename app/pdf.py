from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import uuid
import tempfile
import os

from app.rag import get_embedding
from app.db import collection


def ingest_pdf(file):
    collection.delete_many({})
    pdf_id = str(uuid.uuid4())

    # 1. save uploaded PDF to a temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file.file.read())
        temp_path = tmp.name

    try:
        # 2. load PDF from file path
        loader = PyPDFLoader(temp_path)
        pages = loader.load()

        # 3. split into chunks
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=400,
            chunk_overlap=20
        )
        documents = splitter.split_documents(pages)

        # 4. create records
        records = []
        for doc in documents:
            embedding = get_embedding(doc.page_content)

            records.append({
                "text": doc.page_content,
                "embedding": embedding,
                "pdf_id": pdf_id,
                "pdf_name": file.filename
            })

        # 5. insert once
        if records:
            collection.insert_many(records)

    finally:
        # 6. cleanup temp file
        os.remove(temp_path)

    return pdf_id