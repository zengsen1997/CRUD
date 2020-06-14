var express = require('express')
var path = require('path')
var router = require('./routers/router')
var topic = require('./routers/topic')


var bodyParser = require('body-parser')
var session = require('express-session')

var app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
//调用模板引擎
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/'))
app.use('/topics', topic)

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(session({
    secret: 'itcast',
    resave: false,
    saveUninitialized: false
  }))

//路由挂载app中
app.use(router)
app.use(topic)

//配置一个404处理中间件
app.use(function(req, res) {
  res.render('404.html')
})

//配置一个全局错误处理中间件,谁有错误就来调用他
app.use(function(err, req, res, next) {
  res.status(500).json({
    err_code: 500,
    message: err.message
  })
})

app.listen(5000, function() {
    console.log('running...')
    
})