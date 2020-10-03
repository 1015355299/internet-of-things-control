const net = require('net')
const express = require('express')
const app = express()
const router = express.Router()

app.use(require('cors')())
app.use(express.json())

process.env.domain =
  process.env.NODE_ENV == 'production' ? 'wlw.5102it.cn' : 'localhost:3333'

// 连接设备
const device = {
  isConnected: false,
  remoteAddress: '127.0.0.1',
  remotePort: 55555,
  id: 0,
}
let Dev_Socket = {}
// 静态资源托管，控制页面
app.use('/', express.static(__dirname + '/iotc'))

// 检测设备连接状态
router.get('/getStatus/:id', (req, res) => {
  if (req.params.id * 1 == device.id * 1 && device.isConnected) {
    console.log('设备已识别！')
    res.send(
      JSON.stringify({
        msg: `device: ${device.remoteAddress}:${device.remotePort}`,
        connected: true,
      })
    )
  } else {
    console.log(`设备未识别！req_id:${req.params.id} dev_id:${device.id}`)
    res.send(
      JSON.stringify({
        msg: `device is not find!`,
        connected: false,
      })
    )
  }
})

// 关闭连接
router.get('/closeSocket', (req, res) => {
  Dev_Socket.write && Dev_Socket.destroy()
  setTimeout(() => {
    device.isConnected = !Dev_Socket.destroyed
    console.log(
      `关闭socket连接 ${device.isConnected ? 'close fail' : 'closed'}!`
    )
    res.send(
      JSON.stringify({
        msg: `device: ${device.remoteAddress}:${device.remotePort} ${
          device.isConnected ? 'close fail' : 'closed'
        }!`,
        connected: device.isConnected,
      })
    )
  }, 1000)
})

// 发送指令
router.post('/sendCmd', (req, res) => {
  if (Dev_Socket.write && socket_send_data(Dev_Socket, req.body)) {
    console.log('写入指令成功！')
    device.isConnected = true
    res.send({
      msg: `send cmd [${req.body.cmd}] ok!`,
      connected: true,
    })
  } else {
    console.log('写入指令失败！')
    device.isConnected = false
    res.send({
      msg: `send cmd [${req.body.cmd}] fail!`,
      connected: false,
    })
  }
})

// 发送socket数据
function socket_send_data(socket, body) {
  return socket.write(Buffer.from(body.cmd, body.encoded), function () {
    console.log('socket write data : ' + body.cmd)
  })
}
function socket_listener(socket) {
  console.log('TCP服务器已连接！ socket_listener')
  Dev_Socket = socket

  //监听dada事件
  socket.on('data', (data) => {
    const readSize = socket.bytesRead
    const res = data.toString()
    device.remoteAddress = socket.remoteAddress.slice(7)
    device.remotePort = socket.remotePort
    device.id = Number(res.split(':')[1])
    device.isConnected = false
    console.log('the size of data is : ' + readSize)
    console.log('the data is : ' + res)
    console.log('the remoteAddress is : ' + device.remoteAddress)
    console.log('the remotePort is : ' + device.remotePort)

    // 首次连接
    if (res.split(':')[0] == 'CONNECTED') {
      device.isConnected = true
      console.log('设备已连接！ CONNECTED:' + res.split(':')[1])
    }
  })
  socket.setTimeout(180 * 1000, () => {
    device.isConnected = false
    console.log('socket超时关闭连接 setTimeout')
    socket.destroy()
  })
  socket.on('connect', () => {
    device.isConnected = true
    console.log('socket已连接 connect')
  })
  socket.on('drain', () => {
    console.log('socket可写入 drain')
  })
  socket.on('error', () => {
    device.isConnected = false
    console.log('socket连接出错 error')
    socket.destroy()
    //socket = socket.connect(device.remotePort, device.remoteAddress,socket_listener)
  })
  socket.on('end', () => {
    device.isConnected = false
    console.log('socket已断开连接 end')
  })
  socket.on('close', () => {
    device.isConnected = false
    console.log('socket已关闭连接 close')
  })
}

//创建服务器
var server = net.createServer()

// tcp服务器连接
server.on('connection', socket_listener)

// tcp服务器出错
server.on('error', (e) => {
  device.isConnected = false
  console.log('TCP服务器出错！')
  // 地址占用错误
  if (e.code === 'EADDRINUSE') {
    console.log('地址正被使用，重试中...')
    setTimeout(() => {
      server.close() // 重启
      server.listen(8266, () => {
        console.log('TCP服务器重启！')
        console.log('TCP server is listening in localhost:8266!')
      })
    }, 2000)
  }
})

// tcp服务器关闭
server.on('close', () => {
  device.isConnected = false
  console.log('TCP服务器关闭！')
  setTimeout(() => {
    server.listen(8266, () => {
      console.log('TCP服务器重启！')
      console.log('TCP server is listening in localhost:8266!')
    })
  }, 2000)
})

//设置tcp连接最大数量
server.maxConnection = 5

// http错误返回
app.use(async (err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    msg: err.message,
    connected: device.isConnected,
  })
})

// 后端http请求路由
app.use('/wlw/api', router)

// 监听 http 连接 3333 端口，由 nginx (80转)443 代理到 3333 端口
app.listen(3333, () => {
  console.log(`HTTP server is listening in ${process.env.domain}`)
})

// 监听 tcp 连接 8266 端口，由 nginx 58266 代理到 8266 端口
server.listen(8266, () => {
  console.log('TCP server is listening in localhost:8266!')
})
