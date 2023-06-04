var { graphqlHTTP } = require("express-graphql");
var { buildSchema, assertInputType, isNonNullType } = require("graphql");
var express = require("express");

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: (arg) => {
    const selectedrestaurant = restaurants.filter(object => object.id === arg.id);
    return selectedrestaurant[0];
  },
  restaurants: () => restaurants,
  setrestaurant: ({ input }) => {
    restaurants.push({name:input.name,description:input.description});
    return input;
    // Your code goes here
  },
  deleterestaurant: ({ id }) => {
    const ok = Boolean(restaurants.find(object=>object.id===id));
    let delrestaurant =  restaurants.filter(object => object.id === id);  
    restaurants = restaurants.filter(index=>index.id!==id);
    console.log(JSON.stringify(delrestaurant[0]));
    return {ok};
    // Your code goes here
  },
  editrestaurant: ({ id, ...restaurant }) => {
    if (restaurants.findIndex(object=>object.id!==id)){
      throw new Error("restaurant doesn't exist")
    }
    let index = restaurants.findIndex(object=>object.id===id);
    restaurants[index] = {...restaurants[index], ...restaurant};

    return restaurants[index];
    // Your code goes here
  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));
