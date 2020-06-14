var express  = require('express')
//加载加密包
var md5 = require('blueimp-md5')
//加载数据model
var User = require('../models/user')
var Topic = require('../models/topic')
var router = express.Router()

router.get('/', function (req, res, next) {
    Topic.find(function (err, topics) {
        if (err) {
            return next(err)
        }
        console.log('成功');

        res.render('index.html', {
            topics: topics,
            user: req.session.user
        })

    })
})

router.get('/login', function(req, res) {
    res.render('login.html')
})
router.post('/login', function(req, res, next) {
    var body = req.body

    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, function(err, user) {
        if (err) {
            return next(err)
        }

        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invaild.'
            })
        }

        //用户存在，登录成功状态
        req.session.user = user

        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
})


//注册
router.get('/register', function(req, res) {
    res.render('register.html')
})
router.post('/register', function(req, res, next) {
    //获取表单提交数据
    
        var body = req.body
        //操作数据库：判断用户是否存在
        //存在就不允许注册，不存在就存数据
        User.findOne({
            //或判断
            $or:[{
                email: body.email
            },{
                nickname: body.nickname
            }]
           
        }, function(err, data) {
            if(err) {
                // express提供一个json方法,把对象转为字符串给客户端
                // return res.status(500).json({
                //     success: false,
                //     message: '服务错误！'
                // })

                return next(err)//调用全局错误处理中间件
            }
            if (data) {
                return res.status(200).json({
                    err_code: 1,
                    message: 'email or nickname aleady exist!'
                })
                return res.send(`邮箱和账号已存在，请重试`)
            }

            //双重md5加密
            body.password = md5(md5(body.password))

            new User(body).save(function (err, user) {
                 if (err) {
                    //  return res.status(500).json({
                    //      err_code: 500,
                    //      message: '服务端错误！'
                    //  })
                    return next(err)//调用全局错误处理中间件
                 }

                 //使用session记录用户登录状态
                 req.session.user = user

                 res.status(200).json({
                    err_code: 0,
                    massage:'okk'
                })
            })
        })
})

router.get('/logout', function(req, res) {
    req.session.user = null
    res.redirect('/login')
})


module.exports = router