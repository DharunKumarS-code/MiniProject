// ML model for student dropout prediction
class StudentRiskPredictor {
  constructor() {
    // Your Python model weights/parameters (replace with actual values)
    this.modelWeights = {
      attendance: -0.045,
      assessment: -0.038, 
      fees: 0.75,
      bias: 2.8
    };
    
    this.useAPI = true; // Set to true to use Python API, false for local JS
  }
  
  // Call Python API
  async predictWithAPI(attendance, assessmentScore, fees) {
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendance,
          assessment_score: assessmentScore,
          fees
        })
      });
      
      const result = await response.json();
      return result.dropout_score;
    } catch (error) {
      console.error('API call failed, using fallback model:', error);
      return this.predictLocal(attendance, assessmentScore, fees);
    }
  }
  
  // Local JavaScript implementation of your Python model
  predictLocal(attendance, assessmentScore, fees) {
    // Replace this with your actual Python model logic converted to JS
    const linearScore = 
      attendance * this.modelWeights.attendance +
      assessmentScore * this.modelWeights.assessment +
      fees * this.modelWeights.fees +
      this.modelWeights.bias;
    
    // Apply sigmoid or your model's activation function
    const dropoutScore = this.sigmoid(linearScore) * 100;
    return Math.round(dropoutScore);
  }

  // Sigmoid activation function
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  // Feature engineering
  extractFeatures(student) {
    const attendance = student.attendance || 100;
    const avgScore = student.avgScore || 85;
    const grade = parseInt(student.grade) || 10;
    
    // Convert fee status to numeric
    let feeStatusScore = 0;
    if (student.feesStatus === 'overdue') feeStatusScore = 2;
    else if (student.feesStatus === 'due') feeStatusScore = 1;
    
    return {
      attendance,
      avgScore,
      feeStatus: feeStatusScore,
      grade,
      combinedRisk: (100 - attendance) * 0.4 + (100 - avgScore) * 0.4 + feeStatusScore * 20
    };
  }

  // Main prediction function
  async predict(student) {
    const features = this.extractFeatures(student);
    
    let dropoutScore;
    
    if (this.useAPI) {
      // Use Python API
      dropoutScore = await this.predictWithAPI(
        features.attendance, 
        features.avgScore, 
        features.feeStatus
      );
    } else {
      // Use local JavaScript model
      dropoutScore = this.predictLocal(
        features.attendance, 
        features.avgScore, 
        features.feeStatus
      );
    }
    
    const riskProbability = dropoutScore / 100;
    const dataCompleteness = this.calculateDataCompleteness(student);
    const confidence = Math.min(0.95, 0.6 + (dataCompleteness * 0.35));
    
    return {
      riskProbability: dropoutScore,
      confidence: Math.round(confidence * 100),
      factors: this.getKeyFactors(features),
      recommendation: this.getRecommendation(riskProbability),
      timeframe: this.getTimeframe(riskProbability)
    };
  }

  calculateDataCompleteness(student) {
    const fields = ['attendance', 'avgScore', 'feesStatus', 'grade'];
    const completedFields = fields.filter(field => 
      student[field] !== undefined && student[field] !== null && student[field] !== ''
    ).length;
    return completedFields / fields.length;
  }

  getKeyFactors(features) {
    const factors = [];
    
    if (features.attendance < 75) {
      factors.push(`Low attendance (${features.attendance}%)`);
    }
    if (features.avgScore < 60) {
      factors.push(`Poor academic performance (${features.avgScore}%)`);
    }
    if (features.feeStatus > 0) {
      factors.push(features.feeStatus === 2 ? 'Overdue fees' : 'Pending fees');
    }
    
    return factors.length > 0 ? factors : ['No significant risk factors identified'];
  }

  getRecommendation(probability) {
    if (probability > 0.7) {
      return 'Immediate intervention required. Schedule parent meeting and create support plan.';
    } else if (probability > 0.4) {
      return 'Monitor closely. Consider additional support and regular check-ins.';
    } else {
      return 'Continue current approach. Maintain regular monitoring.';
    }
  }

  getTimeframe(probability) {
    if (probability > 0.7) return '1-2 weeks';
    if (probability > 0.4) return '2-4 weeks';
    return '1-2 months';
  }
}

// Export singleton instance
export const mlPredictor = new StudentRiskPredictor();

export const predictStudentRisk = (student) => {
  return mlPredictor.predict(student);
};