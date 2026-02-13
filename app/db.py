from pymongo import MongoClient
import os
# Connect to your MongoDB deployment
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGOURI"))
collection =  client["rag_db"]["test"]

# Insert documents into the collection
#result = collection.insert_many() 