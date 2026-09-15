# AgriSmart AI — Intelligent Agriculture for a Sustainable Future

AgriSmart AI is an intelligent agriculture platform that combines computer vision and Generative AI to help farmers identify crop diseases and receive actionable guidance for managing affected crops.

The core AI system analyzes a plant-leaf image and classifies it into one of 38 crop-disease or healthy classes. The prediction is returned with the crop, disease/health status, and confidence score. A Generative AI advisory feature can then provide guidance on how to work with and manage the detected disease.

---

## Features

### Core Module

- AI-powered crop disease detection from plant-leaf images
- 38-class crop disease/health classification
- Crop and disease identification
- Confidence score for predictions
- Disease-specific recommendations and precautions
- Image upload and diagnosis report
- Low-confidence indication for predictions below the configured confidence threshold

### AI Advisory

- Generative AI-based disease advisory
- Provides guidance based on the detected crop disease
- Helps users understand how to manage and respond to a detected disease
- Provides practical recommendations in a farmer-friendly format

### Data Storage

- Uploaded leaf images are stored using Supabase Storage
- Diagnosis information is stored in Supabase
- Diagnosis records contain prediction information and relevant farm details

---

# Project Architecture

```text
                         ┌──────────────────────┐
                         │      User / Farmer   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React + TypeScript  │
                         │      Frontend        │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
                    ▼                                ▼
          ┌──────────────────┐             ┌──────────────────┐
          │ Supabase Storage │             │   FastAPI API    │
          │   Leaf Images    │             │   /predict       │
          └──────────────────┘             └────────┬─────────┘
                                                    │
                                                    ▼
                                           ┌──────────────────┐
                                           │  ConvNeXt-Tiny   │
                                           │   38 Classes     │
                                           └────────┬─────────┘
                                                    │
                                      Crop + Disease + Confidence
                                                    │
                                                    ▼
                                           ┌──────────────────┐
                                           │ Diagnosis Report │
                                           └────────┬─────────┘
                                                    │
                                                    ▼
                                           ┌──────────────────┐
                                           │ Generative AI    │
                                           │ Disease Advisor  │
                                           └──────────────────┘

                         Supabase Database
                         └── Diagnosis Records
```

---

# Repository Structure

```text
AgriSmart-Ai/
│
├── app/
│   ├── src/
│   ├── supabase/
│   ├── .env.local
│   ├── index.html
│   ├── metadata.json
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── Model/
│   └── Model_api/
│       ├── model/
│       ├── AgroSmart.ipynb
│       ├── main.py
│       └── requirements.txt
│
├── report/
│
├── .gitignore
├── MI_Readme.md
├── README.md
└── requirements.txt
```

The trained model checkpoint is not stored in the GitHub repository because of its file size. The backend downloads the checkpoint from Hugging Face automatically when the model API starts.

---

# Prerequisites

Install the following before running the project:

- Git
- Node.js and npm
- Python 3
- A working internet connection

Verify the installations:

```powershell
git --version
node --version
npm --version
py --version
```

---

# Setup and Run Locally

## Step 1 — Clone the Repository

Clone the repository and enter the project directory:

```powershell
git clone <REPOSITORY_URL>
cd AgriSmart-Ai
```

---

## Step 2 — Switch to the Main Branch

Make sure you are using the latest version of the project:

```powershell
git checkout main
git pull origin main
```

---

# Frontend Setup

## Step 3 — Enter the Frontend Directory

The frontend source code and frontend configuration are inside the `app` directory.

```powershell
cd app
```

---

## Step 4 — Install Frontend Dependencies

Use `npm.cmd` to install the required packages:

```powershell
npm.cmd install
```

---

## Step 5 — Configure Supabase

Inside the `app` directory, create a file named:

```text
.env.local
```

Add the Supabase project URL and anon key provided by the project team:

```env
VITE_SUPABASE_URL=https://amrkhvszctilhhzeowoq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcmtodnN6Y3RpbGhoemVvd29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0ODU5MTUsImV4cCI6MjA5MDA2MTkxNX0.nKUiw_jD7gYLL0UIPM3Ek3G0qnEDXWqY5opczqynJZ0
```

