import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetActiveQuestionQuery, useSubmitResponseMutation } from '../../features/api/apiSlice';
type ApiError = {
  status: number;
  data: {
    error: string;
    message?: string;
  };
};

function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'data' in err &&
    typeof (err as { data?: { error?: unknown } }).data?.error === 'string'
  );
}


function UserHome() {
  const { data: question, isLoading, isError } = useGetActiveQuestionQuery(undefined);
  const [answer, setAnswer] = useState('');
  const [submitResponse] = useSubmitResponseMutation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();

  // Assuming you stored user name in localStorage at login
  const userName = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.clear(); // or selectively remove keys if needed
     navigate('/user/login');  // redirect to login page
  };

  const handleSubmit = async () => {
    if (!question) return;
    if (!answer) {
      setError('Please provide an answer');
      return;
    }

    // Show confirmation dialog on first submit attempt
    if (!showConfirmDialog) {
      setShowConfirmDialog(true);
      return;
    }

    try {
      await submitResponse({
        questionId: question.id,
        answer,
      }).unwrap();

      setSuccess(true);
      setAnswer('');
      setError('');
      setShowConfirmDialog(false);
    } catch (err: unknown) {
      console.error('Error submitting response:', err);

      if (isApiError(err) && err.data.error === 'You have already submitted a response') {
        setError('You have already submitted a response to this question.');
      } else {
        if (isApiError(err)) {
          setError(err.data.message || 'Failed to submit response');
        } else {
          setError('Failed to submit response');
        }
      }
      setShowConfirmDialog(false);
    }
  };

  const handleConfirmSubmit = () => {
    handleSubmit();
  };

  const handleCancelSubmit = () => {
    setShowConfirmDialog(false);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-slate-600 font-medium">Loading question...</p>
      </div>
    </div>
  );
  
  if (isError) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
        <p className="text-red-600 font-medium text-center">Failed to load question</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Q</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-800">Question Portal</h1>
                <p className="text-sm text-slate-500">Welcome back, {userName}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {question ? (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">Active Question</h2>
                  <p className="text-sm text-slate-500">Please provide your response below</p>
                </div>
              </div>
            </div>

            {/* Question Content */}
            <div className="px-8 py-8">
              <h3 className="text-2xl font-medium text-slate-800 mb-8 leading-relaxed">
                {question.text}
              </h3>

              {question.type === 'TEXT' ? (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Your Response
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-slate-700 placeholder-slate-400"
                    rows={5}
                    placeholder="Write your detailed answer here..."
                  />
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Select Your Answer
                  </label>
                  <div className="space-y-3">
                    {question.options?.map((opt: string) => (
                      <label key={opt} className="group cursor-pointer">
                        <div className="flex items-center p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                          <input
                            type="radio"
                            name="answer"
                            value={opt}
                            checked={answer === opt}
                            onChange={() => setAnswer(opt)}
                            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="ml-4 text-slate-700 font-medium group-hover:text-blue-700">
                            {opt}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={success}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  success
                    ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200'
                    : 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {success ? (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Successfully Submitted
                  </span>
                ) : (
                  'Submit Response'
                )}
              </button>

              {/* Confirmation Dialog */}
              {showConfirmDialog && (
                <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800">Confirm Submission</h3>
                      </div>
                    </div>
                    
                    <div className="px-6 py-6">
                      <p className="text-slate-700 mb-4">
                        Are you sure you want to submit this answer? Once submitted, you cannot change your response.
                      </p>
                      
                      <div className="bg-slate-50 rounded-lg p-4 mb-6">
                        <p className="text-sm font-medium text-slate-600 mb-2">Your Answer:</p>
                        <p className="text-slate-800 break-words">
                          {question?.type === 'TEXT' ? (
                            <span className="italic">"{answer}"</span>
                          ) : (
                            <span className="font-medium">{answer}</span>
                          )}
                        </p>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={handleCancelSubmit}
                          className="flex-1 py-2.5 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleConfirmSubmit}
                          className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 font-medium"
                        >
                          Yes, Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-green-700 font-medium">
                      Your response has been submitted successfully!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-2">No Active Questions</h3>
            <p className="text-slate-500">There are currently no questions available to answer.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserHome;