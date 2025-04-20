from fastapi import APIRouter, HTTPException
import os
from fastapi.responses import JSONResponse
from utility.federated_services import process_parquet_and_save_xy

test_router = APIRouter(
    prefix="/test",
    tags=["Test Router"]
)
    
@test_router.post("/download-and-combine")
async def download_and_combine(
    filename: str,
    session_id: str,
    output_column: str
):
    try:
        result = process_parquet_and_save_xy(filename, session_id, output_column)
        return JSONResponse(
            status_code=200,
            content=result
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process files: {str(e)}"
        )
