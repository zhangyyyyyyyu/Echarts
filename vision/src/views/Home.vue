<template>
  <div class="screen-container">
    <header class="screen-header">
      <span class="logo"></span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img class="qiehuan" src="../../public/static/img/下载.png" @click="handleChangeTheme">
        <div class="datetime">{{nowDate}}</div>
      </div>
    </header>

    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="{ fullscreen: fullScreenStatus.trend }">
          <!-- 销量趋势图表 -->
          <trend ref="trend"></trend>
            <div class="resize">
              <!-- icon-compress-alt 向内 -->
              <span @click="changeSize('trend')" :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
            </div>
        </div>
        <div id="left-bottom" :class="{ fullscreen: fullScreenStatus.seller }">
          <!-- 商家销售金额图表 -->
          <seller ref="seller"></seller>
          <div class="resize">
            <!-- icon-compress-alt 向内 -->
            <span @click="changeSize('seller')" :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>

      <section class="screen-middle">
        <div id="middle-top" :class="{ fullscreen: fullScreenStatus.map }">
          <!-- 商家分布图表 -->
          <single-map ref="map"></single-map>
           <div class="resize">
            <!-- icon-compress-alt 向内 -->
            <span @click="changeSize('map')" :class="['iconfont', fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
           </div>
        </div>
      </section>

      <section class="screen-right">
        <div id="right-top" :class="{ fullscreen: fullScreenStatus.hot }">
          <!-- 热销商品占比图表 -->
          <hot ref="hot"></hot>
           <div class="resize">
             <!-- icon-compress-alt 向内 -->
             <span @click="changeSize('hot')" :class="['iconfont', fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
           </div>
        </div>
        <div id="right-bottom" :class="{ fullscreen: fullScreenStatus.stock }">
          <!-- 库存销量分析图表 -->
          <stock ref="stock"></stock>
           <div class="resize">
             <!-- icon-compress-alt 向内 -->
             <span @click="changeSize('stock')" :class="['iconfont', fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
           </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from '../components/Hot.vue'
import Map from '../components/Map.vue'
import Seller from '../components/Seller.vue'
import Stock from '../components/Stock.vue'
import Trend from '../components/Trend.vue'

import { mapState } from 'vuex'
// 导入自己定义的主题工具函数 用于返回不同主题下的配置对象
import { getThemeValue } from '../utils/theme_utils'

export default {
  data() {
    return {
      // 各组件是否全屏状态
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false,
      },
      // 当前的系统时间
      systemDateTime: null,
      // 用于保存当前系统日期的定时器id
      timerID: null,
      //用于保存当前时间
      nowDate: null,
    }
  },
  components: {
    'hot':Hot,
    'single-map': Map,
    'seller':Seller,
    'stock':Stock,
    'trend':Trend,
  },
  methods:{
        // 监听全屏事件
    changeSize(chartName) {
      // 1.改变fullScreenStatus
       this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
      // // 2.手动调用每个图表中的 screenAdapter 触发响应式
       this.$nextTick(() => {
         this.$refs[chartName].screenAdapter()
       })
    },
    handleChangeTheme(){
      //修改vuex中的数据
      this.$store.commit('changeTheme')
    },
    //获取当前时间
    currentTime() {
     setInterval(this.formatDate, 500);
    },
   formatDate() {
     let date = new Date();
     let year = date.getFullYear(); // 年
     let month = date.getMonth() + 1; // 月
     let day = date.getDate(); // 日
     let week = date.getDay(); // 星期
     let weekArr = [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ];
     let hour = date.getHours(); // 时
     hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
     let minute = date.getMinutes(); // 分
     minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
     let second = date.getSeconds(); // 秒
     second = second < 10 ? "0" + second : second; // 如果只有一位，则前面补零
     this.nowDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
  },
  computed:{
     ...mapState(['theme'])
  },
  mounted(){
    this.currentTime()
  }
}
</script>

<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 9999;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    a {
      text-decoration: none;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 38%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>