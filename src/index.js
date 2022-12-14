import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const client = new ApolloClient({
  uri: "http://localhost:8004/LATEST/resources/graphql",
  cache: new InMemoryCache()
});


ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