Do not commit `.env.local` to GitHub.

The frontend uses Supabase for:

- Image storage
- Diagnosis record storage
- Supabase-backed application functionality

---

## Step 6 — Start the Frontend

From the `app` directory:

```powershell
npm.cmd run dev
```

Keep this terminal running.

Vite will display the local frontend URL in the terminal. The application is normally available at:

```text
http://localhost:3000
```

---

# Model API Setup

## Step 7 — Open a Second Terminal

Open another PowerShell terminal and return to the repository root:

```powershell
cd ..
```

You should now be back inside:

```text
AgriSmart-Ai/
```

---

## Step 8 — Enter the Model API Directory

The FastAPI backend is located inside:

```text
Model/Model_api/
```

Run:

```powershell
cd Model\Model_api
```

---

## Step 9 — Install Python Dependencies

Install the backend requirements:

```powershell
py -m pip install -r requirements.txt
```

---

## Step 10 — Start the FastAPI Server

Run:

```powershell
py -m uvicorn main:app --reload
```

Wait for the terminal to show that the application has started.

The first startup may take longer because the trained model checkpoint is downloaded from Hugging Face and cached locally.

---

## Step 11 — Verify the FastAPI Server

Open the following URL in a browser:

```text
http://localhost:8000
```

The API also provides interactive Swagger documentation at:

```text
http://localhost:8000/docs
```

The main prediction endpoint is:

```text
POST http://localhost:8000/predict
```

The health-check endpoint is:

```text
GET http://localhost:8000/health
```

The FastAPI server must remain running while using the disease-detection functionality in the frontend.

---

# Running the Complete Application

Two terminals should be running at the same time.

### Terminal 1 — Frontend

```powershell
cd AgriSmart-Ai\app
npm.cmd run dev
```

### Terminal 2 — Model API

```powershell
cd AgriSmart-Ai\Model\Model_api
py -m uvicorn main:app --reload
```

Then open the frontend URL provided by Vite.

The disease-detection flow is:

```text
Upload Leaf Image
       ↓
React Frontend
       ↓
FastAPI /predict
       ↓
Image Preprocessing
       ↓
ConvNeXt-Tiny
       ↓
38-Class Prediction
       ↓
Crop + Disease + Confidence
       ↓
Diagnosis Report
       ↓
Generative AI Disease Advisory
```

---

# AI Crop Disease Detection

The core AI task is to classify a plant leaf image into one of 38 crop-disease or healthy classes.

Each class jointly represents:

- Crop type
- Disease or healthy status

The predicted class is then separated into crop and disease fields for use by the application.

The model supports 14 crops:

- Apple
- Blueberry
- Cherry
- Corn
- Grape
- Orange
- Peach
- Pepper (bell)
- Potato
- Raspberry
- Soybean
- Squash
- Strawberry
- Tomato

---

# Model

## Architecture

**ConvNeXt-Tiny**

- Framework: PyTorch
- Architecture source: `timm`
- Backbone: ImageNet-pretrained ConvNeXt-Tiny
- Fine-tuned end-to-end
- Input: 224 × 224 RGB image
- Output: 38-class classification
- Output activation: Softmax
- Approximately 28 million parameters

ConvNeXt-Tiny was selected to improve fine-grained disease classification while remaining practical for training and inference.

The model was compared against an EfficientNet-B0 baseline.

---

# Dataset

The model was trained using a combination of:

### PlantVillage

PlantVillage provides controlled plant-leaf images and forms the primary dataset used for the disease classification task.

### PlantDoc

PlantDoc was added to introduce more real-world variation, including:

- Natural backgrounds
- Different lighting conditions
- Phone-camera images
- Different leaf orientations

A total of 2,922 PlantDoc images were added across overlapping classes.

The final dataset contains 38 classes.

---

# Dataset Split

The final merged dataset was divided using an approximately 80/20 train/test split.

```text
Training images: 45,781
Test images:     11,446
Total:           57,227
```

