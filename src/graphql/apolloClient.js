import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// TODO: 更换为你的 Cloudflare Workers GraphQL 端点
const GRAPHQL_ENDPOINT = 'https://openai-workers.leonaries9527.workers.dev/graphql';
// const GRAPHQL_ENDPOINT = 'http://localhost:8787/graphql';


// HTTP 链接配置
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
});

// 认证链接 - 如果需要的话
const authLink = setContext((_, { headers }) => {
  // 这里可以添加认证令牌或其他头部信息
  return {
    headers: {
      ...headers,
      // authorization: token ? `Bearer ${token}` : "",
      'Content-Type': 'application/json',
    }
  }
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
    },
  }),
  // 开发环境下启用调试
  connectToDevTools: process.env.NODE_ENV === 'development',
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