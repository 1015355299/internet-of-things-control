const net = require('net')
const express = require('express')
const app = express()
const router = express.Router()
//const socket = new net.Socket()
let isConnected = false
app.use(require('cors')())
app.use(express.json())

//保存分类

if (process.env.NODE_ENV == 'production') {
  process.env.domain = 'wlw.5102it.cn'
  //require('./routes/admin/index')(app)
} else {
  process.env.domain = 'localhost:3333'
  //require('./routes/admin/dev')(app)
}

app.use('/', express.static(__dirname + '/iotc'))
//require('./routes/index')(app,socket)
//创建服务器
var server = net.createServer((socket) => {
  // //获取地址信息
  // var address = server.address()
  // var message = 'client,the server address is' + JSON.stringify(address)

  router.post('/sendCmd', async (req, res) => {
    console.log(req.body)
    socket.write(req.body.cmd, function () {
      var writeSize = socket.bytesWritten
      console.log('data has send : ' + req.body.cmd)
      //console.log('the size of message is : ' + writeSize)
    })
    res.send(`send cmd [${req.body.cmd}] ok!`)
  })

  router.get('/getStatus', async (req, res) => {
    //监听dada事件
    socket.on('data', (data) => {
      var readSize = socket.bytesRead
      console.log('the size of data is : ' + readSize)
      console.log('the data is : ' + data.toString())
      console.log('the remoteAddress is : ' + socket.remoteAddress)
      console.log('the remotePort is : ' + socket.remotePort)
      //发送数据
      // socket.write(data.toString(), function () {
      //   var writeSize = socket.bytesWritten
      //   console.log('data has send : ' + data.toString())
      //   console.log('the size of message is : ' + writeSize)
      // })
      if(data=='CONNECTED'){
        isConnected = true
      }
    })
    res.send(JSON.stringify({connected:isConnected}))
  })

  socket.setTimeout(300 * 1000, () => {
    socket.end()
  })
  socket.on('connect', () => {
    console.log('服务器已连接')
  })

  socket.on('error', () => {
    console.log('服务器连接出错')
  })
  socket.on('end', () => {
    isConnected = false
    console.log('服务器已断开连接')
  })
})

// tcp服务器出错
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('地址正被使用，重试中...')
    setTimeout(() => {
      server.close() // 重启
      server.listen(8266, () => {
        console.log('server is restart! port:8266!')
      })
    }, 2000)
  }
  console.log('TCP服务器出错！')
})

//设置连接最大数量
server.maxConnection = 3

app.use(async (err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    message: err.message,
  })
})

app.use('/wlw/api', router)

app.listen(3333, () => {
  console.log(`http://${process.env.domain}`)
})

//设置监听端口
server.listen(8266, () => {
  console.log('server is listening! port:8266!')
})
