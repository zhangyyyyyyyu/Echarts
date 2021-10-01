<template>
    <div class="com-page">
        <stock></stock>
    </div>
</template>

<script>
import Stock from '../components/Stock.vue'

export default({
    data(){
        return {}
    },
    components:{
        'stock': Stock
    }
})
</script>