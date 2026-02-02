from flask import current_app
from pymongo.errors import PyMongoError
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)


class DatabaseService:
    
    @staticmethod
    def get_db():
        if not hasattr(current_app, 'db') or current_app.db is None:
            raise Exception("Database not initialized")
        return current_app.db
    
    @staticmethod
    def insert_one(collection_name: str, document: dict):
        try:
            db = DatabaseService.get_db()
            result = db[collection_name].insert_one(document)
            return str(result.inserted_id)
        except PyMongoError as e:
            logger.error(f"Error inserting document: {e}")
            raise
    
    @staticmethod
    def find_one(collection_name: str, filter_dict: dict = None):
        try:
            db = DatabaseService.get_db()
            
            # Convert string _id to ObjectId if present
            if filter_dict and '_id' in filter_dict:
                if isinstance(filter_dict['_id'], str):
                    filter_dict = dict(filter_dict)  # Make a copy
                    filter_dict['_id'] = ObjectId(filter_dict['_id'])
            
            result = db[collection_name].find_one(filter_dict or {})
            if result and '_id' in result:
                result['_id'] = str(result['_id'])
            return result
        except PyMongoError as e:
            logger.error(f"Error finding document: {e}")
            raise
    
    @staticmethod
    def find_many(collection_name: str, filter_dict: dict = None, limit: int = None):
        try:
            db = DatabaseService.get_db()
            cursor = db[collection_name].find(filter_dict or {})
            if limit:
                cursor = cursor.limit(limit)
            
            results = []
            for doc in cursor:
                if '_id' in doc:
                    doc['_id'] = str(doc['_id'])
                results.append(doc)
            return results
        except PyMongoError as e:
            logger.error(f"Error finding documents: {e}")
            raise
    
    @staticmethod
    def update_one(collection_name: str, filter_dict: dict, update_dict: dict):
        try:
            db = DatabaseService.get_db()
            
            # Convert string _id to ObjectId if present
            if filter_dict and '_id' in filter_dict:
                if isinstance(filter_dict['_id'], str):
                    filter_dict = dict(filter_dict)  # Make a copy
                    filter_dict['_id'] = ObjectId(filter_dict['_id'])
            
            result = db[collection_name].update_one(filter_dict, {"$set": update_dict})
            return result.modified_count
        except PyMongoError as e:
            logger.error(f"Error updating document: {e}")
            raise
    
    @staticmethod
    def delete_one(collection_name: str, filter_dict: dict):
        try:
            db = DatabaseService.get_db()
            result = db[collection_name].delete_one(filter_dict)
            return result.deleted_count
        except PyMongoError as e:
            logger.error(f"Error deleting document: {e}")
            raise
