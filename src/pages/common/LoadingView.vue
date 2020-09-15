<!--自定义loading-->
<template>
    <view v-if="isShow" class="loading" :style="{opacity: opacity}">
        <view class="loading-bg" v-if="isShow" @touchmove.stop.prevent @click="onClickClose"></view>
        <view class="loading-center">
            <view class="object object_four"></view>
            <view class="object object_three"></view>
            <view class="object object_two"></view>
            <view class="object object_one"></view>
        </view>
    </view>
</template>

<script>

    export default {
        name: "loading-view",
        components: {},
        data(){
            return {
                delayST:50,//延时出现loading
                opacity:0,
            }
        },
        props: {
            isShow:{
                type:Boolean,
                default:false
            },
        },

        watch: {
            isShow(newValue, oldValue) {
                if(newValue){
                    let timer=setTimeout(()=>{
                        clearTimeout(timer)
                        this.opacity=1;
                    },this.delayST)
                }else{
                    this.opacity=0;
                }
            }
        },

        computed:{

        },

        destroyed(){

        },
        async mounted(){

        },

        methods: {
            onClickClose(e){

            }
        }
    }
</script>


<style scoped>

    .loading{
        position: absolute;
        width: 100%;
        height: 100%;
        top:0;
        left:0;
        transition: all 0.3s ease-in-out;
        opacity: 0;
        pointer-events: none;
    }

    .loading-bg{
        width: 100%;
        height: 100%;
        pointer-events: auto;
    }

    .loading-center{
        position: absolute;
        left: 50%;
        top: 50%;
        height: 200px;
        width: 200px;
        margin-top: -100px;
        margin-left: -100px;
        /*transform: rotate(-135deg);*/
        pointer-events: none;
    }
    .object{
        border-radius: 50% 50% 50% 50%;
        position: absolute;
        border-top: 5px solid rgba(256, 256, 256, 0.54);
        border-bottom: 5px solid transparent;
        border-left:  5px solid rgba(256, 256, 256, 0.29);
        border-right: 5px solid transparent;
        animation: animate 2s infinite;
    }
    .object_one{
        left: 75px;
        top: 75px;
        width: 50px;
        height: 50px;
    }

    .object_two{
        left: 65px;
        top: 65px;
        width: 70px;
        height: 70px;
        animation-delay: 0.2s;
    }

    .object_three{
        left: 55px;
        top: 55px;
        width: 90px;
        height: 90px;
        animation-delay: 0.4s;
    }
    .object_four{
        left: 45px;
        top: 45px;
        width: 110px;
        height: 110px;
        animation-delay: 0.6s;
    }

    @keyframes animate {
        50% {
            transform: rotate(360deg) scale(0.8);
        }
    }
</style>
