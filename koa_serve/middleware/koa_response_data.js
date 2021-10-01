//业务逻辑的中间件
const path = require('path')
const fileUtils = require('../utils/fileUtils')
module.exports = async(ctx, next) => {
    //客户端为/api/seller  对应本地是../data/seller.json 故需要转换
    const url = ctx.request.url
        //console.log(url);

    //将/api/seller替换为空故/seller
    let filePath = url.replace('/api', '')
        //console.log(filePath);

    //../data/seller.json
    filePath = '../data' + filePath + '.json'
        //console.log(filePath);

    //拼接为绝对路径D:\Ecahrts项目\koa_server\data\seller.json
    filePath = path.join(__dirname, filePath)
    console.log(filePath);

    try {
        const result = await fileUtils.getFileJsonData(filePath)
        console.log(result)
        ctx.response.body = result
    } catch (error) {
        const errMsg = {
            message: '读取内容失败，文件资源不存在',
            status: 404
        }
        ctx.response.body = JSON.stringify(errMsg)
    }

    await next()
}