import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { SEND_MESSAGE, GET_AI_RESPONSE, GET_CHAT_HISTORY, CREATE_SESSION } from '../graphql/queries';

export const useChat = () => {
  const [sessionId, setSessionId] = useState(null);
  
  // 创建会话
  const [createSession] = useMutation(CREATE_SESSION, {
    onCompleted: (data) => {
      if (data.createSession.success) {
        setSessionId(data.createSession.sessionId);
      }
    }
  });

  // 获取聊天历史
  const { data: chatHistoryData, loading: historyLoading } = useQuery(GET_CHAT_HISTORY, {
    variables: { sessionId },
    skip: !sessionId,
    fetchPolicy: 'cache-and-network'
  });

  // 发送消息
  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(SEND_MESSAGE);

  // 获取AI响应
  const [getAIResponseMutation, { loading: gettingAIResponse }] = useMutation(GET_AI_RESPONSE);

  // 发送消息并获取AI响应
  const sendMessage = useCallback(async (messageContent) => {
    try {
      // 首先发送用户消息
      const userMessageResult = await sendMessageMutation({
        variables: {
          input: {
            content: messageContent,
            isUser: true,
            sessionId
          }
        }
      });

      if (userMessageResult.data?.sendMessage?.success) {
        // 然后获取AI响应
        const aiResponseResult = await getAIResponseMutation({
          variables: {
            input: {
              message: messageContent,
              sessionId,
              context: chatHistoryData?.chatHistory || []
            }
          }
        });

        return {
          userMessage: userMessageResult.data.sendMessage,
          aiResponse: aiResponseResult.data?.getAIResponse,
          success: true
        };
      }

      return { success: false, error: userMessageResult.data?.sendMessage?.error };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }, [sendMessageMutation, getAIResponseMutation, sessionId, chatHistoryData]);

  // 初始化会话
  const initializeSession = useCallback(async () => {
    if (!sessionId) {
      await createSession();
    }
  }, [createSession, sessionId]);

  return {
    sessionId,
    chatHistory: chatHistoryData?.chatHistory || [],
    sendMessage,
    initializeSession,
    loading: sendingMessage || gettingAIResponse,
    historyLoading
  };
};