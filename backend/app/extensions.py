from flask_cors import CORS
from pymongo import MongoClient

cors = CORS()

# MongoDB client will be initialized in create_app
mongo_client = None
db = None
