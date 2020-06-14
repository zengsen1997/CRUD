var express  = require('express')
//加载加密包
var md5 = require('blueimp-md5')
//加载数据model
var Topic = require('../models/topic')
var router = express.Router()



// 新加页面
router.get('/new', function(req, res) {
    res.render('new.html', {
        user: req.session.user
    })
})
router.post('/new', function(req, res, next) {
    // console.log(req.body);
    
    new Topic(req.body).save(function (err) {
        if (err) {
            return next(err)
        }
        res.redirect('/')
    })
    
})
router.get('/edit', function(req, res, next) {
    // query是转成对象，get特有
    Topic.findById(req.query.id, function(err, topics) {
        if (err) {
            return next(err)
        }
        res.render('edit.html', {
            topics: topics
        })
    })
})
router.post('/topics/edit', function(req, res, next) {
    Topic.findByIdAndUpdate(req.body.id, req.body, function(err) {
        if (err) {
            return next(err)
        }
        res.redirect('/')
    })
})

router.get('/delete', function (req, res, next) {
    console.log(req.query.id)
    Topic.deleteOne(req.query.id, function (err) {
        if (err) {
            return next(err)
        }
        res.redirect('/')   
    })


})

router.get('/like', function (req, res, next) {
    // var reg = new RegExp(request.query.title,'');
    var str="^.*"+req.query.title+".*$"
    //nodejs中，必须要使用RegExp，来构建正则表达式对象。
    var reg = new RegExp(str)
    Topic.find({
        title: reg
    }, function (err, topics) {
        if (err) {
            return next(err)
        }
        res.render('index.html', {
            topics: topics,
            user: req.session.user
        })
    })
})




module.exports = router