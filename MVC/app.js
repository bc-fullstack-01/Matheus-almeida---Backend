const path = require('path')
const express = require('express')
const methodOverride = require('method-override')
const session = require('express-session')
const logger = require('morgan')
const createError = require('http-errors')
const routers = require('./routers')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.response.message = function (msg) {
  
  const sess = this.req.session 

  sess.messages = sess.messages || [] 
  sess.messages.push(msg) 
  return this
}

app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())

app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'some secret here'
}))

app.use(function (req, res, next){

  res.locals = Object.assign(res.locals, req.session.form)
  res.locals.errors = Object.assign([], res.locals, req.session.errors)
  res.locals.messages = Object.assign([], res.locals, req.session.messages)
  next()

  req.session.erros = []
  req.session.messages = []
  req.session.form = {}
})

app.use(logger(process.env.NODE_ENV || 'dev'))

//definie a rota principal
app.get('/', (req, res)=> res.redirect('/v1/posts'))
app.use('/v1', routers)//faz com que as rotas de routers usem a rota /v1

//middlewares para tratamento de erros
//middleware para quando não encontra a rota
app.use(function(req, res, next){
  const err = createError(404)
  next(err)
})
//middleware para erro de validação ou erro geral
app.use(function(err, req, res, next){

  if (err.name && err.name === 'ValidationError'){
    const lastView = req.headers.referer.replace(`${req.headers.origin}/`, '/') 
    req.session.form = req.body //pega o valor do body e salva na sessão do form
    req.session.errors = Object.entries(err.errors).map(([, obj])=> obj)
    req.session.messages.push(err.message) 
    res.redirect(lastView)
  } else if ((err.status && err.status === 404) || (err.name && err.name === 'CastError')) {
    res.status(404).render('404', {
      url: req.originalUrl
    }) 
  } else {
    res.status(err.status || 500).render('5xx', {err}) 
  }
})

app.listen(process.env.PORT || 4000, ()=>{
  console.log(`server listen on http://localhost:${process.env.PORT || 4000}`)
})