import { useState, useCallback } from 'react';

// GraphQL端点配置
const isDevelopment = process.env.NODE_ENV === 'development';
const GRAPHQL_ENDPOINT = isDevelopment 
  ? 'http://localhost:8787/graphql'  // 本地开发
  : 'https://openai-workers-proxy.leonaries9527.workers.dev/graphql'; // 生产环境

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
    console.log('GraphQL Request:', { 
      endpoint: GRAPHQL_ENDPOINT,
      query: query.slice(0, 100) + '...',
      variables 
    });

    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 本地开发时可以添加 API key 头部
          ...(isDevelopment && process.env.REACT_APP_OPENAI_API_KEY ? {
            'x-openai-key': process.env.REACT_APP_OPENAI_API_KEY
          } : {})
        },
        body: JSON.stringify({
          query,
          variables
        }),
      });

      console.log('GraphQL Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('GraphQL HTTP Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await response.json();
      console.log('GraphQL Response:', result);
      
      if (result.errors && result.errors.length > 0) {
        console.error('GraphQL Errors:', result.errors);
        throw new Error(result.errors[0].message);
      }

      return result.data;
    } catch (error) {
      console.error('GraphQL Request Failed:', error);
      throw error;
    }
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
        console.log('Session created:', data.createSession.sessionId);
        return { success: true, sessionId: data.createSession.sessionId };
      }
      throw new Error('Failed to create session');
    } catch (error) {
      console.error('Error creating session:', error);
      // 降级处理：本地生成sessionId
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setSessionId(newSessionId);
      console.log('Fallback session created:', newSessionId);
      return { success: true, sessionId: newSessionId };
    }
  }, [graphqlRequest]);

  // 发送消息并获取AI响应
  const sendMessage = useCallback(async (messageContent) => {
    if (!sessionId) {
      console.error('No active session');
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

      console.log('Sending messages to AI:', messages);

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
        
        console.log('AI response received:', aiMessage);
        
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
        content: `抱歉，发生了错误: ${error.message}`,
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
      console.log('Initializing session...');
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
