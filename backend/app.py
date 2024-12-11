import pickle
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Union
from fastapi.middleware.cors import CORSMiddleware  # Correct import for FastAPI CORS

df = pd.read_csv('./output.csv')

# Load the trained model and preprocessor pipeline
with open("model.pkl", "rb") as file:
    pipeline = pickle.load(file)
    
with open("xgb_model.pkl", "rb") as file:
    model = pickle.load(file)

# Extract the preprocessor from the pipeline
preprocessor = pipeline.named_steps['preprocessor']

# Initialize FastAPI app
app = FastAPI()

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, replace with specific URLs if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# Define input schema
class InputData(BaseModel):
    data: List[Union[int, float, str]]

# Features used during training
NUMERICAL_FEATURES = ['attendance', 'english', 'math', 'science', 'social_science', 'art_culture']
CATEGORICAL_FEATURES = ['mother_education', 'father_education', 'location', 'studytime', 'school_type']
ALL_FEATURES = NUMERICAL_FEATURES + CATEGORICAL_FEATURES
for feature in CATEGORICAL_FEATURES:
    df[feature] = df[feature].astype('category')
for feature in NUMERICAL_FEATURES:
    df[feature] = df[feature].astype('float')

@app.post("/predict")
async def predict(input_data: InputData):
    try:
        # Extract raw data
        raw_data = input_data.data

        # Check input length
        if len(raw_data) != len(ALL_FEATURES):
            raise HTTPException(
                status_code=400,
                detail=f"Input data must have {len(ALL_FEATURES)} values. Received {len(raw_data)}."
            )

        # Convert input into a DataFrame
        X = pd.DataFrame([raw_data], columns=ALL_FEATURES)
        X['studytime'] = pd.cut(X['studytime'], bins=[-1, 3,6,20], labels=['Low', 'Medium', 'High'])

        # Transform input using the preprocessor
        preprocessor.fit(df)
        X = preprocessor.transform(X)
        X_transformed = X
        column_names = (
            NUMERICAL_FEATURES +  # Names of numerical features
            preprocessor.named_transformers_['cat'].get_feature_names_out(CATEGORICAL_FEATURES).tolist()  # Names of one-hot encoded features
        )
        X_transformed_df = pd.DataFrame(X_transformed, columns=column_names)
        
        # Print or inspect the DataFrame
        print(X_transformed_df)

        # Get prediction
        prediction = model.predict(X_transformed_df).tolist()

        return {"prediction": prediction[0]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")
