import React from "react";
import { Chart } from "regraph";
//const httpClient = require('urllib');

function createHumanNode(name) {
  return {
    label: { text: name }
  };
}

function toReGraphFormat(data) {
  const items = {};
  for (const human of data.graphql_Humans) {
    items[`human_${human.id}`] = createHumanNode(human.name);
  }
  return items;
}

function App() {
  const data = {"graphql_Humans":[{"id":1001, "name":"Jenny"}, {"id":1000, "name":"Jane"}, {"id":2, "name":"Jim"}, {"id":3, "name":"Joe"}, {"id":1002, "name":"Joan"}, {"id":1, "name":"John"}]}
  const items = toReGraphFormat(data);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Chart items={items} />
    </div>
  );
}

export default App;
