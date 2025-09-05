import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// 环境检测
const isDevelopment = process.env.NODE_ENV === 'development';

// GraphQL 端点配置
const GRAPHQL_ENDPOINT = isDevelopment 
  ? 'http://localhost:8787/graphql'  // 本地开发
  : 'https://openai-workers.leonaries9527.workers.dev/graphql'; // 生产环境

console.log('Apollo Client connecting to:', GRAPHQL_ENDPOINT);

// HTTP 链接配置
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
});

// 认证链接 - 本地开发时可以传递 API key
const authLink = setContext((_, { headers }) => {
  const authHeaders = {
    ...headers,
    'Content-Type': 'application/json',
  };

  // 本地开发时添加 OpenAI API key
  if (isDevelopment && process.env.REACT_APP_OPENAI_API_KEY) {
    authHeaders['x-openai-key'] = process.env.REACT_APP_OPENAI_API_KEY;
  }

  return {
    headers: authHeaders
  };
});

// 错误处理链接
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);
    console.error('Network error details:', {
      name: networkError.name,
      message: networkError.message,
      statusCode: networkError.statusCode,
      bodyText: networkError.bodyText
    });
  }
});

// Apollo Client 实例
const client = new ApolloClient({
  link: from([
    errorLink,
    authLink.concat(httpLink),
  ]),
  cache: new InMemoryCache({
    typePolicies: {
      // 可以在这里配置缓存策略
      Message: {
        fields: {
          timestamp: {
            merge(existing, incoming) {
              return incoming;
            }
          }
        }
      }
    },
  }),
  // 开发环境下启用调试
  connectToDevTools: isDevelopment,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

export default client;
