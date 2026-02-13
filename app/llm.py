import google.generativeai as genai
import os

# Configure Gemini
os.environ["GOOGLE_API_KEY"]="AIzaSyD4Mzl3RJJkamA_-C6_RoPA4RRbfu4ZD60"
genai.configure()

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

    print(response.text)
    return response.text

