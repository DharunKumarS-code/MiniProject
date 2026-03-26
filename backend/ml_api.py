from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load your trained model (replace with your actual model file)
# model = joblib.load('dropout_model.pkl')

# Placeholder for your actual model - replace this with your trained model
class DropoutPredictor:
    def predict(self, features):
        # Replace this with your actual model prediction
        attendance, assessment, fees = features[0]
        
        # Your model logic here
        # Example: dropout_score = model.predict([[attendance, assessment, fees]])[0]
        
        # Placeholder calculation - replace with your model
        dropout_score = (100 - attendance) * 0.4 + (100 - assessment) * 0.4 + fees * 10
        dropout_probability = min(100, max(0, dropout_score))
        
        return dropout_probability

model = DropoutPredictor()

@app.route('/predict', methods=['POST'])
def predict_dropout():
    try:
        data = request.json
        attendance = data.get('attendance', 100)
        assessment_score = data.get('assessment_score', 85)
        fees = data.get('fees', 0)  # 0=paid, 1=due, 2=overdue
        
        # Prepare features for your model
        features = np.array([[attendance, assessment_score, fees]])
        
        # Get prediction from your model
        dropout_score = model.predict(features)
        
        return jsonify({
            'dropout_score': float(dropout_score),
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)