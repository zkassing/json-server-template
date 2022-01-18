const path = require('path')
const fs = require('fs')
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('data/db.json')
const middlewares = jsonServer.defaults({
  logger: true,
  static: './upload'
})

const { tokenPropName, delay } = require('./config.js')
const { verify, sign } = require('./utils/jwt')

const multer = require('multer')
const { format } = require('./utils/date')

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.use(multer({ dest: './upload/' }).any())

server.post('/upload', (req, res) => {
  const dirname = format()
  // 创建目录
  fs.mkdir(`upload/${dirname}`, { recursive: true }, (err) => {
    if (err) {
      console.log(err)
      res.jsonp({
        code: 10001,
        msg: '目录创建失败',
        data: null
      })
      throw err
    }

    const filename = `${dirname}/${req.files[0].filename}${path.parse(req.files[0].originalname).ext}`
    
    fs.rename(req.files[0].path, `upload/${filename}`, function(err){
      if(err){
        res.jsonp({
          code: 10002,
          msg: '文件创建失败',
          data: null
        })
        throw err
      }else{
        res.jsonp({
          code: 200,
          status: '上传成功',
          data: filename
        })
      }
    })

  })  
})


server.use(async (req, res, next) => {
  req.query._delay = delay
  if (('/__rules', '/db', '/upload').includes(req.path)) {
    next()
    return false
  }

  if (req.path.indexOf('/users') === -1) {
    // 验证对应的token
    // 获取携带的token 
    const token = req.headers[tokenPropName || 'authorization']
    console.log(token)
    // 获取到的token是否存在
    if (!token) {
      res.sendStatus(401)
      return false
    }

    // 验证
    try {
      const data = await verify(token)
      // console.log(data)
      next()
    } catch (err) {
      // 错误
      res.sendStatus(401)
    }
    
  } else {
    next()
  }

})

// 登录 返回token
router.render = (req, res) => {
  if (req.path.indexOf('/users') !== -1) {
    if (req.method === "GET") {
        // 参数中有用户名密码
      if (req.query.username && req.query.password) {
        // 生成token // 获取用户名和密码
        if (res.locals.data && res.locals.data.length) {
          // 如果都有
          const token = sign({username: req.query.username})
          // const { username } = res.locals.data[0]
          delete res.locals.data[0].password
          res.jsonp({
            code: 200,
            msg: '登录成功',
            data: {
              token,
              userinfo: res.locals.data[0]
            }
          })
        } else {
          // 如果没有
          res.jsonp({
            code: 10003,
            msg: '用户名或密码错误',

          })
        }
      } else {
        res.jsonp({
          code: 10004,
          msg: '请输入用户名和密码'
        })
      }
    
    } 

    if (req.method === "POST") {
      res.jsonp({
        code: 200,
        msg: '注册成功'
      })
    }
    
  } else {
    // 正常返回
    res.jsonp({
      code: 200,
      msg: '请求成功',
      data: res.locals.data
    })
  }

  
}



server.use(router)



server.listen(3000, () => {
  console.log('服务已启动，请访问：http://localhost:3000查看')
})