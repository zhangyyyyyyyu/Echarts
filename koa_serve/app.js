//服务器的入口文件
//1.创建koa的实例对象
const Koa = require('koa')
const app = new Koa()
    //2.绑定中间件
    //绑定第一层中间件
const responseDurationMiddleware = require('./middleware/koa_response_duration')
app.use(responseDurationMiddleware)
    //绑定第二层中间件
const responseHeaderMiddleware = require('./middleware/koa_response_header')
app.use(responseHeaderMiddleware)
    //绑定第三层中间件
const responseDataMiddleware = require("./middleware/koa_response_data")
app.use(responseDataMiddleware)
    //3.获取端口号
app.listen(8888)

const webSocketService = require('./service/web_socket_service')
    //开启服务端监听  监听客户端的连接
    //当某一个客户端连接成功之后  就会对这个客户端进行message事件的监听
webSocketService.listen()