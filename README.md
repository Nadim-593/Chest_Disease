# Chest Disease Classification — XRayAI

An AI-powered chest X-ray classification web application developed as an academic project for the **Artificial Intelligence course** in the B.Sc. in Software Engineering program at **Daffodil International University**.

The project combines a Next.js frontend with a FastAPI backend that runs a TensorFlow/Keras deep-learning model. Dataset preparation and model development are documented in a Google Colab notebook.

> **Medical Disclaimer:** This is an academic research prototype, not a clinically validated medical device. Predictions must not be used for diagnosis or treatment decisions.

## Overview

XRayAI allows users to upload chest X-ray images and receive a predicted classification from a trained deep-learning model.

### Supported Classes

- COVID
- Lung Opacity
- Normal
- Viral Pneumonia

The class labels and their order must match the trained model configuration.

## Features

- Chest X-ray image upload and analysis
- Deep-learning inference using a FastAPI REST API
- Prediction label and confidence score
- Image type and upload-size validation
- Backend health-check endpoint
- Interactive API documentation using Swagger UI
- Google Colab notebook for dataset preparation and model development
- Research workflow focused on interpretable AI

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | Next.js, React, Tailwind CSS, JavaScript |
| Backend | Python, FastAPI, Uvicorn |
| Deep Learning | TensorFlow, Keras, DenseNet121 |
| Image Processing | Pillow, NumPy |
| Configuration | Pydantic Settings, python-dotenv |
| Model Development | Google Colab |
| Dataset | COVID-19 Radiography Database |

## Project Structure

```text
Chest_Disease/
├── frontend/
│   ├── app/
│   │   ├── about/
│   │   ├── analyze/
│   │   └── ...
│   ├── components/
│   ├── services/
│   │   └── api.js
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── routes.py
│   │   │   └── schemas.py
│   │   ├── services/
│   │   │   └── predictor.py
│   │   ├── utils/
│   │   │   └── preprocessing.py
│   │   ├── config.py
│   │   ├── main.py
│   │   └── model/
│   │       └── chest_xray_model.keras
│   ├── Lung_Disease_Interpretable_AI.ipynb
│   ├── requirements.txt
│   └── README.md
│
└── README.md
```

**Note:** The trained model file is not committed to GitHub. The dataset is downloaded and used in Google Colab rather than stored in this repository.

## System Workflow

1. The user selects a chest X-ray image in the frontend.
2. The frontend validates the image and sends it to the backend.
3. FastAPI validates the request and preprocesses the image.
4. The trained TensorFlow/Keras model predicts a class.
5. The backend returns the prediction and confidence score as JSON.
6. The frontend displays the result.

## Dataset and Model Development

Model development is documented in [`backend/Lung_Disease_Interpretable_AI.ipynb`](backend/Lung_Disease_Interpretable_AI.ipynb).

The notebook is designed to run in Google Colab and uses the [COVID-19 Radiography Database on Kaggle](https://www.kaggle.com/datasets/tawsifurrahman/covid19-radiography-database).

The notebook outlines the following workflow:

- Download the dataset using the Kaggle API.
- Resize images to 224 × 224 pixels.
- Normalize image pixel values.
- Create stratified training, validation, and test splits.
- Apply image augmentation during training.
- Use ImageNet-pretrained DenseNet121 with a custom classification head.
- Fine-tune the model and evaluate its classification performance.

### Running the Notebook

1. Open the notebook in Google Colab.
2. Select a suitable runtime; a GPU is recommended for training.
3. Follow the notebook cells in order.
4. If required, configure Kaggle API access to download the dataset.
5. Train and evaluate the model.
6. Place the exported model in the backend's expected model path.

Never commit your Kaggle API token or other credentials to GitHub.

## Prerequisites

- Python 3.10 or 3.11 recommended
- Node.js and npm
- Git
- The trained model file generated from the notebook

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Nadim-593/Chest_Disease.git
cd Chest_Disease
```

### 2. Set Up the Backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**

```bash
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure the Model

Place the trained model at:

```text
backend/app/model/chest_xray_model.keras
```

The model file is excluded from version control, so you must generate or obtain it separately.

The backend configuration supports these settings:

```env
MODEL_PATH=app/model/chest_xray_model.keras
IMAGE_WIDTH=224
IMAGE_HEIGHT=224
CLASS_NAMES=COVID,Lung_Opacity,Normal,Viral Pneumonia
FRONTEND_URL=http://localhost:3000
MAX_UPLOAD_SIZE_MB=10
```

These values must match your actual trained model and local configuration.

### 4. Start the Backend

Run this command from the `backend/` directory:

```bash
uvicorn app.main:app --reload
```

The backend should be available at:

- API: http://127.0.0.1:8000
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

### 5. Set Up the Frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
```

The frontend uses `http://localhost:8000` as its default API URL. To override it, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

**Important:** Keep both the frontend and backend running while testing the application.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API welcome/status response |
| GET | `/health` | Check API and model readiness |
| POST | `/predict` | Submit a chest X-ray for classification |

### Prediction Request

Send a JPG, JPEG, or PNG image using `multipart/form-data` with the field name `file`. The configured maximum upload size is 10 MB.

Example response:

```json
{
  "prediction": "Normal",
  "confidence": 96.42
}
```

This is an illustrative response format, not a claim about the model's actual accuracy.

## Model Evaluation

Suitable evaluation metrics for this classification task include:

- Accuracy
- Precision and recall for each class
- F1-score
- Confusion matrix
- ROC-AUC, where appropriate

Add actual results from your completed evaluation before publishing performance claims. Do not report unverified accuracy or other metrics.

## Academic Context

- **Course:** Artificial Intelligence
- **Project:** Chest Disease Classification / XRayAI
- **Program:** B.Sc. in Software Engineering
- **Institution:** Daffodil International University
- **Model Development:** Google Colab

## Limitations and Responsible Use

- The model can produce incorrect predictions.
- Dataset bias and differences between training and real-world images may affect results.
- Confidence scores are model outputs and may not represent clinically calibrated probabilities.
- The system has not been established as clinically validated.
- Do not use the application for medical diagnosis, treatment, or clinical decision-making.

Always consult a qualified healthcare professional for medical concerns.

## Author

**MD. NADIMUL ISLAM NADIM**

- GitHub: [Nadim-593](https://github.com/Nadim-593)
- LinkedIn: Add your LinkedIn profile URL

## License

No license is currently specified for this repository. Unless a license is added, permissions for reuse and redistribution are not explicitly granted. Check the dataset's license and terms separately before redistributing any dataset files.

---

Developed as an Artificial Intelligence course project at Daffodil International University.
