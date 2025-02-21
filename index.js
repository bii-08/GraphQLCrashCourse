import { ApolloServer } from '@apollo/server'; // to set up the server and configure it and tells apollo how to handle all of our different types of data and respond to queries
import { startStandaloneServer } from '@apollo/server/standalone'; // to start listening for requests

// import db
import db from './_db.js'

// types import
import { typeDefs } from './schema.js'

// resolvers
const resolvers = {
    Query: {
        games() {
            return db.games
        },
        game(_, args) {  
            return db.games.find((game) => game.id === args.id)
        },
        authors() {
            return db.authors
        },
        author(_, args) {
            return db.authors.find((author) => author.id === args.id)
        },
        reviews() {
            return db.reviews
        },
        review(_, args) {  
            /* parent, args, context: 
              args: we can access the query variables that we pass in the query
             */ 

            return db.reviews.find((review) => review.id === args.id)
        }
    },
    Game: {
        reviews(parent) {
            return db.reviews.filter((review) => review.game_id === parent.id)
        }
    },
    Author: {
        reviews(parent) {
            return db.reviews.filter((review) => review.author_id === parent.id)
        }
    },
    Review: {
        author(parent) {
            return db.authors.find((author) => author.id === parent.author_id)
        },
        game(parent) {
            return db.games.find((game) => game.id === parent.game_id)
        }
    },
    Mutation: {
        deleteGame(_, args) {
            db.games = db.games.filter((game) => game.id !== args.id)
            return db.games
        },
        addGame(_, args) {
            let newGame = {
                ...args.game,
                id: Math.floor(Math.random() * 10000).toString()
            }
            db.games.push(newGame)

            return newGame
        },
        updateGame(_, args) {
            db.games = db.games.map((game) => {
                if (game.id === args.id) {
                    return {
                        ...game,
                        ...args.edits
                    }
                }
                return game
            })

            return db.games.find((game) => game.id === args.id)
        }
    }

}

// server setup
const server = new ApolloServer({
    typeDefs, // definitions of the types of data
    resolvers // resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
});

console.log('Server ready at port', 4000)