import { useState, useCallback } from 'react';

// GraphQL端点
const GRAPHQL_ENDPOINT = 'https://openai-workers-proxy.leonaries9527.workers.dev/graphql';

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
  const [loading, setLoading] = useState(false);

  // GraphQL请求辅助函数
  const graphqlRequest = useCallback(async (query, variables = {}) => {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0].message);
    }

    return result.data;
  }, []);

  // 创建会话
  const createSession = useCallback(async () => {
    try {
      const query = `
        mutation CreateSession {
          createSession {
            sessionId
            success
          }
        }
      `;
      
      const data = await graphqlRequest(query);
      
      if (data?.createSession?.success) {
        setSessionId(data.createSession.sessionId);
        return { success: true, sessionId: data.createSession.sessionId };
      }
      throw new Error('Failed to create session');
    } catch (error) {
      console.error('Error creating session:', error);
      // 降级处理：本地生成sessionId
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setSessionId(newSessionId);
      return { success: true, sessionId: newSessionId };
    }
  }, [graphqlRequest]);

  // 发送消息并获取AI响应
  const sendMessage = useCallback(async (messageContent) => {
    if (!sessionId) {
      return { success: false, error: 'No active session' };
    }

    setLoading(true);
    
    try {
      // 1. 添加用户消息到本地历史(乐观更新)
      const userMessage = {
        id: `msg_${Date.now()}_user`,
        content: messageContent,
        isUser: true,
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, userMessage]);

      // 2. 准备AI请求的消息格式
      const messages = [
        ...chatHistory
          .filter(msg => msg.id !== '1') // 排除默认欢迎消息
          .map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          })),
        { role: 'user', content: messageContent }
      ];

      // 3. 调用AI响应GraphQL API
      const query = `
        mutation GetAIResponse($input: ChatInput!) {
          getAIResponse(input: $input) {
            id
            content
            isUser
            timestamp
            success
            error
          }
        }
      `;

      const data = await graphqlRequest(query, {
        input: {
          messages: messages,
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          max_tokens: 1000
        }
      });

      if (data?.getAIResponse?.success) {
        const aiMessage = {
          id: data.getAIResponse.id,
          content: data.getAIResponse.content,
          isUser: false,
          timestamp: new Date(data.getAIResponse.timestamp),
        };
        
        setChatHistory(prev => [...prev, aiMessage]);
        
        return {
          userMessage,
          aiResponse: aiMessage,
          success: true
        };
      } else {
        throw new Error(data?.getAIResponse?.error || 'AI response failed');
      }

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
    } finally {
      setLoading(false);
    }
  }, [sessionId, chatHistory, graphqlRequest]);

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
    loading,
    historyLoading: false
  };
};