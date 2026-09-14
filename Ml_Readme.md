# Farmi AI — Plant Disease Detection API

Backend service that classifies plant leaf images into crop + disease using a ConvNeXt-Tiny model trained on PlantVillage + PlantDoc data.

## Model

| | |
|---|---|
| Architecture | ConvNeXt-Tiny (via `timm`) |
| Input size | 224 × 224 RGB |
| Classes | 38 (crop + disease/healthy combined, e.g. `Tomato___Late_blight`) |
| Checkpoint source | Hugging Face Hub — downloaded automatically at startup |
| Normalization | mean `[0.485, 0.456, 0.406]`, std `[0.229, 0.224, 0.225]` |
| Training data | PlantVillage (lab images) + PlantDoc (real-world images) |

The checkpoint stores `model_state_dict`, `class_names`, `class_to_idx`, and `num_classes` — the API loads class names directly from it, so no separate label file is needed.

## Model Hosting

The trained weights (`convnext_tiny.pth`, ~106 MB) are hosted on Hugging Face Hub, not committed to this repo, since GitHub's file size limit is 100 MB.

- Hosted at: `https://huggingface.co/<your-username>/farmi-ai-convnext-tiny`
- On startup, `main.py` calls `hf_hub_download()` to fetch and cache the file locally under `Model_Api/model/` — no manual download step needed.
- First run downloads the file (may take a moment depending on connection); subsequent runs use the local cache.
- If you retrain the model, re-upload the new `.pth` to the same Hugging Face repo (Files and versions → Add file → Upload files) to update it for everyone.

## Requirements

Create `Model_Api/requirements.txt`:

```
fastapi
uvicorn[standard]
torch
torchvision
timm
huggingface_hub
Pillow
python-multipart
```

## Installation & Running

```bash
cd Model_Api
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

On first launch, the server downloads the model from Hugging Face and caches it locally — this may take a moment. The server prints `Model loaded successfully.` once ready. Subsequent restarts load instantly from cache.

- Interactive API docs (Swagger UI): `http://localhost:8000/docs`
- Prediction endpoint: `http://localhost:8000/predict`

## Endpoints

### `GET /`
Basic service info.
```json
{
  "message": "Farmi AI Disease Detection API",
  "status": "running",
  "model": "ConvNeXt-Tiny",
  "classes": 38,
  "device": "cuda"
}
```

### `GET /health`
Health check for uptime monitoring.
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cuda"
}
```

### `POST /predict`
Runs disease prediction on an uploaded leaf image.

**Request**
- Content-Type: `multipart/form-data`
- Field: `file` — image file (`image/jpeg`, `image/png`, `image/jpg`, `image/webp`)

```bash
curl -X POST "http://localhost:8000/predict" \
  -F "file=@leaf.jpg"
```

**Response — 200 OK**
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

| Field | Type | Description |
|---|---|---|
| `success` | bool | Always `true` on successful prediction |
| `filename` | string | Original uploaded filename |
| `prediction` | string | Raw model class label (`Crop___Disease`) |
| `crop` | string | Cleaned crop name |
| `disease` | string | Cleaned disease name (`"Unknown"` for malformed labels) |
| `confidence` | float | Softmax confidence for the predicted class, 0–100 |

**Response — 400 Bad Request**
```json
{ "detail": "Please upload a valid image." }
```
Returned if the file's content-type isn't one of the allowed image types, or if the file can't be decoded as an image.

## Frontend Integration

The frontend (Node/AI Studio app) calls `/predict` with a `FormData` upload:

```javascript
const formData = new FormData();
formData.append("file", imageFile);

const response = await fetch("http://localhost:8000/predict", {
  method: "POST",
  body: formData
});

const result = await response.json();
// result.crop, result.disease, result.confidence
```

Frontend setup (separate from the API):
```bash
npm install
# set GEMINI_API_KEY in .env.local
npm run dev
```

## Known Limitation

Confidence scores on real-world (non-lab) photos are noticeably lower than on PlantVillage-style images due to training data distribution. Treat `confidence` below ~70% as a low-confidence result in the UI (e.g. show a warning) rather than displaying it as certain.