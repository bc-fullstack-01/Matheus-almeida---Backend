//faz conexão com o mongodb
const mongoose = require('mongoose')

const connect = mongoose.connect(
  `${(process.env.MONGODB || 'mongodb://localhost:27017/mydb')}_${process.env.NODE_ENV || 'development'}`
)

//importa e exporta as models
exports.Post = require('./post.js')
exports.Comment = require('./comment.js')

//exibe no console o status da conexão com o mongodb
mongoose.connection.on('error', (args)=>{
  console.error(`Mongo not connected: ${JSON.stringify(args)}`)
})
mongoose.connection.on('connected', (args)=>{
  console.warn(`Mongo connected: ${JSON.stringify(args)}`)
})
mongoose.connection.on('disconnected', (args)=>{
  console.error(`Mongo disconnected: ${JSON.stringify(args)}`)
})

//exporta a conexão
exports.Connection = connect