type Question = {
  isActive: boolean;
  id: string;
  text: string;
  type: 'MCQ' | 'TEXT';
  options?: string[];
};



import { useState } from 'react';
import {
  useGetQuestionsQuery,
  useSetActiveQuestionMutation,
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
} from '../../features/api/apiSlice';

function AdminDashboard() {
  const { data: questions, isLoading, isError, refetch } = useGetQuestionsQuery(undefined);
  const [setActiveQuestion] = useSetActiveQuestionMutation();
  const [createQuestion] = useCreateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState<'TEXT' | 'MCQ'>('TEXT');
  const [options, setOptions] = useState<string[]>(['']);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleSetActive = async (id: string) => {
    try {
      await setActiveQuestion({ questionId: id }).unwrap();
      // Show success notification instead of alert
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestionText.trim()) return;

    try {
      await createQuestion({
        text: newQuestionText,
        type: newQuestionType,
        options: newQuestionType === 'MCQ' ? options.filter((opt) => opt.trim()) : [],
      }).unwrap();

      setNewQuestionText('');
      setOptions(['']);
      setNewQuestionType('TEXT');
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await deleteQuestion(id).unwrap();
      setShowDeleteConfirm(null);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <p className="text-red-600 font-medium text-center">Failed to load dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-800">Admin Dashboard</h1>
                <p className="text-sm text-slate-500">Manage questions and responses</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Question Section - Compact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">Add Question</h2>
                    <p className="text-xs text-slate-500">Create new question</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="space-y-4">
                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Question Text
                    </label>
                    <textarea
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-slate-700 placeholder-slate-400 text-sm"
                      rows={3}
                      placeholder="Enter your question..."
                    />
                  </div>

                  {/* Question Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Type
                    </label>
                    <select
                      value={newQuestionType}
                      onChange={(e) => setNewQuestionType(e.target.value as 'TEXT' | 'MCQ')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-slate-700 bg-white text-sm"
                    >
                      <option value="TEXT">Text Response</option>
                      <option value="MCQ">Multiple Choice</option>
                    </select>
                  </div>

                  {/* MCQ Options */}
                  {newQuestionType === 'MCQ' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Options
                      </label>
                      <div className="space-y-2">
                        {options.map((opt, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOptions = [...options];
                                newOptions[idx] = e.target.value;
                                setOptions(newOptions);
                              }}
                              placeholder={`Option ${idx + 1}`}
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-slate-700 placeholder-slate-400 text-sm"
                            />
                            {options.length > 1 && (
                              <button
                                onClick={() => removeOption(idx)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors duration-200"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={addOption}
                          className="flex items-center space-x-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Add Option</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleAddQuestion}
                    disabled={!newQuestionText.trim()}
                    className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      !newQuestionText.trim()
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                  >
                    Create Question
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Existing Questions Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-slate-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">Question Management</h2>
                    <p className="text-sm text-slate-500">Manage existing questions and set active question</p>
                  </div>
                </div>
              </div>

              <div className="px-8 py-8">
                {questions && questions.length > 0 ? (
                  <div className="space-y-4">
                    {questions.map((question: Question) => (
                      <div
                        key={question.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 mr-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                question.type === 'TEXT' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {question.type === 'TEXT' ? 'Text Response' : 'Multiple Choice'}
                              </span>
                              {question.isActive && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-slate-800 font-medium mb-2 leading-relaxed">
                              {question.text}
                            </p>
                            {question.options && question.options.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm text-slate-600 mb-2">Options:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {question.options.map((option: string, idx: number) => (
                                    <div key={idx} className="bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700">
                                      {option}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                              onClick={() => handleSetActive(question.id)}
                              disabled={question.isActive}
                              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                                question.isActive
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                              }`}
                            >
                              {question.isActive ? 'Active' : 'Set Active'}
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(question.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-sm transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-slate-800 mb-2">No Questions Yet</h3>
                    <p className="text-slate-500">Create your first question to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Confirm Deletion</h3>
              </div>
            </div>
            
            <div className="px-6 py-6">
              <p className="text-slate-700 mb-6">
                Are you sure you want to delete this question? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-2.5 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteQuestion(showDeleteConfirm)}
                  className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;