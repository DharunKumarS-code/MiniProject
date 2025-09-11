import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useStudentContext } from '../contexts/StudentContext';

export const DataImport = () => {
  const { importData, students } = useStudentContext();
  const [uploadStatus, setUploadStatus] = useState({});
  const [dragActive, setDragActive] = useState(null);

  const dataTypes = [
    {
      id: 'students',
      title: 'Student Details',
      description: 'Upload complete student information and contact details',
      format: 'Expected: Student ID, Name, Roll No, Grade, Section, Department, Email, Phone, Parent Name, Parent Email, Parent Phone, Address',
      icon: FileSpreadsheet,
    },
    {
      id: 'attendance',
      title: 'Attendance Records',
      description: 'Upload student attendance percentages',
      format: 'Expected: Student ID, Attendance %',
      icon: FileSpreadsheet,
    },
    {
      id: 'assessments',
      title: 'Assessment Scores',
      description: 'Upload student average scores',
      format: 'Expected: Student ID, Average Score',
      icon: FileSpreadsheet,
    },
    {
      id: 'fees',
      title: 'Fee Payment Records',
      description: 'Upload fee payment status',
      format: 'Expected: Student ID, Status (paid/due/overdue)',
      icon: FileSpreadsheet,
    },
  ];

  const handleFileUpload = (dataType, files) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadStatus(prev => ({ ...prev, [dataType]: 'pending' }));

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parsedData = parseCSV(text, dataType);
        
        if (parsedData.length > 0) {
          setUploadStatus(prev => ({ ...prev, [dataType]: 'success' }));
          importData(dataType, parsedData);
          // Show success message
          setTimeout(() => {
            alert(`Successfully imported ${parsedData.length} ${dataType} records!`);
          }, 500);
        } else {
          setUploadStatus(prev => ({ ...prev, [dataType]: 'error' }));
        }
      } catch (error) {
        console.error('File parsing error:', error);
        setUploadStatus(prev => ({ ...prev, [dataType]: 'error' }));
      }
    };
    
    reader.onerror = () => {
      setUploadStatus(prev => ({ ...prev, [dataType]: 'error' }));
    };
    
    reader.readAsText(file);
  };

  const parseCSV = (text, dataType) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      
      headers.forEach((header, index) => {
        if (values[index]) {
          row[header] = values[index];
        }
      });
      
      // Map CSV data to student data format
      const studentData = mapCSVToStudentData(row, dataType);
      if (studentData) {
        data.push(studentData);
      }
    }
    
    return data;
  };

  const mapCSVToStudentData = (row, dataType) => {
    const studentId = row['student id'] || row['studentid'] || row['id'];
    
    if (!studentId) return null;
    
    const mapped = { studentId };
    
    if (dataType === 'students') {
      mapped.name = row['name'] || row['student name'] || row['student_name'] || `Student ${studentId}`;
      mapped.rollNo = row['roll no'] || row['rollno'] || row['roll_number'];
      mapped.grade = row['grade'] || '10';
      mapped.section = row['section'] || 'A';
      mapped.department = row['department'] || row['dept'] || 'General';
      mapped.email = row['email'] || row['student email'] || row['student_email'];
      mapped.contactPhone = row['phone'] || row['contact phone'] || row['student_phone'];
      mapped.parentName = row['parent name'] || row['parent_name'] || row['guardian'];
      mapped.parentEmail = row['parent email'] || row['parent_email'] || row['guardian_email'];
      mapped.parentPhone = row['parent phone'] || row['parent_phone'] || row['guardian_phone'];
      mapped.address = row['address'] || row['home address'] || row['residential_address'];
    } else if (dataType === 'attendance') {
      const attendance = parseFloat(row['attendance'] || row['attendance %'] || row['attendance_percentage']);
      if (!isNaN(attendance)) {
        mapped.attendance = Math.min(100, Math.max(0, attendance));
      }
    } else if (dataType === 'assessments') {
      const score = parseFloat(row['score'] || row['average score'] || row['avg_score']);
      if (!isNaN(score)) {
        mapped.avgScore = Math.min(100, Math.max(0, score));
      }
    } else if (dataType === 'fees') {
      const status = (row['status'] || row['fee status'] || row['payment_status'] || '').toLowerCase();
      if (['paid', 'due', 'overdue'].includes(status)) {
        mapped.feesStatus = status;
      }
    }
    
    return mapped;
  };

  const downloadTemplate = (dataType) => {
    let csvContent = '';
    
    if (dataType === 'students') {
      csvContent = 'Student ID,Name,Roll No,Grade,Section,Department,Email,Phone,Parent Name,Parent Email,Parent Phone,Address\nSTU001,John Doe,R001,10,A,Science,john.doe@student.edu,+1-555-1001,Robert Doe,robert.doe@email.com,+1-555-2001,123 Main St\nSTU002,Jane Smith,R002,11,B,Commerce,jane.smith@student.edu,+1-555-1002,Mary Smith,mary.smith@email.com,+1-555-2002,456 Oak Ave\nSTU003,Mike Johnson,R003,10,A,Arts,mike.johnson@student.edu,+1-555-1003,David Johnson,david.johnson@email.com,+1-555-2003,789 Pine St';
    } else if (dataType === 'attendance') {
      csvContent = 'Student ID,Attendance %\nSTU001,85\nSTU002,92\nSTU003,78';
    } else if (dataType === 'assessments') {
      csvContent = 'Student ID,Average Score\nSTU001,78\nSTU002,85\nSTU003,65';
    } else if (dataType === 'fees') {
      csvContent = 'Student ID,Status\nSTU001,paid\nSTU002,due\nSTU003,overdue';
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataType}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDrag = (e, dataType) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(dataType);
    } else if (e.type === 'dragleave') {
      setDragActive(null);
    }
  };

  const handleDrop = (e, dataType) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(dataType, e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Data Import</h2>
        <p className="text-gray-600">Upload spreadsheets to automatically update student risk profiles</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Import Guidelines</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Supported formats: CSV, Excel (.xlsx, .xls)</li>
          <li>• Ensure column headers match the expected format</li>
          <li>• Student IDs must be consistent across all files</li>
          <li>• Data is automatically validated before import</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {dataTypes.map((dataType) => {
          const IconComponent = dataType.icon;
          const status = uploadStatus[dataType.id];
          
          return (
            <div key={dataType.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{dataType.title}</h3>
                  {status === 'success' && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Imported successfully</span>
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Import failed</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">{dataType.description}</p>
              <p className="text-xs text-gray-500 mb-4">{dataType.format}</p>

              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  dragActive === dataType.id
                    ? 'border-blue-400 bg-blue-50'
                    : status === 'success'
                    ? 'border-green-300 bg-green-50'
                    : status === 'error'
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={(e) => handleDrag(e, dataType.id)}
                onDragLeave={(e) => handleDrag(e, dataType.id)}
                onDragOver={(e) => handleDrag(e, dataType.id)}
                onDrop={(e) => handleDrop(e, dataType.id)}
                onClick={() => document.getElementById(`file-input-${dataType.id}`)?.click()}
              >
                {status === 'pending' ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <span className="text-sm text-gray-600">Processing...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      Drop files here or click to browse
                    </p>
                    <p className="text-xs text-gray-500">CSV, Excel files only</p>
                  </>
                )}
                
                <input
                  id={`file-input-${dataType.id}`}
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => handleFileUpload(dataType.id, e.target.files)}
                />
              </div>

              <button 
                onClick={() => downloadTemplate(dataType.id)}
                className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download Template</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Import History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-2 font-medium text-gray-900">File Name</th>
                <th className="pb-2 font-medium text-gray-900">Type</th>
                <th className="pb-2 font-medium text-gray-900">Records</th>
                <th className="pb-2 font-medium text-gray-900">Date</th>
                <th className="pb-2 font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Show message when no imports yet */}
              {students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    <p>No import history yet</p>
                    <p className="text-sm">Upload data files to see import records</p>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="py-3 text-gray-900">Recent imports</td>
                  <td className="py-3 text-gray-600">Various</td>
                  <td className="py-3 text-gray-600">{students.length}</td>
                  <td className="py-3 text-gray-600">{new Date().toLocaleDateString()}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Success</span>
                    </span>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};