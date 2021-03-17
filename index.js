const { ApolloServer, gql, UserInputError } = require("apollo-server");
const uniqid = require("uniqid");
const _filter = require("lodash/filter");

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  input BookPatch {
    title: String
    author: String
  }

  input BookFilter {
    id: ID
    title: String
    author: String
  }

  input AddBookInput {
    title: String!
    author: String!
  }

  type AddBookPayload {
    book(filter: BookFilter): [Book!]!
  }

  input UpdateBookInput {
    filter: BookFilter
    values: BookPatch!
  }

  type UpdateBookPayload {
    book(filter: BookFilter): [Book!]!
  }

  type DeleteBookPayload {
    book(filter: BookFilter): [Book!]!
  }

  type Query {
    queryBook(filter: BookFilter): [Book!]!
    getBook(id: ID!): Book!
  }

  type Mutation {
    addBook(input: [AddBookInput!]!): AddBookPayload!
    updateBook(input: UpdateBookInput!): UpdateBookPayload!
    deleteBook(filter: BookFilter): DeleteBookPayload!
  }
`;

let BOOKS = [
  {
    id: "4n5pxq24kriob12ogd",
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    id: "4n5pxq24ksiob12ogl",
    title: "City of Glass",
    author: "Paul Auster",
  },
];

function filterBooks(books, filter) {
  if (!filter) {
    return books;
  }

  return _filter(books, filter);
}

const resolvers = {
  Query: {
    queryBook: (parentValues, args) => {
      return filterBooks(BOOKS, args.filter);
    },
    getBook: (parentValues, args) => {
      const book = BOOKS.find((b) => b.id === args.id);
      if (!book) {
        throw new UserInputError("Failed to find record with given ID");
      }

      return book;
    },
  },
  Mutation: {
    addBook: (parentValues, args) => {
      const input = Array.isArray(args.input) ? args.input : [args.input];

      const newBooks = args.input.map((book) => ({
        ...book,
        id: uniqid(),
      }));

      BOOKS = [...BOOKS, ...newBooks];
      return newBooks;
    },
    updateBook: (parentValues, args) => {
      const filter = args.filter;
      const values = args.values;

      let books = filterBooks(BOOKS, filter);
      books = books.map((book) => ({ ...book, ...values }));
      const bookIds = books.map((book) => book.id);

      BOOKS = [...BOOKS.filter((book) => !(book.id in bookIds)), ...books];

      return books;
    },
  },
  AddBookPayload: {
    book(parent, args) {
      return filterBooks(parent, args.filter);
    },
  },
  UpdateBookPayload: {
    book(parent, args) {
      return filterBooks(parent, args.filter);
    },
  },
  DeleteBookPayload: {
    book(parent, args) {
      return filterBooks(parent, args.filter);
    },
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