The split uses a fixed random seed of:

```text
42
```

The test set is disjoint from the training set.

### Important Evaluation Note

The reported test set is a random split of the merged PlantVillage + PlantDoc dataset. It is not a completely independent field-only holdout.

Therefore, the reported metrics represent performance on the evaluated dataset distribution and should not be interpreted as guaranteed real-world field accuracy.

The official SIH evaluation uses an unseen organizer-provided field-condition test set.

---

# Training

Training was performed using Kaggle Notebooks with a Tesla T4 GPU.

```text
Platform:        Kaggle Notebooks
GPU:             Tesla T4
Maximum epochs:  25
Actual epochs:   16
Best epoch:      11
Training time:   approximately 88 minutes
```

Early stopping was based on validation Macro-F1.

---

# Training Configuration

| Parameter | Value |
|---|---|
| Architecture | ConvNeXt-Tiny |
| Optimizer | AdamW |
| Learning Rate | 5e-5 |
| Weight Decay | 1e-4 |
| Loss | Class-weighted Cross-Entropy |
| Precision | Mixed Precision / FP16 |
| Scheduler | ReduceLROnPlateau |
| Maximum Epochs | 25 |
| Early Stopping Patience | 5 |
| Best Epoch | 11 |
| Input Size | 224 × 224 |
| Number of Classes | 38 |

---

# Techniques Used

## Class-Weighted Loss

The dataset contains class imbalance.

Inverse-frequency class weights were applied to CrossEntropyLoss so that minority classes contribute proportionally more to the training objective.

This was used to reduce the tendency of the model to favor majority classes.

## PlantDoc Data Integration

PlantDoc images were merged with PlantVillage data to expose the model to more realistic image conditions and reduce the laboratory-to-field domain gap.

## Data Augmentation

The training pipeline uses stronger augmentation including:

- ColorJitter
- RandomPerspective
- RandomAffine
- RandomErasing

These augmentations introduce variation in lighting, camera angle, framing and partial occlusion.

## Macro-F1 Based Model Selection

Macro-F1 was used for model selection and early stopping instead of relying only on accuracy.

This gives every class equal importance and helps identify performance problems in minority classes.

---

# Model Evaluation

The model was evaluated on the held-out test set of 11,446 images.

## Results

| Metric | Result |
|---|---:|
| Accuracy | **98.68%** |
| Macro-F1 | **97.99%** |
| Weighted F1 | **98.68%** |

**Macro-F1 is the primary evaluation metric** because it gives equal importance to all classes rather than allowing large classes to dominate the overall score.

A 38 × 38 confusion matrix was also generated to identify class-level confusion patterns.

Per-class precision, recall and F1-score were calculated for all 38 classes.

---

# Confusion Matrix

The confusion matrix evaluates how the model's predictions compare with the actual class labels.

```text
Rows    = Actual Classes
Columns = Predicted Classes
Diagonal = Correct Predictions
Off-Diagonal = Misclassifications
```

The confusion matrix is used to identify specific disease pairs that the model has difficulty distinguishing.

The full confusion matrix and per-class evaluation results are included in the model report.

---

# Model Performance Highlights

The strongest-performing classes include several classes with F1-scores of 1.00.

The five weakest-performing classes in the reported evaluation were:

| Class | F1-Score |
|---|---:|
| Corn Cercospora Leaf Spot / Gray Leaf Spot | 0.9030 |
| Tomato Tomato Mosaic Virus | 0.9079 |
| Corn Northern Leaf Blight | 0.9399 |
| Potato Early Blight | 0.9480 |
| Tomato Early Blight | 0.9546 |

These classes contain visually similar symptoms and/or relatively fewer samples.

---

# Baseline Comparison

An EfficientNet-B0 model trained using PlantVillage-only data was used as a baseline.

The ConvNeXt-Tiny model was trained using:

- PlantVillage + PlantDoc
- Class-weighted loss
- Stronger augmentation

The reported EfficientNet-B0 and ConvNeXt-Tiny Macro-F1 values are **not directly comparable** because they were evaluated on different test distributions.

