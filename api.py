import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from google import genai
# from google.genai import types
from dotenv import load_dotenv
# from sqlalchemy.orm import Session
# from db import History, get_db
# import traceback
# import ollama

load_dotenv()
# OLLAMA_MODEL = "qwen2.5:7b"
# OLLAMA_CLIENT = ollama.AsyncClient()
GEMINI_MODEL = "gemini-3.5-flash-lite"
GEMINI_CLIENT = genai.Client(api_key = os.environ.get("GEMINI_API_KEY"))
api = FastAPI(title = "API")
origins = [
    "http://localhost:5500",
    "http://localhost:8000",
    "http://127.0.0.1:5500",
    "http://127.0.0.1:8000"
    ]

api.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = False,
    allow_methods = ["GET", "POST"],
    allow_headers = ["Authorization", "Content-Type"]
)

class GenerateRequest(BaseModel):
    prompt: str
    system_instruction: str

# @api.post("/ollama-api/generate")
# async def generate_text(request: GenerateRequest):
#     try:
#         response = await OLLAMA_CLIENT.chat(
#             model=OLLAMA_MODEL,
#             messages=[
#                 {
#                     "role": "system",
#                     "content": request.system_instruction
#                 },
#                 {
#                     "role": "user",
#                     "content": request.prompt
#                 }
#             ]
#         )
#         reply = response['message']['content']
#         return {
#             "status": "success",
#             "reply": reply
#         }
#     except Exception as ex:
#         print(f"Ollama 生成失敗：{ex}")
#         raise HTTPException(status_code=500, detail=str(ex))
    
@api.post("/gemini-api/generate")
async def generate_text(request: GenerateRequest):
    try:
        # records = db.query(History).order_by(History.id.desc()).limit(10).all()
        # records.reverse()

        # history = []
        # for record in records:
        #     history.append(
        #         types.Content(
        #             role = "user",
        #             parts = [types.Part.from_text(text = record.prompt)]
        #         )
        #     )

        #     history.append(
        #         types.Content(
        #             role = "model",
        #             parts = [types.Part.from_text(text = record.reply)]
        #         )
        #     )

        # history.append(
        #     types.Content(
        #         role = "user",
        #         parts = [types.Part.from_text(text = request.prompt)]
        #     )
        # )

        response = await GEMINI_CLIENT.aio.models.generate_content(
            model = GEMINI_MODEL,
            contents = request.prompt,
            config = {
                "system_instruction": request.system_instruction
            }
        )

        reply = response.text
        # new_record = History(
        #     prompt = request.prompt,
        #     reply = reply
        # )
        # db.add(new_record)
        # db.commit()
        # db.refresh(new_record)

        return {
            "status": "success",
            # "id": new_record.id,
            "reply": reply
        }
    except Exception as ex:
        raise HTTPException(status_code=500, detail=str(ex))

@api.get("/")
def web_test():
    return FileResponse("index.html")

api.mount("/", StaticFiles(directory=".", html=True), name="static")
    
