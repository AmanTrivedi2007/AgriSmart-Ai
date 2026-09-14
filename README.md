<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d2344644-13b5-441f-9546-399b3f83a9fb

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
<<<<<<< HEAD
=======

To run the FastApi server, you can run the following command:
 cd Model_Api
 pip install -r requirements.txt
 uvicorn main:app --reload

waite for few seconds and you can access the FastApi server at http://localhost:8000 it will take time until it says started
process.

you can check the api in the url http://localhost:8000/docs
and you will see the output of the model in the url http://localhost:8000/predict
>>>>>>> modelCode
