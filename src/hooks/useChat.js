import { useState, useCallback } from 'react';

// Workers API 端点
const WORKERS_API = 'https://openai-workers.leonaries9527.workers.dev';

export const useChat = () => {
  const [sessionId, setSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      id: '1',
      content: '你好！我是你的AI助手，准备好探索数字未来了吗？',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  
  // 创建会话（本地生成 sessionId）
  const createSession = useCallback(async () => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    return { success: true, sessionId: newSessionId };
  }, []);

  // 发送消息并获取AI响应
  const sendMessage = useCallback(async (messageContent) => {
    try {
      // 添加用户消息到本地历史
      const userMessage = {
        id: `msg_${Date.now()}_user`,
        content: messageContent,
        isUser: true,
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, userMessage]);

      // 准备发送给 Workers 的消息格式
      const messages = [
        ...chatHistory.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: messageContent }
      ];

      // 调用 Workers API
      const response = await fetch(WORKERS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages,
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const aiResponse = await response.json();
      
      // 添加AI响应到本地历史
      const aiMessage = {
        id: `msg_${Date.now()}_ai`,
        content: aiResponse.choices?.[0]?.message?.content || '抱歉，我没有收到有效的回复',
        isUser: false,
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, aiMessage]);

      return {
        userMessage,
        aiResponse: aiMessage,
        success: true
      };
    } catch (error) {
      console.error('Error sending message:', error);
      
      // 添加错误消息到历史
      const errorMessage = {
        id: `msg_${Date.now()}_error`,
        content: '抱歉，发生了错误，请重试',
        isUser: false,
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
      
      return { success: false, error: error.message };
    }
  }, [chatHistory]);

  // 初始化会话
  const initializeSession = useCallback(async () => {
    if (!sessionId) {
      await createSession();
    }
  }, [createSession, sessionId]);

  return {
    sessionId,
    chatHistory,
    sendMessage,
    initializeSession,
    loading: false, // 简化状态管理
    historyLoading: false
  };
};