The EfficientNet-B0 baseline was evaluated on a PlantVillage-only test distribution, while the ConvNeXt-Tiny model was evaluated on the more difficult merged PlantVillage + PlantDoc test distribution.

---

# Backend — FastAPI

The trained model is served using FastAPI.

The frontend sends an image to the backend and receives a structured JSON prediction.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Service information |
| GET | `/health` | Health check |
| POST | `/predict` | Crop disease prediction |

## Prediction Request

`POST /predict`

The request uses:

```text
multipart/form-data
```

with a single file field:

```text
file
```

Supported image formats include:

- JPEG
- JPG
- PNG
- WEBP

## Prediction Response

Example:

```json
{
  "success": true,
  "filename": "leaf.jpg",
  "prediction": "Tomato___Late_blight",
  "crop": "Tomato",
  "disease": "Late blight",
  "confidence": 97.42
}
```

Invalid or unsupported images return a `400 Bad Request` response.

---

# Inference Pipeline

The inference process follows these steps:

1. The frontend sends the leaf image to `POST /predict`.
2. The backend validates the uploaded file.
3. The image is decoded using Pillow.
4. The image is converted to RGB.
5. The image is resized to 224 × 224.
6. ImageNet normalization is applied.
7. The processed image is passed through ConvNeXt-Tiny.
8. Model logits are converted into probabilities using softmax.
9. The highest-probability class is selected.
10. The class name is separated into crop and disease fields.
11. The API returns the crop, disease and confidence score.
12. The frontend displays the diagnosis report.
13. The diagnosis can then be used by the Generative AI advisory feature.

---

# Model Hosting

The trained model checkpoint is hosted on Hugging Face rather than being committed to GitHub.

Hugging Face repository:

```text
https://huggingface.co/AmanTrivedi123/AgroSamrt
```

Model file:

```text
convnext_tiny_best.pth
```

The backend uses `huggingface_hub` to automatically download and cache the model when the FastAPI server starts.

This means that a developer does not need to manually download the model checkpoint.

---

# Generative AI Disease Advisor

AgriSmart AI also includes a Generative AI feature for providing guidance related to the detected crop disease.

The advisory component uses the disease identified by the crop-disease detection system to help generate practical guidance for the user.

The overall flow is:

```text
Leaf Image
    ↓
Disease Detection Model
    ↓
Detected Crop + Disease
    ↓
Generative AI Advisor
    ↓
Disease Management Guidance
```

The disease detection model remains the core classification system, while Generative AI is used as an advisory layer to make the prediction more useful to the farmer.

AI-generated advice should be treated as guidance and not as a substitute for professional agricultural consultation.

---

# Supabase

Supabase is used for application data storage.

### Storage

Uploaded leaf images are stored in the Supabase Storage bucket:

```text
leaf images
```

### Database

Diagnosis records are stored in the:

```text
diagnose
```

table.

The diagnosis record can contain information such as:

- Image URL
- Prediction confidence
- Crop
- Growth stage
- Soil type
- pH
- Moisture
- Temperature
- Rain probability
- Location

---

# Environment Variables

The frontend requires Supabase configuration in:

```text
app/.env.local
```

Example:

```env
VITE_SUPABASE_URL=<SUPABASE_URL>
VITE_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>
```

If additional API keys are required by the Generative AI functionality, configure them using the environment-variable names already defined by the application and obtain the values from the project team.

Do not commit API keys, private credentials, service-role keys or `.env.local` to GitHub.

---

# Known Limitations

### 1. Domain Gap

Although PlantDoc was added to improve real-world robustness, it represents only a small portion of the overall dataset.

Images with conditions significantly different from both PlantVillage and PlantDoc may still produce incorrect predictions.

Examples include:

- Extreme lighting
- Very blurry images
- Multiple leaves in one image
- Complex backgrounds
- Poor-quality phone images
- Unusual leaf orientations

### 2. Test Set Limitation

The 11,446-image test set is a random split from the merged dataset and is not a completely independent field-only benchmark.

Therefore:

