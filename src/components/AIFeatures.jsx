import React, { useState } from 'react';
import { Brain, FileText, CheckSquare, GraduationCap, Upload, Download, Wand2 } from 'lucide-react';
import { askGroq } from '../services/groqService';

export const AIFeatures = () => {
  const [activeTab, setActiveTab] = useState('lesson-plan');

  const LessonPlanGenerator = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState({
      subject: '',
      topic: '',
      grade: '',
      duration: '45',
      objectives: ''
    });
    const [generatedPlan, setGeneratedPlan] = useState(null);

    const generateLessonPlan = async () => {
      setIsGenerating(true);
      try {
        const prompt = `Create a detailed lesson plan for:
Subject: ${formData.subject}
Topic: ${formData.topic}
Grade: ${formData.grade}
Duration: ${formData.duration} minutes

Respond ONLY with a valid JSON object in this exact format:
{
  "objectives": ["objective1", "objective2", "objective3"],
  "materials": ["material1", "material2", "material3", "material4"],
  "activities": [
    {"time": "0-10 min", "activity": "activity name", "description": "detailed description"},
    {"time": "10-25 min", "activity": "activity name", "description": "detailed description"},
    {"time": "25-35 min", "activity": "activity name", "description": "detailed description"},
    {"time": "35-40 min", "activity": "activity name", "description": "detailed description"},
    {"time": "40-45 min", "activity": "activity name", "description": "detailed description"}
  ],
  "assessment": ["assessment1", "assessment2", "assessment3"],
  "homework": "homework description"
}`;
        const raw = await askGroq(prompt);
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        const content = JSON.parse(jsonMatch[0]);
        setGeneratedPlan({
          title: `${formData.subject}: ${formData.topic}`,
          grade: `Grade ${formData.grade}`,
          duration: `${formData.duration} minutes`,
          ...content
        });
      } catch (e) {
        console.error('Lesson plan error:', e);
        alert('Error: ' + e.message);
      }
      setIsGenerating(false);
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-blue-600" />
            AI Lesson Plan Generator
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Mathematics, Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Quadratic Equations, Photosynthesis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Grade</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="30"
                max="120"
              />
            </div>
          </div>

          <button
            onClick={generateLessonPlan}
            disabled={isGenerating || !formData.subject || !formData.topic || !formData.grade}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Wand2 className="h-4 w-4" />
            <span>{isGenerating ? 'Generating...' : 'Generate Lesson Plan'}</span>
          </button>
        </div>

        {generatedPlan && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">{generatedPlan.title}</h4>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-2">Learning Objectives:</h5>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {generatedPlan.objectives.map((obj, index) => (
                    <li key={index}>{obj}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Materials Needed:</h5>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {generatedPlan.materials.map((material, index) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="font-medium mb-3">Lesson Activities:</h5>
              <div className="space-y-3">
                {generatedPlan.activities.map((activity, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-blue-600">{activity.time}</span>
                      <span className="font-medium">{activity.activity}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const HomeworkGenerator = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [hwFormData, setHwFormData] = useState({
      subject: '',
      chapter: '',
      difficulty: 'medium',
      questionCount: '10',
      questionTypes: ['mcq', 'short']
    });
    const [generatedHomework, setGeneratedHomework] = useState(null);

    const generateHomework = async () => {
      setIsGenerating(true);
      try {
        const prompt = `Create a homework assignment for:
Subject: ${hwFormData.subject}
Topic: ${hwFormData.chapter}
Difficulty: ${hwFormData.difficulty}
Number of questions: ${hwFormData.questionCount}

Respond ONLY with a valid JSON object in this exact format:
{
  "questions": [
    {"type": "MCQ", "question": "question text", "options": ["A) option1", "B) option2", "C) option3", "D) option4"], "answer": "A"},
    {"type": "Short Answer", "question": "question text", "points": 5},
    {"type": "Essay", "question": "question text", "points": 10}
  ]
}
Mix MCQ, Short Answer and Essay types. Make all questions specific to ${hwFormData.chapter} in ${hwFormData.subject}.`;
        const raw = await askGroq(prompt);
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        const content = JSON.parse(jsonMatch[0]);
        setGeneratedHomework({
          title: `${hwFormData.subject} - ${hwFormData.chapter} Assignment`,
          difficulty: hwFormData.difficulty,
          questions: content.questions
        });
      } catch (e) {
        console.error('Homework error:', e);
        alert('Error: ' + e.message);
      }
      setIsGenerating(false);
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CheckSquare className="h-5 w-5 mr-2 text-green-600" />
            AI Homework Generator
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={hwFormData.subject}
                onChange={(e) => setHwFormData({ ...hwFormData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Biology, Chemistry"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chapter/Topic</label>
              <input
                type="text"
                value={hwFormData.chapter}
                onChange={(e) => setHwFormData({ ...hwFormData, chapter: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Photosynthesis, Atomic Structure"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
              <select
                value={hwFormData.difficulty}
                onChange={(e) => setHwFormData({ ...hwFormData, difficulty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
              <input
                type="number"
                value={hwFormData.questionCount}
                onChange={(e) => setHwFormData({ ...hwFormData, questionCount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="5"
                max="20"
              />
            </div>
          </div>

          <button
            onClick={generateHomework}
            disabled={isGenerating || !hwFormData.subject || !hwFormData.chapter}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Wand2 className="h-4 w-4" />
            <span>{isGenerating ? 'Generating...' : 'Generate Homework'}</span>
          </button>
        </div>

        {generatedHomework && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">{generatedHomework.title}</h4>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {generatedHomework.questions.map((question, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-green-600">Q{index + 1}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{question.type}</span>
                    {question.points && <span className="text-xs text-gray-500">({question.points} points)</span>}
                  </div>
                  <p className="font-medium mb-2">{question.question}</p>
                  {question.options && (
                    <div className="ml-4 space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="text-sm text-gray-700">{option}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const AutoGrading = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [parsedQuestions, setParsedQuestions] = useState([]);
    const [manualGrades, setManualGrades] = useState({});
    const [feedback, setFeedback] = useState({});
    const [gradingResults, setGradingResults] = useState(null);

    const parseQuestions = (text) => {
      const lines = text.trim().split('\n').filter(l => l.trim());
      // Skip header row
      return lines.slice(1).map((line, i) => {
        const cols = line.split(',');
        return {
          number: i + 1,
          studentId: cols[0]?.trim(),
          studentName: cols[1]?.trim(),
          questionNo: cols[4]?.trim(),
          question: cols[5]?.trim(),
          answer: cols[6]?.trim() || 'No answer provided'
        };
      });
    };

    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploadedFile(file);
      setGradingResults(null);
      setManualGrades({});
      setFeedback({});
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target.result;
        setFileContent(text);
        setParsedQuestions(parseQuestions(text));
      };
      reader.readAsText(file);
    };

    const handleGradeChange = (qNum, status) => {
      setManualGrades(prev => ({ ...prev, [qNum]: status }));
    };

    const handleFeedbackChange = (qNum, text) => {
      setFeedback(prev => ({ ...prev, [qNum]: text }));
    };

    const submitGrading = () => {
      const total = parsedQuestions.length;
      const correct = Object.values(manualGrades).filter(s => s === 'correct').length;
      const partial = Object.values(manualGrades).filter(s => s === 'partial').length;
      const score = Math.round(((correct + partial * 0.5) / total) * 100);
      setGradingResults({
        totalQuestions: total,
        correctAnswers: correct,
        partialAnswers: partial,
        score,
        feedback: parsedQuestions.map(q => ({
          question: q.number,
          answer: q.answer,
          status: manualGrades[q.number] || 'incorrect',
          feedback: feedback[q.number] || ''
        }))
      });
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
            Manual Grading System
          </h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Upload student answer sheet (.csv)</p>
            <input type="file" onChange={handleFileUpload} accept=".csv" className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Choose File
            </label>
            {uploadedFile && <p className="mt-2 text-sm text-gray-600">Uploaded: {uploadedFile.name}</p>}
          </div>
        </div>

        {parsedQuestions.length > 0 && !gradingResults && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h4 className="text-lg font-semibold mb-4">Grade Each Answer</h4>
            <div className="space-y-4">
              {parsedQuestions.map((q) => (
                <div key={q.number} className="border rounded-lg p-4">
                  <p className="font-medium mb-1">{q.questionNo}. {q.question}</p>
                  <p className="text-xs text-gray-400 mb-1">Student: {q.studentName} ({q.studentId})</p>
                  <p className="text-sm text-gray-600 mb-3">Answer: {q.answer || 'No answer provided'}</p>
                  <div className="flex items-center gap-3 mb-2">
                    {['correct', 'partial', 'incorrect'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleGradeChange(q.number, status)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                          manualGrades[q.number] === status
                            ? status === 'correct' ? 'bg-green-500 text-white border-green-500'
                              : status === 'partial' ? 'bg-yellow-500 text-white border-yellow-500'
                              : 'bg-red-500 text-white border-red-500'
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add feedback (optional)"
                    value={feedback[q.number] || ''}
                    onChange={(e) => handleFeedbackChange(q.number, e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={submitGrading}
              disabled={Object.keys(manualGrades).length !== parsedQuestions.length}
              className="mt-4 flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Submit Grading</span>
            </button>
            {Object.keys(manualGrades).length !== parsedQuestions.length && (
              <p className="text-xs text-gray-400 mt-2">Grade all {parsedQuestions.length} questions to submit</p>
            )}
          </div>
        )}

        {gradingResults && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Grading Results</h4>
              <button
                onClick={() => { setGradingResults(null); setParsedQuestions([]); setUploadedFile(null); }}
                className="text-sm text-blue-600 hover:underline"
              >Grade Another</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{gradingResults.score}%</p>
                <p className="text-sm text-gray-600">Overall Score</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{gradingResults.correctAnswers}</p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{gradingResults.partialAnswers}</p>
                <p className="text-sm text-gray-600">Partial</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">{gradingResults.totalQuestions}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
            <div className="space-y-3">
              <h5 className="font-medium">Detailed Feedback:</h5>
              {gradingResults.feedback.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                    item.status === 'correct' ? 'bg-green-500' :
                    item.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Question {item.question}</p>
                    <p className="text-xs text-gray-500">Answer: {item.answer}</p>
                    {item.feedback && <p className="text-sm text-gray-600 mt-1">{item.feedback}</p>}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    item.status === 'correct' ? 'bg-green-100 text-green-700' :
                    item.status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'lesson-plan', label: 'Lesson Plan Generator', icon: Brain },
    { id: 'homework', label: 'Homework Generator', icon: CheckSquare },
    { id: 'grading', label: 'Auto Grading', icon: GraduationCap }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">AI Teaching Assistant</h2>
        <p className="text-gray-600">Leverage AI to enhance your teaching workflow</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div>
        {activeTab === 'lesson-plan' && <LessonPlanGenerator />}
        {activeTab === 'homework' && <HomeworkGenerator />}
        {activeTab === 'grading' && <AutoGrading />}
      </div>
    </div>
  );
};