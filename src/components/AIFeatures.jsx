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
    const [answerKey, setAnswerKey] = useState(null);
    const [studentAnswers, setStudentAnswers] = useState(null);
    const [gradingResults, setGradingResults] = useState(null);

    const parseCSV = (text) => {
      const lines = text.trim().split('\n').filter(l => l.trim());
      return lines.slice(1).map(line => {
        const cols = line.split(',');
        return { questionNo: cols[0]?.trim(), answer: cols[1]?.trim() };
      });
    };

    const handleAnswerKey = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setAnswerKey({ name: file.name, data: parseCSV(ev.target.result) });
      reader.readAsText(file);
    };

    const handleStudentAnswers = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setStudentAnswers({ name: file.name, data: parseCSV(ev.target.result) });
      reader.readAsText(file);
    };

    const gradeAnswers = () => {
      const results = answerKey.data.map((keyItem) => {
        const studentItem = studentAnswers.data.find(s => s.questionNo === keyItem.questionNo);
        const studentAns = studentItem?.answer?.trim().toLowerCase() || '';
        const correctAns = keyItem.answer?.trim().toLowerCase();
        const status = studentAns === correctAns ? 'correct' : 'incorrect';
        return {
          questionNo: keyItem.questionNo,
          correctAnswer: keyItem.answer,
          studentAnswer: studentItem?.answer || 'No answer',
          status
        };
      });

      const correct = results.filter(r => r.status === 'correct').length;
      const total = results.length;
      const score = Math.round((correct / total) * 100);
      setGradingResults({ results, correct, total, score });
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
            Auto Grading System
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 mb-1">Step 1 — Upload Answer Key</p>
              <p className="text-xs text-gray-400 mb-3">CSV format: QuestionNo, CorrectAnswer</p>
              <input type="file" accept=".csv" className="hidden" id="answer-key-upload" onChange={handleAnswerKey} />
              <label htmlFor="answer-key-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                Choose Answer Key
              </label>
              {answerKey && <p className="mt-2 text-xs text-green-600">✅ {answerKey.name} ({answerKey.data.length} questions)</p>}
            </div>

            <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700 mb-1">Step 2 — Upload Student Answers</p>
              <p className="text-xs text-gray-400 mb-3">CSV format: QuestionNo, StudentAnswer</p>
              <input type="file" accept=".csv" className="hidden" id="student-answer-upload" onChange={handleStudentAnswers} />
              <label htmlFor="student-answer-upload" className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                Choose Student Answers
              </label>
              {studentAnswers && <p className="mt-2 text-xs text-green-600">✅ {studentAnswers.name} ({studentAnswers.data.length} answers)</p>}
            </div>
          </div>

          <button
            onClick={gradeAnswers}
            disabled={!answerKey || !studentAnswers}
            className="mt-6 flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <GraduationCap className="h-4 w-4" />
            <span>Grade Now</span>
          </button>
        </div>

        {gradingResults && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Grading Results</h4>
              <button onClick={() => { setGradingResults(null); setAnswerKey(null); setStudentAnswers(null); }}
                className="text-sm text-blue-600 hover:underline">Grade Another</button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{gradingResults.score}%</p>
                <p className="text-sm text-gray-600">Score</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{gradingResults.correct}</p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">{gradingResults.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>

            <div className="space-y-3">
              {gradingResults.results.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${item.status === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.questionNo}</p>
                    <p className="text-xs text-gray-500">Correct: {item.correctAnswer}</p>
                    <p className="text-xs text-gray-500">Student: {item.studentAnswer}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.status === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.status}
                  </span>
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