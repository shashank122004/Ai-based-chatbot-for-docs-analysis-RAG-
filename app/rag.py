from sentence_transformers import SentenceTransformer
from app.db import collection   
from pymongo.operations import SearchIndexModel
import time

# chunked data to embedded data
model = SentenceTransformer("all-MiniLM-L6-v2")
def get_embedding(text, input="document"):
    response = model.encode(text,normalize_embeddings=True)

    return response.tolist()



# Define a function to run vector search queries
def get_query_results(query):
  """Gets results from a vector search query."""

  query_embedding = get_embedding(query)
  #print(query_embedding) 
  pipeline = [
      {
            "$vectorSearch": {
              "index": "vector_index",
              "queryVector": query_embedding,
              "path": "embedding",
              "numCandidates":384,
              "limit": 5
            }
      }, {
            "$project": {
              "_id": 0,
              "text": 1
         }
      }
  ]

  results = collection.aggregate(pipeline)
  #print(results)

  array_of_results = []
  for doc in results:
      array_of_results.append(doc)
  return array_of_results