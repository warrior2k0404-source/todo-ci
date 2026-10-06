import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
import os

client = MongoClient(
    os.getenv("MONGODB_URL", "mongodb://mongodb:27017")
)

db = client["todo_db"]
todos_collection = db["todos"]


class Todo(BaseModel):
    title: str
    completed: bool = False


@app.get("/")
def home():
    return {"message": "Todo API is running"}


@app.post("/todos")
def create_todo(todo: Todo):
    result = todos_collection.insert_one(todo.model_dump())

    return {
        "message": "Todo created",
        "id": str(result.inserted_id)
    }


@app.get("/todos")
def get_todos():
    todos = list(todos_collection.find())

    for todo in todos:
        todo["_id"] = str(todo["_id"])

    return todos


@app.get("/todos/{todo_id}")
def get_todo(todo_id: str):
    todo = todos_collection.find_one({
        "_id": ObjectId(todo_id)
    })

    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    todo["_id"] = str(todo["_id"])

    return todo


@app.put("/todos/{todo_id}")
def update_todo(todo_id: str, todo: Todo):
    result = todos_collection.update_one(
        {"_id": ObjectId(todo_id)},
        {"$set": todo.model_dump()}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Todo not found")

    return {"message": "Todo updated"}


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: str):
    result = todos_collection.delete_one({
        "_id": ObjectId(todo_id)
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Todo not found")

    return {"message": "Todo deleted"}