import React  from "react";
import ReactDOM from "react-dom";
import { Chart } from "regraph";
const axios = require('axios');

//const url = "http://127.0.0.1:8004/LATEST/resources/graphql?rs:query=query%20someQuery%20%7B%20graphql_Humans%20%7B%20id%20name%20%7D%20%7D";
const graphqlQueryString = "query%20someQuery%20{%20Persons%20{%20name%20height%20cars%20{%20model%20}%20}%20}";
const url = `http://127.0.0.1:8004/LATEST/resources/graphql?rs:query=${graphqlQueryString}`;

function createHumanNode(name) {
  return {
    label: { text: name }
  };
}

function createFriendLink(sourceNodeId, targetNodeId) {
  return {
    // a link's ends are defined by id1 and id2
    id1: `human_${sourceNodeId}`,
    id2: `human_${targetNodeId}`,
    label: {
      text: 'Friend Of',
      color: "#2e3842",
      backgroundColor: "#f5f7fa50",
    },
    color: "#606d7b",
    width: 4,
  }
}

function toReGraphFormat(data) {
  const items = {};
  for (const human of data.Persons) {
    items[`human_${human.name}`] = createHumanNode(human.name);
    // for (const friend of human.friends) {
    //   items[`friend_${human.name}_${friend.id}`] = createFriendLink(human.id, friend.id);
    // }
  }
  return items;
}

function getHumanData_axios() {
  axios.get(url,
    {
      headers: {
        'Content-Type': 'application/graphql'
      }
  })
    .then((response) => {
      // A little hard-coded data that can be used for testing & development
      //  const data = {"graphql_Humans":[{"id":1001, "name":"Jenny", "friends":[{"id":2},{"id":1002},{"id":1000}]}, {"id":1000, "name":"Jane", "friends":[]}, {"id":2, "name":"Jim", "friends":[]}, {"id":3, "name":"Joe", "friends":[]}, {"id":1002, "name":"Joan", "friends":[{"id":3}, {"id":1}]}, {"id":1, "name":"John", "friends":[]}]}
       const items = toReGraphFormat(response.data.data);
       //const items = toReGraphFormat(data);
       ReactDOM.render(
         <div style={{ width: "100vw", height: "100vh" }}>
           <Chart items={items} />
         </div>,
         document.getElementById("root")
       );
     })
     .catch((error) => {
       console.error(error);
       const data = {"graphql_Humans":[{"id":1, "name": JSON.stringify(error)}]}
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
  const data = null;
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
