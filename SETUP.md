# EduWatch Setup Instructions

## Frontend Setup (React)

1. Install Node.js dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open browser: http://localhost:5173

## Backend Setup (Python ML API)

1. Navigate to backend folder:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Replace the placeholder model in `ml_api.py`:
   - Load your trained model: `model = joblib.load('your_model.pkl')`
   - Replace the DropoutPredictor class with your actual model

4. Start the Python API:
```bash
python ml_api.py
```

5. API will run on: http://localhost:5000

## Configuration

- To use Python ML API: Keep `this.useAPI = true` in `src/services/mlService.js`
- To use JavaScript fallback: Set `this.useAPI = false`

## Demo Credentials

- Admin: admin@school.edu / admin123
- Teacher: john.doe@school.edu / teacher123