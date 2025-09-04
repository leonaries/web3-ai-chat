import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap, Cpu, Brain, AlertCircle } from 'lucide-react';
import { useChat } from '../hooks/useChat';

const Web3AIChat = () => {
  const {
    sessionId,
    chatHistory,
    sendMessage,
    initializeSession,
    loading
    // historyLoading - removed unused variable
  } = useChat();

  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // 初始化时创建一个默认欢迎消息，如果没有历史记录的话
  const [localMessages] = useState([
    {
      id: '1',
      content: '你好！我是你的AI助手，准备好探索数字未来了吗？',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  // setLocalMessages - removed unused setter

  // 合并本地消息和远程聊天历史
  const messages = chatHistory.length > 0 ? chatHistory : localMessages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化会话
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const messageContent = inputValue.trim();
    setInputValue('');
    setError(null);

    try {
      const result = await sendMessage(messageContent);
      
      if (!result.success) {
        setError(result.error || '发送消息失败，请重试');
        // 恢复输入值
        setInputValue(messageContent);
      }
    } catch (err) {
      console.error('Send message error:', err);
      setError('网络连接错误，请检查您的网络连接');
      // 恢复输入值
      setInputValue(messageContent);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* 背景动画效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* 网格背景 */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* 主容器 */}
      <div className="relative z-10 flex flex-col h-screen max-w-4xl mx-auto p-4">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-black bg-opacity-20 backdrop-blur-lg border border-purple-500 border-opacity-30">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Web3 AI Assistant
              </h1>
              <p className="text-sm text-gray-400">下一代智能对话</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${sessionId ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
            <span className={`text-sm ${sessionId ? 'text-green-400' : 'text-yellow-400'}`}>
              {sessionId ? '在线' : '连接中...'}
            </span>
          </div>
        </div>

        {/* 消息容器 */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 p-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.isUser ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* 头像 */}
              <div
                className={`p-2 rounded-full ${
                  message.isUser
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}
              >
                {message.isUser ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* 消息气泡 */}
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl relative ${
                  message.isUser
                    ? 'bg-cyan-600 bg-opacity-20 border border-cyan-500 border-opacity-30 backdrop-blur-sm'
                    : 'bg-purple-600 bg-opacity-20 border border-purple-500 border-opacity-30 backdrop-blur-sm'
                }`}
              >
                <p className="text-gray-100 text-sm leading-relaxed">
                  {message.content}
                </p>
                <div className="flex items-center justify-end mt-2 space-x-2">
                  <span className="text-xs text-gray-400">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* 加载指示器 */}
          {loading && (
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="max-w-xs px-4 py-3 rounded-2xl bg-purple-600 bg-opacity-20 border border-purple-500 border-opacity-30 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-purple-400 animate-spin" />
                  <span className="text-gray-300 text-sm">正在思考...</span>
                </div>
              </div>
            </div>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-full bg-red-500">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="max-w-xs px-4 py-3 rounded-2xl bg-red-600 bg-opacity-20 border border-red-500 border-opacity-30 backdrop-blur-sm">
                <p className="text-red-200 text-sm">{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="text-xs text-red-300 mt-1 hover:text-red-100 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="p-4 rounded-xl bg-black bg-opacity-30 backdrop-blur-lg border border-purple-500 border-opacity-30">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入你的消息..."
                className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-sm border border-gray-500 border-opacity-30 rounded-xl text-gray-100 placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500 focus:border-opacity-50 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 transition-all"
                rows={1}
                style={{
                  minHeight: '48px',
                  maxHeight: '120px',
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || loading || !sessionId}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 hover:scale-105"
              style={{
                boxShadow: '0 10px 25px rgba(147, 51, 234, 0.25)'
              }}
            >
              {loading ? (
                <Zap className="w-5 h-5 animate-pulse" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
            <span>按 Enter 发送，Shift + Enter 换行</span>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
              <span>由Web3 AI驱动</span>
            </div>
          </div>
        </div>
      </div>

      {/* 浮动装饰元素 */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-1/3 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40 animation-delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping opacity-50 animation-delay-2000"></div>
    </div>
  );
};

export default Web3AIChat;