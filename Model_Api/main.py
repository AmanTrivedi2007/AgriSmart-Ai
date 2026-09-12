import io
import os

import torch
import torch.nn.functional as F
import timm

from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from torchvision import transforms


# ============================================================
# CONFIGURATION
# ============================================================

MODEL_PATH = "model/efficientnet_b0_best.pth"

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

IMAGE_SIZE = 224


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Farmi AI Disease Detection API",
    description="Plant disease detection using EfficientNet-B0",
    version="1.0.0"
)


# ============================================================
# LOAD MODEL
# ============================================================

print("Loading model...")

checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE
)

class_names = checkpoint["class_names"]
num_classes = checkpoint["num_classes"]

model = timm.create_model(
    "efficientnet_b0",
    pretrained=False,
    num_classes=num_classes
)

model.load_state_dict(checkpoint["model_state_dict"])

model = model.to(DEVICE)
model.eval()

print(f"Model loaded successfully.")
print(f"Classes: {num_classes}")
print(f"Device: {DEVICE}")


# ============================================================
# IMAGE PREPROCESSING
# ============================================================

transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def clean_class_name(class_name):
    """
    Converts PlantVillage class naming into
    crop + disease information.
    """

    parts = class_name.split("___")

    crop = parts[0].replace("_", " ")

    if len(parts) > 1:
        disease = parts[1].replace("_", " ")
    else:
        disease = "Unknown"

    return crop, disease


def predict_image(image):
    """
    Run model prediction on a PIL image.
    """

    image_tensor = transform(image)

    image_tensor = image_tensor.unsqueeze(0)

    image_tensor = image_tensor.to(DEVICE)

    with torch.no_grad():

        outputs = model(image_tensor)

        probabilities = F.softmax(
            outputs,
            dim=1
        )

        confidence, predicted = torch.max(
            probabilities,
            dim=1
        )

    predicted_index = predicted.item()

    predicted_class = class_names[predicted_index]

    confidence_score = confidence.item()

    crop, disease = clean_class_name(
        predicted_class
    )

    return {
        "prediction": predicted_class,
        "crop": crop,
        "disease": disease,
        "confidence": round(
            confidence_score * 100,
            2
        )
    }


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():

    return {
        "message": "Farmi AI Disease Detection API",
        "status": "running",
        "model": "EfficientNet-B0",
        "classes": num_classes,
        "device": str(DEVICE)
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(DEVICE)
    }


# ============================================================
# PREDICTION ENDPOINT
# ============================================================

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    # --------------------------------------------------------
    # Check file type
    # --------------------------------------------------------

    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp"
    ]

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image."
        )

    # --------------------------------------------------------
    # Read image
    # --------------------------------------------------------

    try:

        image_bytes = await file.read()

        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Unable to read image."
        )

    # --------------------------------------------------------
    # Prediction
    # --------------------------------------------------------

    result = predict_image(image)

    # --------------------------------------------------------
    # Response
    # --------------------------------------------------------

    return {
        "success": True,
        "filename": file.filename,
        **result
    }