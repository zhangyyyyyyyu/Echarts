//计算服务器消耗时间的中间件
module.exports = async(ctx, next) => {
    //记录开始时间
    const start = Date.now()
        //让内层中间件开始执行(因为要获取next的promise数据)
    await next()
        //记录结束时间
    const end = Date.now()
        //设置相应头 X-Response-Time
    const duration = end - start
        //ctx.set设置响应头
    ctx.set('X-Response-Time', duration + 'ms')
}