> The reported 98.68% accuracy and 97.99% Macro-F1 should not be interpreted as guaranteed field deployment performance.

### 3. Visually Similar Diseases

Some disease classes have visually similar symptoms.

The weakest classes include:

- Corn Gray Leaf Spot
- Tomato Mosaic Virus
- Corn Northern Leaf Blight
- Potato Early Blight
- Tomato Early Blight

### 4. Minority Classes

Some classes have relatively few test samples.

For example, Tomato Mosaic Virus had only 74 test samples in the reported evaluation.

Class-weighted training was used to reduce this issue, but minority-class performance remains a challenge.

### 5. Unknown Images

The classifier is a closed-set 38-class model.

It always selects one of its known classes rather than having a dedicated "unknown image" class.

The API/UI can indicate low-confidence predictions, but low confidence does not guarantee that an image is outside the model's supported classes.

---

# Reproducibility

The training process used:

```text
Random seed: 42
```

The training notebook is:

```text
notebook72125912e4__1_.ipynb
```

The model checkpoint contains:

- Model state dictionary
- Class names
- Class-to-index mapping
- Number of classes
- Best Macro-F1
- Training history

The backend automatically downloads the checkpoint from Hugging Face, so manual model-file handling is not required.

---

# Quick Start

For experienced users, the complete setup is:

### Terminal 1 — Frontend

```powershell
git clone <REPOSITORY_URL>
cd AgriSmart-Ai
git checkout main
git pull origin main

cd app
npm.cmd install
```

Create:

```text
.env.local
```

and configure:

```env
VITE_SUPABASE_URL=<SUPABASE_URL>
VITE_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>
```

Then run:

```powershell
npm.cmd run dev
```

### Terminal 2 — Model API

```powershell
cd AgriSmart-Ai\Model\Model_api
py -m pip install -r requirements.txt
py -m uvicorn main:app --reload
```

Open the frontend using the URL shown by Vite.

FastAPI documentation:

```text
http://localhost:8000/docs
```

---

# Demo

## Demo Video

> **Demo video will be added here.**

```text

Uploading 15.09.2026_17.57.07_REC.mp4…

```

The demonstration will show the complete application workflow, including crop disease detection and the Generative AI disease advisory feature.

---

# Deployed Application

> **Deployment link will be added here.**

```text
[Deployed Application Link]
```

---

# Project Requirements

This project addresses the core SIH requirement of AI-powered crop disease detection from leaf/crop images.

The core system includes:

- A trained crop disease classification model
- 38 crop-disease/healthy classes
- Held-out test evaluation
- Macro-F1 evaluation
- Confusion matrix
- Per-class precision, recall and F1
- A functional prediction interface
- Backend inference API
- Crop and disease output
- Confidence score
- Advisory guidance

Additional functionality includes Generative AI-based disease advisory.

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite

## Backend

- Python
- FastAPI
- Uvicorn

## Machine Learning

- PyTorch
- torchvision
- timm
- ConvNeXt-Tiny
- scikit-learn
- Pillow

## Model Hosting

- Hugging Face Hub
- `huggingface_hub`

## Database and Storage

- Supabase

## Training

- Kaggle Notebooks
- Tesla T4 GPU

---

# License and Dataset Attribution

The project uses publicly available datasets for model development.

### PlantVillage

PlantVillage was used as the primary dataset for crop disease classification.

### PlantDoc

PlantDoc was used as a supplementary real-world dataset to improve robustness to natural image conditions.

Users and evaluators should refer to the original dataset repositories and their respective licenses/terms of use before redistributing dataset images.

The trained model weights are hosted separately on Hugging Face.

---

# Important Evaluation Note

The internal evaluation results reported in this repository are:

```text
Accuracy:  98.68%
Macro-F1:  97.99%
```

These results were obtained on the project's held-out 11,446-image test split.

They are **not the official SIH field-test score**.

The official SIH evaluation is performed using the organizers' unseen field-condition test set.

---

# Team

**AgriSmart AI**

Built for the Smart India Hackathon 2026.

---
