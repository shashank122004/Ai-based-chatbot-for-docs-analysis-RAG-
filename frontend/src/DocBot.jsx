import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const DocBot = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  // AI-generated background images related to documents and AI chat
  const backgrounds = [
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1920&q=80', // AI robot with digital interface
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=80', // AI neural network
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920&q=80', // Digital AI brain
    'https://images.unsplash.com/photo-1655635949384-f737c5133dfe?w=1920&q=80', // AI technology
    'https://images.unsplash.com/photo-1676277791608-ac3b57f3f0e6?w=1920&q=80', // AI chat interface
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1920&q=80', // Digital documents AI
  ];

  const lightBackgrounds = [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80', // Digital world map
    'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1920&q=80', // Clean tech background
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=80', // Minimalist AI
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&q=80', // Matrix code
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80', // Tech background
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80', // Abstract tech
  ];

  // Initialize background on mount
  useEffect(() => {
    setBackgroundIndex(Math.floor(Math.random() * backgrounds.length));
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle New Chat
  const handleNewChat = () => {
    setMessages([]);
    setPdfFile(null);
    setPdfFileName('');
    setUploadSuccess(false);
    setInputMessage('');
    setError('');
    // Change background
    setBackgroundIndex((prev) => (prev + 1) % backgrounds.length);
  };

  // Handle Refresh Background
  const handleRefreshBackground = () => {
    setBackgroundIndex((prev) => (prev + 1) % backgrounds.length);
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfFileName(file.name);
      setUploadSuccess(false);
      setError('');
    } else {
      setError('Please select a valid PDF file');
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  // Upload PDF to backend
  const handleUploadPDF = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file first');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', pdfFile);

    try {
      const response = await axios.post('/upload_docs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUploadSuccess(true);
      setMessages([{
        type: 'bot',
        text: `Great! I've processed "${pdfFileName}". You can now ask me questions about this document.`
      }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload PDF. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Send chat message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    if (!uploadSuccess) {
      setError('Please upload a PDF first before chatting');
      return;
    }

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInputMessage('');
    setIsTyping(true);
    setError('');

    try {
      const response = await axios.post('/chat', {
        query: userMessage,
      });

      setMessages(prev => [...prev, {
        type: 'bot',
        text: response.data.answer || response.data.message || 'I received your message.'
      }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get response. Please try again.');
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Sorry, I encountered an error processing your question. Please try again.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen transition-all duration-700 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url(${darkMode ? backgrounds[backgroundIndex] : lightBackgrounds[backgroundIndex]})`,
        }}
      >
        {/* Dark/Light overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-black/60' : 'bg-white/40'} backdrop-blur-sm`}></div>
        
        {/* Gradient overlay for better text readability */}
        <div className={`absolute inset-0 ${
          darkMode 
            ? 'bg-gradient-to-br from-purple-900/40 via-transparent to-pink-900/40' 
            : 'bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20'
        }`}></div>
      </div>

      {/* Animated particles overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <div className={`absolute top-20 left-10 w-72 h-72 ${darkMode ? 'bg-purple-500' : 'bg-purple-400'} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob`}></div>
        <div className={`absolute top-40 right-10 w-72 h-72 ${darkMode ? 'bg-pink-500' : 'bg-pink-400'} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000`}></div>
        <div className={`absolute bottom-20 left-20 w-72 h-72 ${darkMode ? 'bg-blue-500' : 'bg-blue-400'} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000`}></div>
      </div>

      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-md border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      } relative z-20`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              DocBot
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all transform hover:scale-105 ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              } shadow-lg`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-semibold">New Chat</span>
            </button>

            {/* Refresh Background Button */}
            <button
              onClick={handleRefreshBackground}
              className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                darkMode ? 'bg-gray-700 text-purple-400' : 'bg-gray-200 text-purple-600'
              } hover:rotate-180 duration-500`}
              title="Change Background"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {darkMode ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-20">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 animate-fade-in backdrop-blur-md">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PDF Upload Section */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/90'} backdrop-blur-lg rounded-2xl p-6 border ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            } shadow-2xl`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Upload Document
              </h2>
              
              {/* Drag and Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-purple-500 bg-purple-500/10 scale-105' 
                    : darkMode 
                      ? 'border-gray-600 hover:border-purple-500' 
                      : 'border-gray-300 hover:border-purple-500'
                } ${uploadSuccess ? 'bg-green-500/10 border-green-500' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                
                {uploadSuccess ? (
                  <div className="text-green-400">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="font-semibold">Upload Successful!</p>
                  </div>
                ) : (
                  <>
                    <svg className={`w-16 h-16 mx-auto mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Drag & drop your PDF here
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      or click to browse
                    </p>
                  </>
                )}
              </div>

              {/* File Name Display */}
              {pdfFileName && (
                <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {pdfFileName}
                    </span>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUploadPDF}
                disabled={!pdfFile || isUploading}
                className={`w-full mt-4 py-3 px-4 rounded-lg font-semibold transition-all transform ${
                  !pdfFile || isUploading
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105'
                } text-white shadow-lg`}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  'Upload Document'
                )}
              </button>
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/90'} backdrop-blur-lg rounded-2xl border ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            } shadow-2xl flex flex-col h-[600px]`}>
              {/* Chat Header */}
              <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Chat with Your Document
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  {uploadSuccess ? 'Ask questions about your document' : 'Upload a document to start chatting'}
                </p>
              </div>

              {/* Messages Container */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
              >
                {messages.length === 0 && !uploadSuccess && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <svg className={`w-20 h-20 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Your conversation will appear here
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none'
                          : darkMode
                            ? 'bg-gray-700 text-gray-100 rounded-bl-none'
                            : 'bg-gray-200 text-gray-900 rounded-bl-none'
                      } shadow-md`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className={`px-4 py-3 rounded-2xl rounded-bl-none ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    } shadow-md`}>
                      <div className="flex space-x-2">
                        <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-600'} animate-bounce`} style={{ animationDelay: '0ms' }} />
                        <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-600'} animate-bounce`} style={{ animationDelay: '150ms' }} />
                        <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-600'} animate-bounce`} style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isTyping || !uploadSuccess}
                    placeholder={uploadSuccess ? "Ask a question about your document..." : "Upload a document first..."}
                    className={`flex-1 px-4 py-3 rounded-xl border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isTyping || !uploadSuccess || !inputMessage.trim()}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all transform ${
                      isTyping || !uploadSuccess || !inputMessage.trim()
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105'
                    } text-white shadow-lg`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default DocBot;