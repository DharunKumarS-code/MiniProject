import React, { useState } from 'react';
import { Brain, FileText, CheckSquare, GraduationCap, Upload, Download, Wand2 } from 'lucide-react';

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
      // Simulate AI generation
      setTimeout(() => {
        const plan = {
          title: `${formData.subject}: ${formData.topic}`,
          grade: formData.grade,
          duration: `${formData.duration} minutes`,
          objectives: [
            `Students will understand the key concepts of ${formData.topic}`,
            `Students will be able to apply ${formData.topic} in practical scenarios`,
            `Students will demonstrate mastery through assessment activities`
          ],
          materials: ['Whiteboard', 'Textbook', 'Worksheets', 'Digital presentation'],
          activities: [
            { time: '0-10 min', activity: 'Introduction and warm-up', description: `Brief review of previous lesson and introduction to ${formData.topic}` },
            { time: '10-25 min', activity: 'Main instruction', description: `Detailed explanation of ${formData.topic} with examples` },
            { time: '25-35 min', activity: 'Guided practice', description: 'Students work through problems with teacher guidance' },
            { time: '35-40 min', activity: 'Independent practice', description: 'Students complete exercises individually' },
            { time: '40-45 min', activity: 'Wrap-up and homework', description: 'Summary of key points and assignment of homework' }
          ],
          assessment: [
            'Formative: Observation during guided practice',
            'Summative: Exit ticket with 3 key questions',
            'Homework: Practice problems for reinforcement'
          ],
          homework: `Complete exercises 1-10 on ${formData.topic} from textbook pages 45-47`
        };
        setGeneratedPlan(plan);
        setIsGenerating(false);
      }, 2000);
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
      setTimeout(() => {
        const homework = {
          title: `${hwFormData.subject} - ${hwFormData.chapter} Assignment`,
          difficulty: hwFormData.difficulty,
          questions: [
            { type: 'MCQ', question: 'What is the primary function of chlorophyll in plants?', options: ['A) Water absorption', 'B) Photosynthesis', 'C) Root growth', 'D) Seed production'], answer: 'B' },
            { type: 'Short Answer', question: 'Explain the process of photosynthesis in 2-3 sentences.', points: 5 },
            { type: 'MCQ', question: 'Which organelle is responsible for photosynthesis?', options: ['A) Nucleus', 'B) Mitochondria', 'C) Chloroplast', 'D) Ribosome'], answer: 'C' },
            { type: 'Essay', question: 'Discuss the importance of photosynthesis in the ecosystem and its impact on life on Earth.', points: 10 }
          ]
        };
        setGeneratedHomework(homework);
        setIsGenerating(false);
      }, 1500);
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
    const [gradingResults, setGradingResults] = useState(null);

    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setUploadedFile(file);
        // Simulate grading process
        setTimeout(() => {
          setGradingResults({
            totalQuestions: 10,
            correctAnswers: 7,
            score: 70,
            feedback: [
              { question: 1, status: 'correct', feedback: 'Excellent understanding of the concept' },
              { question: 2, status: 'incorrect', feedback: 'Review the definition of photosynthesis' },
              { question: 3, status: 'correct', feedback: 'Good application of knowledge' },
              { question: 4, status: 'partial', feedback: 'Partially correct, needs more detail' }
            ]
          });
        }, 2000);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-purple-600" />
            AI Auto Grading System
          </h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Upload student answer sheets or text submissions</p>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.png,.txt,.docx"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Choose File
            </label>
            {uploadedFile && (
              <p className="mt-2 text-sm text-gray-600">Uploaded: {uploadedFile.name}</p>
            )}
          </div>
        </div>

        {gradingResults && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h4 className="text-lg font-semibold mb-4">Grading Results</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{gradingResults.score}%</p>
                <p className="text-sm text-gray-600">Overall Score</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{gradingResults.correctAnswers}</p>
                <p className="text-sm text-gray-600">Correct Answers</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">{gradingResults.totalQuestions}</p>
                <p className="text-sm text-gray-600">Total Questions</p>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-medium">Detailed Feedback:</h5>
              {gradingResults.feedback.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    item.status === 'correct' ? 'bg-green-500' : 
                    item.status === 'incorrect' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="font-medium">Question {item.question}</p>
                    <p className="text-sm text-gray-600">{item.feedback}</p>
                  </div>
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