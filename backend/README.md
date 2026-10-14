# XRayAI Backend — Chest X-Ray Classification API

> ⚠️ **Research Prototype — Not a Medical Device**
> This system is for academic/research use only. Predictions must not be used as a substitute for professional medical evaluation or clinical diagnosis.

---

## Overview

FastAPI backend for the **XRayAI** chest X-ray classification research project.  
The API accepts uploaded chest X-ray images and returns an AI-generated classification result using a pre-trained DenseNet121-based deep learning model.

---

## Features

- **POST /predict** — Upload a chest X-ray → receive AI classification + confidence
- **GET /health** — Model readiness check
- **GET /docs** — Swagger UI (auto-generated)
- **GET /redoc** — ReDoc UI
- Model loaded **once at startup** (no per-request loading)
- Clean JSON error responses (no stack traces exposed)
- CORS configured for Next.js frontend
- File type and size validation
- Structured logging
- Images are **never stored** permanently

---

## Architecture

```
backend/
├── app/
│   ├── main.py              ← FastAPI app + lifespan (model loading)
│   ├── config.py            ← Settings from .env (Pydantic-Settings)
│   ├── api/
│   │   ├── routes.py        ← Endpoints: /, /health, /predict
│   │   └── schemas.py       ← Pydantic request/response models
│   ├── services/
│   │   └── predictor.py     ← Model loading + inference logic
│   ├── utils/
│   │   └── preprocessing.py ← Image validation + preprocessing pipeline
│   └── model/
│       └── chest_xray_model.keras   ← Trained model (not in git)
├── .env                     ← Environment configuration
├── requirements.txt         ← Python dependencies
└── README.md
```

---

## Model Details

| Property | Value |
|---|---|
| Architecture | DenseNet121 (ImageNet pretrained, fine-tuned) |
| Task | Multi-class classification |
| Output | Softmax (4 classes) |
| Input size | 224 × 224 × 3 (RGB) |
| Normalization | `/255.0` (rescale=1./255) |

### Classes (alphabetical order — as trained)

| Index | Label |
|---|---|
| 0 | COVID |
| 1 | Lung_Opacity |
| 2 | Normal |
| 3 | Viral Pneumonia |

> ⚠️ The class order is **alphabetical** because `flow_from_dataframe` sorts labels alphabetically. Verify this against your training logs before deployment.

---

## Installation

### 1. Prerequisites

- Python 3.10 or 3.11 (recommended)
- pip

### 2. Create Virtual Environment

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

> **Note:** TensorFlow installation may take several minutes depending on your system.

### 4. Place the Model File

Copy your trained model to:

```
backend/app/model/chest_xray_model.keras
```

The model file is already placed there (`interpretable_lung_disease_model.keras` was copied and renamed).

### 5. Configure Environment

The `.env` file is already pre-configured with correct defaults:

```env
MODEL_PATH=app/model/chest_xray_model.keras
IMAGE_WIDTH=224
IMAGE_HEIGHT=224
CLASS_NAMES=COVID,Lung_Opacity,Normal,Viral Pneumonia
FRONTEND_URL=http://localhost:3000
MAX_UPLOAD_SIZE_MB=10
```

---

## Running the Server

```bash
# From the backend/ directory, with venv activated:
uvicorn app.main:app --reload
```

The server will start at:

```
http://127.0.0.1:8000
```

On first startup you will see:

```
=== XRayAI API starting up ===
Model path : app/model/chest_xray_model.keras
Image size : 224x224
Classes    : ['COVID', 'Lung_Opacity', 'Normal', 'Viral Pneumonia']
Loading model from 'app/model/chest_xray_model.keras' ...
Model loaded successfully. Output shape: (None, 4)
=== Startup complete. Model ready. ===
```

---

## API Endpoints

### `GET /`
Welcome message.

**Response:**
```json
{ "message": "Chest X-Ray Classification API is running" }
```

---

### `GET /health`
Model readiness check.

**Response:**
```json
{ "status": "healthy", "model_loaded": true }
```

---

### `POST /predict`
Upload a chest X-ray image for AI classification.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Field: `file` — JPG, JPEG, or PNG, max 10 MB

**Response:**
```json
{
  "prediction": "Normal",
  "confidence": 96.42
}
```

**Error Responses:**

| Status | Meaning |
|---|---|
| 400 | Missing file / invalid file / corrupted image |
| 415 | Unsupported file type |
| 503 | Model not loaded |
| 500 | Internal server error |

---

## API Documentation

- **Swagger UI:** http://127.0.0.1:8000/docs
- **ReDoc:** http://127.0.0.1:8000/redoc

---

## Example Request

### cURL

```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "accept: application/json" \
  -F "file=@chest_xray.jpg"
```

### Python

```python
import requests

with open("chest_xray.jpg", "rb") as f:
    response = requests.post(
        "http://127.0.0.1:8000/predict",
        files={"file": ("chest_xray.jpg", f, "image/jpeg")},
    )

print(response.json())
# {"prediction": "Normal", "confidence": 96.42}
```

---

## Frontend Integration

The Next.js frontend communicates with this API via:

```
POST http://localhost:8000/predict
```

CORS is configured for `http://localhost:3000` (set via `FRONTEND_URL` in `.env`).

Ensure both are running simultaneously:
- Backend: `uvicorn app.main:app --reload` → port 8000
- Frontend: `npm run dev` → port 3000

---

## Deployment Notes

- For production, replace `--reload` with `--workers 2` (or more for multi-core).
- Set `FRONTEND_URL` to your production domain.
- Use a reverse proxy (nginx, Caddy) in front of uvicorn.
- Do **not** store uploaded images permanently.
- Keep the `.env` file out of version control.
- The `.keras` model file is also excluded from git via `.gitignore`.

---

## Security Notes

- File type validated by extension and PIL decode
- Max file size enforced (default 10 MB)
- No uploaded images stored to disk
- No model paths or stack traces exposed in API responses
- CORS restricted to configured frontend origin

---

## Medical Disclaimer

> This API is an **academic research prototype** developed for educational and research purposes.
>
> - AI predictions are **not** medical diagnoses.
> - Results must **not** be used as the basis for clinical decisions.
> - Always consult a qualified healthcare professional for medical advice.
> - The model has not been validated for clinical use.
