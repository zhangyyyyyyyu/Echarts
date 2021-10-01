//webstock目的就是使得后端数据变化时给前端传话---此项目前端并未用
const webSocket = require('ws')
const path = require('path')
const fileUtils = require('../utils/fileUtils')
    //创建webSocket服务端的对象  绑定端口号是9998
const wss = new webSocket.Server({
        port: 9998
    })
    //服务端开启了监听
module.exports.listen = () => {
    //对客户端的连接事件进行监听
    //client:代表的是客户端连接socket对象
    wss.on('connection', client => {
        //console.log('客户端连接成功了');
        //对客户端连接对象进行message事件监听
        //msg: 由客户端发给服务端的数据
        client.on('message', async msg => {
            //console.log('客户端发送数据给服务端了' + msg);
            //由服务端向客户端发送数据
            let payLoad = JSON.parse(msg)
            const action = payLoad.action
            if (action === 'getData') {
                let filePath = '../data' + payLoad.charName + '.json'
                filePath = path.join(__dirname, filePath)
                const res = await fileUtils.getFileJsonData(filePath)
                payLoad.data = res
                client.send(JSON.stringify(payLoad))
            } else {
                //原封不动的将收到的数据转发给处于每一个链接状态的客户端
                wss.clients.forEach(client => {
                    client.send(msg)
                })
            }


        })
    })
}