import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap, Cpu, Brain } from 'lucide-react';

const Web3AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: '你好！我是你的AI助手，准备好探索数字未来了吗？',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage) => {
    const responses = [
      '这是一个很有趣的问题！让我来分析一下...',
      '在Web3的世界中，这个概念确实具有革命性的意义。',
      '我理解你的观点，让我们深入探讨一下这个话题。',
      '从区块链的角度来看，这种想法可能会带来全新的可能性。',
      '你提出了一个非常前瞻性的观点，让我为你详细解释。',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 模拟AI响应延迟
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: simulateAIResponse(userMessage.content),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
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
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">在线</span>
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
          {isLoading && (
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
              disabled={!inputValue.trim() || isLoading}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 hover:scale-105"
              style={{
                boxShadow: '0 10px 25px rgba(147, 51, 234, 0.25)'
              }}
            >
              {isLoading ? (
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