import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from main import do_calibrate, process_dress
from src.state import state
from config import config

app = FastAPI(title="Garment Measurement API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure required directories exist
RESULT_DIR = Path("runs/results")
RESULT_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR = Path("data")
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Mount results directory to serve images
app.mount("/results", StaticFiles(directory="runs/results"), name="results")

@app.post("/api/process")
async def process_image(file: UploadFile = File(...)):
    import time
    start_time = time.time()
    try:
        # Save uploaded file
        temp_img_path = DATA_DIR / "uploaded_garment.jpg"
        with open(temp_img_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Reset state for new processing
        state.state = state._get_default_state()
        
        # Run processing logic (borrowed from main.py)
        source_img = str(temp_img_path)
        
        # Calibration logic
        if not config.get('preferences.optimizeCalibration'):
            do_calibrate(source_img)
        else:
            if config.get('calibration.pixel_to_cm_ratio') is None:
                do_calibrate(source_img)
        
        if config.get('calibration.pixel_to_cm_ratio') is not None:
            process_dress(source_img)
            # Save final state and get paths
            state.save_final_state()
            
            # The visualize_result saves to runs/results/{timestamp}/result.jpg
            timestamp = state.state.get('date_time')
            final_viz_path = f"{timestamp}/result.jpg"
            
            # Calculate duration
            duration = time.time() - start_time
            
            # Map state.state to the format expected by the frontend
            response_data = {
                "success": True,
                "measurements": state.state.get("measurements_result", []),
                "processing_time": duration,
                "calibration": {
                    "pixel_to_cm_ratio": state.state["calib_result"]["ratio"],
                    "viz_path": f"{timestamp}/result.jpg" # Fallback
                },
                "segmentation": state.state.get("det_result", []),
                "final_viz_path": final_viz_path,
                "date_time": state.state.get("date_time")
            }
            return response_data
        else:
            # Specific error for missing ArUco marker
            return {
                "success": False,
                "error": "Calibration failed: No ArUco marker found in the image. Please ensure a marker is visible.",
                "processing_time": time.time() - start_time
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "processing_time": time.time() - start_time
        }

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
