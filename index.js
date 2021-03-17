const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Book {
    id: ID
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const books = [
  {
    id: "abc",
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    id: "zxy",
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
