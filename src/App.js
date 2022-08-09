import React  from "react";
import ReactDOM from "react-dom";
import { Chart } from "regraph";
const axios = require('axios');

const url = "http://127.0.0.1:8004/LATEST/resources/graphql?rs:query=query%20someQuery%20%7B%20graphql_Humans%20%7B%20id%20name%20%7D%20%7D";
let data = {"graphql_Humans":[{"id":1, "name":"Abby"}]};

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

// function getHumanData_http() {
//   data = {"graphql_Humans":[{"id":1, "name":"John"}]}
//   // {"graphql_Humans":[{"id":1001, "name":"Jenny"}, {"id":1000, "name":"Jane"}, {"id":2, "name":"Jim"}, {"id":3, "name":"Joe"}, {"id":1002, "name":"Joan"}, {"id":1, "name":"John"}]}
//
//   const request = http.request(url, (response) => {
//     data = {"graphql_Humans":[{"id":1, "name":"alex"}]}
//     // {"graphql_Humans":[{"id":1001, "name":"Jenny"}, {"id":1000, "name":"Jane"}, {"id":2, "name":"Jim"}, {"id":3, "name":"Joe"}, {"id":1002, "name":"Joan"}, {"id":1, "name":"John"}]}
//     response.on('data', (chunk) => {
//       data = {"graphql_Humans":[{"id":1, "name":"alex"}]}
//       data = data + chunk.toString();
//     });
//
//     response.on('end', () => {
//       data = {"graphql_Humans":[{"id":1, "name":"alex"}]}
//       const body = JSON.parse(data);
//       console.log(body);
//     });
//     return data;
//   })
//
//   request.on('error', (error) => {
//     data = {"graphql_Humans":[{"id":1, "name":"alex"}]}
//     console.log('An error', error);
//   });
//
//   request.end()
//   return data;
// }

function getHumanData_axios() {
  data = {"graphql_Humans":[{"id":1, "name":"Chuck"}]};
  axios.get(url,
    {
      headers: {
        'Content-Type': 'application/graphql'
      }
  })
    .then((response) => {
       data = {"graphql_Humans":[{"id":1, "name":JSON.stringify(response.data)}]}
       const items = toReGraphFormat(response.data.data);
       ReactDOM.render(
         <div style={{ width: "100vw", height: "100vh" }}>
           <Chart items={items} />
         </div>,
         document.getElementById("root")
       );
     })
     .catch((error) => {
       console.error(error);
       data = {"graphql_Humans":[{"id":1, "name": JSON.stringify(error)}]}
       const items = toReGraphFormat(data);
       ReactDOM.render(
         <div style={{ width: "100vw", height: "100vh" }}>
           <Chart items={items} />
         </div>,
         document.getElementById("root")
       );
     });
}

const DEFAULT_ITEMS = {
  [`hashtag_AA`]: {
    label: { text: "BB" }
  }
};

function App() {
  data = null;
  getHumanData_axios();

  const items =
    data == null || Object.keys(data).length === 0
      ? DEFAULT_ITEMS
      : toReGraphFormat(data);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Chart items={items} />
    </div>
  );
}

export default App;
