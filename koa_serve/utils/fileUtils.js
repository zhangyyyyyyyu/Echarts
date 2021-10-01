//读取文件目录的工具
const fs = require('fs')
module.exports.getFileJsonData = (filePath) => {
    //根据文件路径读取文件内容
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (error, data) => {
            if (error) {
                //读取失败
                reject(error)
            } else {
                //读取成功
                resolve(data)
            }
        })
    })
}