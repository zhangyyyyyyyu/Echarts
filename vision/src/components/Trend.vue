<template>
    <div class="com-container">
      <div class="title" @click="showChoice = !showChoice" :style="comStyle">
         <span class="before-icon">▎</span>
         <span>{{ showTitle }}</span>
         <span class="iconfont title-icon" :style="comStyle">&#xe6eb;</span>
         <div class="select-con">
           <div class="select-item" v-show="showChoice" @click.prevent="handleSelect(item.key)" v-for="item in selectTypes" :key="item.key">
            {{ item.text }}
           </div>
         </div>
       </div>
         <div class="com-chart" ref="trend_ref"></div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default({
    data(){
        return{
            chartInstance: null,
            allData: null,
            showChoice: false,//下拉菜单的展示
            chocieType: 'map',//显示的数据类型
            titleFontSize: 0//标题字体大小的设置
        }
    },
    mounted() {
        this.initChart()
        this.getData()
        window.addEventListener('resize',this.screenAdapter)
        this.screenAdapter()
    },
    destroyed() {//销毁的意义在于防止结束程序后的内存溢出导致数据泄露
        window.removeEventListener('resize',screenAdapter)
    },
    computed: {
        ...mapState(['theme']),
        selectTypes() {
            if(!this.allData){
                return []
            }else{
                return this.allData.type.filter(item => {
                    //将可选的菜单项剔除之前所选的
                    return item.key !== this.chocieType
                })
            }
        },
        showTitle() {
            if(!this.allData)
                return ''
            return this.allData[this.chocieType].title  
        },
        comStyle() {
            return {
                fontSize: this.titleFontSize + 'px'
            }
        }
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
        initChart(){
            this.chartInstance = this.$echarts.init(this.$refs.trend_ref,this.theme)
            const initOption = {
                  xAxis:{
                    type:'category',
                    boundaryGap: false//数据紧挨y轴  无间隙
                  },
                  yAxis:{
                    type:'value'
                  },
                  grid:{
                     left:'3%',
                     top: '35%',
                     right:'4%',
                     bottom: '1%',
                     containLabel: true//是坐标轴的文字随坐标轴一起动
                  } ,
                  tooltip:{
                      trigger: 'axis'//鼠标触及坐标轴显示数据效果
                  },
                  legend:{//图例效果
                      left: 20,
                      top: '15%',
                      icon:'circle'
                  }
            }
            this.chartInstance.setOption(initOption)   
        },
        async getData() {
            const{data:res} = await this.$http.get('trend')
            this.allData = res
            this.updateChart() 
        },
        updateChart(){
             // 半透明的颜色值
             const colorArr1 = ['rgba(11, 168, 44, 0.5)', 'rgba(44, 110, 255, 0.5)', 'rgba(22, 242, 217, 0.5)', 'rgba(254, 33, 30, 0.5)', 'rgba(250, 105, 0, 0.5)']
            // 全透明的颜色值
            const colorArr2 = ['rgba(11, 168, 44, 0)', 'rgba(44, 110, 255, 0)', 'rgba(22, 242, 217, 0)', 'rgba(254, 33, 30, 0)', 'rgba(250, 105, 0, 0)']
            //类目轴的数据
            const timeArr = this.allData.common.month
            //y轴下的series数据
            const valueArr = this.allData[this.chocieType].data
            const seriesArr = valueArr.map((item,index) => {
                return{
                    name: item.name,
                    type: 'line',
                    data: item.data,
                    stack: this.chocieType,//使折线图为堆积效果避免杂乱
                    areaStyle:{//区域面积的颜色渐变效果
                        color: new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                            {
                                offset:0,
                                color:colorArr1
                            },
                            {
                                offset:1,
                                color:colorArr2
                            }
                        ])
                    }
                }
            }) 
            //图例的数据
            const legendArr = valueArr.map(item => {
                return item.name
            })
            //处理数据
            const dataOption = {
                xAxis:{
                    data: timeArr
                },
                legend:{
                    data:legendArr
                },
                series: seriesArr
            }
            this.chartInstance.setOption(dataOption)
        },
        screenAdapter() {
            this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
            const adapterOption = {
                legend:{
                    itemWidth: this.titleFontSize,
                    itemHeight: this.titleFontSize,
                    itemGap: this.titleFontSize,
                    textStyle:{
                        fontSize: this.titleFontSize / 2
                    }
                }
            }
            this.chartInstance.setOption(adapterOption)
            this.chartInstance.resize()
        },
        handleSelect(currentType) {//控制选择用户选择的菜单项
            this.chocieType = currentType
            this.updateChart()
            this.showChoice = false
        }
    }
})
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 50px;
  top: 20px;
  z-index: 999;
  color: white;
  cursor: pointer;

  .before-icon {
    position: absolute;
    left: -20px;
  }
  .title-icon {
    margin-left: 10px;
  }
}
</style>