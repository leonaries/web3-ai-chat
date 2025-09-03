import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import client from './graphql/apolloClient';
import Web3AIChat from './components/Web3AIChat';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Web3AIChat />
      </div>
    </ApolloProvider>
  );
}

export default App;