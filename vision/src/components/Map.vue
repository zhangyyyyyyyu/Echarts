<!-- 商家分布图表 -->
<template>
  <div class='com-container' @dblclick="revertMap">
    <div class='com-chart' ref='map_ref'></div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '../utils/map_utils'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      mapData: {} // 所获取的省份的地图矢量数据
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
    computed:{
    ...mapState(['theme'])
  },
  watch:{
    theme(){
        // 销毁当前的图表
      this.chartInstance.dispose()
      // 以最新主题初始化图表对象
      this.initChart()
      // 屏幕适配
      this.screenAdapter()
      // 渲染数据
      this.updateChart()
    }
  },
  methods: {
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref,this.theme)
      // 获取中国地图的矢量数据
      // http://localhost:8999/static/map/china.json
      // 由于我们现在获取的地图矢量数据并不是位于KOA2的后台, 所以咱们不能使用this.$http
      const res = await axios.get('http://localhost:8999/static/map/china.json')
      this.$echarts.registerMap('china',res.data)
      const initOption = {
          title: {
              text:'商家分布',
              left: 20,
              top: 20
          },
          geo: {
              type:'map',
              map: 'china',
              top:'5%',
              bottom:'5%',
              itemStyle:{
                  areaColor:'#2E72BF',
                  borderColor: '#333'
              }
          },
          legend:{
              left:'5%',
              bottom:'5%',
              orient:'vertical'//让图例从上向下排列
          }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click',async arg => {
          //arg.name得到所点击的省份
          const provinceInfo = getProvinceMapInfo(arg.name)
          console.log(provinceInfo)
          //需要获取这个省份地图的矢量数据
          //判断当前所点击的这个省份地图的矢量数据在mapData中是否存在
          if(!this.mapData[provinceInfo.key]){
              const res = await axios.get('http://localhost:8999'+provinceInfo.path)
              this.mapData[provinceInfo.key] = res.data
              this.$echarts.registerMap(provinceInfo.key, res.data)
          }
          const changeOption={
              geo:{
                  map: provinceInfo.key
              }
          }
          this.chartInstance.setOption(changeOption)
      })
    },
    async getData () {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      const { data: res } = await this.$http.get('map')
      this.allData = res
      //console.log(this.allData)
      this.updateChart()
    },
    updateChart () {
      //处理图表需要的数据
      //图例数据
      const legendArr = this.allData.map(item=>{
          return item.name
      })
      const seriesArr = this.allData.map(item => {
          //return对象是一个类别下的所有数据
          //如果想在地图中呈现散点数据  就要给散点图表增加一个配置 coordinateSystem:'geo
          return{
              type: 'effectScatter',
              rippleEffect:{//散点图的涟漪效果
                  scale:5,
                  brushType:'stroke'
              },
              name: item.name,
              data: item.children,
              coordinateSystem: 'geo'
          }
      })
      const dataOption = {
          legend:{
              data:legendArr
          },
           series: seriesArr,
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
          title:{
              textStyle:{
                  fonstSize: titleFontSize
              }
          },
          legend:{
              itemWidth: titleFontSize / 2,
              itemHeight: titleFontSize / 2,
              itemGap: titleFontSize / 2,//图里字体之间的间隔
              textStyle:{
                  fonstSize: titleFontSize / 2
              }
          }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    revertMap() {
        const revertOption = {
            geo:{
                map: 'china'
            }
        }
        this.chartInstance.setOption(revertOption)
    }
  }
}
</script>
