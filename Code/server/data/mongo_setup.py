import pymongo
from pymongo import MongoClient

cluster = MongoClient("mongodb+srv://huong:huong@cluster0-cwvzs.mongodb.net/test?retryWrites=true&w=majority")
# db = cluster["voice_db"]
print(cluster.test_database)

# collection  = db["voice_db"]

# post = {"id" : 0, "name" : "Huong"}

# collection.insert_one(post)
