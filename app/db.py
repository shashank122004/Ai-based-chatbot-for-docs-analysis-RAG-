from pymongo import MongoClient

# Connect to your MongoDB deployment
client = MongoClient("mongodb+srv://shashanksingh122004_db_user:shashank12@cluster0.lgaicsv.mongodb.net/?appName=Cluster0")
collection =  client["rag_db"]["test"]

# Insert documents into the collection
#result = collection.insert_many() 