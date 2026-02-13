import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()
# Configure Gemini
api_key=os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

def generate_answer(query,context_docs):
    # Convert retrieved docs to a single context string
    context_string = "\n".join([doc["text"] for doc in context_docs])

    # Construct prompt
    prompt = f"""  Use the following context to answer the question.
    If the answer is not in the context, say you don't know.

    Context:
        {context_string}

    Question:
    {query}
    """

    # Choose Gemini model
    model = genai.GenerativeModel("gemini-2.5-flash")

    # Generate response
    response = model.generate_content(prompt)

    return response.text