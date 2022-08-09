import { useQuery, gql } from "@apollo/client";
import React from "react";
import { Chart } from "regraph";

const TWEETS_WITH_HASHTAG = gql`
  query($q: String!) {
    twitter {
      search(q: $q, count: 15, result_type: mixed) {
        id
        text
        user {
          id
          screen_name
        }
      }
    }
  }
`;

const HUMANS = gql`
  query {
    graphql_Humans {
      name
      weight
      height
    }
  }
`;


/**
 * Create a ReGraph node object from a Twitter API user
 */
function createUserNode(user) {
  return {
    label: { text: user.screen_name }
  };
}

/**
 * Create a ReGraph node object from a hashtag
 */
function createHashtagNode(hashtag) {
  return {
    label: { text: hashtag }
  };
}

/**
 * Create a ReGraph items object from a Twitter API response for a search for
 * a hashtag.
 */
function toReGraphFormat(data) {
  // The data for the `search` field returned from the API is nested inside the
  // property twitter.
  const { search } = data.twitter;

  // We iterate through all tweets and add a node for the user that tweeted and
  // a link between the user node and hashtag used. Any hashtags used will also
  // be added to the chart
  const items = {};
  for (const tweet of search) {
    const { id, user, text } = tweet;
    items[`user_${user.id}`] = createUserNode(user);

    // Find all used hashtags inside the tweet
    const usedHashtags = text.match(/#\w+/g);

    // Add all new hashtags and a link to the items if there are any
    if (usedHashtags != null) {
      // We lower case the found hashtags to prevent duplicate nodes like
      // "#javascript" and "#JavaScript"
      const hashtags = usedHashtags.map(hashtag => hashtag.toLowerCase());
      for (const hashtag of hashtags) {
        if (items[`hashtag_${hashtag}`] == null) {
          items[`hashtag_${hashtag}`] = createHashtagNode(hashtag);
        }
        items[`tweet_${id}_${hashtag}`] = {
          id1: `user_${user.id}`,
          id2: `hashtag_${hashtag}`
        };
      }
    }
  }

  return items;
}

const START_HASHTAG = "#javascript";

const DEFAULT_ITEMS = {
  [`hashtag_${START_HASHTAG}`]: {
    label: { text: START_HASHTAG }
  }
};

function App() {
  // Execute the query via Apollo Client
  // const { error, data } = useQuery(HUMANS, {
  //   variables: { q: START_HASHTAG }
  // });

  const error = null;
  const data = {
    "twitter": {
      "search": [{
        "id": 1,
        "text": "qwerty",
        "user": {
          "id": 1001,
          "screen_name": "BillFarber"
        }
      }]
    }
  }

  if (error) {
    return `Error! ${error}`;
  }

  const items =
    data == null || Object.keys(data).length === 0
      ? DEFAULT_ITEMS
      : toReGraphFormat(data);
  console.log("*******");
  console.log("items:");
  console.log(items);
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Chart items={items} />
    </div>
  );
}

export default App;
