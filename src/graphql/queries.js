import { gql } from '@apollo/client';

// 发送消息的 Mutation
export const SEND_MESSAGE = gql`
  mutation SendMessage($input: MessageInput!) {
    sendMessage(input: $input) {
      id
      content
      isUser
      timestamp
      success
      error
    }
  }
`;

// 获取聊天历史的 Query
export const GET_CHAT_HISTORY = gql`
  query GetChatHistory($sessionId: String) {
    chatHistory(sessionId: $sessionId) {
      id
      content
      isUser
      timestamp
    }
  }
`;

// 获取 AI 响应的 Mutation
export const GET_AI_RESPONSE = gql`
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

// 创建新会话的 Mutation
export const CREATE_SESSION = gql`
  mutation CreateSession {
    createSession {
      sessionId
      success
    }
  }
`;