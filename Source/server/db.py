import pymongo
from pymongo import MongoClient

client = MongoClient("mongodb+srv://huong:huong@cluster0-cwvzs.mongodb.net/test?retryWrites=true&w=majority")

db = client['voice_db']
print(db)