<!--展示盒子-->
<template>
    <view v-if="isShow" class="card-pnl">

        <view @touchstart="test.touchstart" @touchmove="test.touchmove" @touchend="test.touchend">
            <view class="card-box" :data-rotate="rotateDeg">
                <view class="card-splices" :style="computedBoxRotate">

                    <view v-for="(item,index) in boxList" :key="index" class="face" :class="item.face"
                          v-if="item.visible">
                        <view class="card-none" v-if="item.state===3">
                            没有更多数据了～
                        </view>

                        <view class="card-content" v-if="item.state===2">
                            <view @touchstart="onTouchStart(item)"
                                  @touchend="onTouchEnd(item)"
                                  @touchCancel="onTouchEnd(item)">
                                <image v-if="item.image" class="card-image"
                                       :style="{opacity:item.imgOpa,filter:'blur('+item.filter+'px)'}" mode="aspectFill"
                                       :src="item.image" @load="onLoadImg(item)"></image>
                                <view class="image-mask" :style="{opacity:item.txtOpa}"></view>
                                <view class="card-txt" :style="{opacity:item.txtOpa}">
                                    <view class="card-date">{{item.date}}</view>
                                    <view class="his-title">{{item.id}}、{{item.title}}</view>
                                    <view>{{item.desc}}</view>
                                </view>
                            </view>

                            <view class="btn-editor" v-if="computedShowWrite" @click="onClickEdite(item.uid)"></view>

                        </view>
                        <loading-view :isShow="item.state===1"></loading-view>
                    </view>
                </view>
            </view>
        </view>

        <view class="btn-close" @click="onClickClose"></view>
        <view class="ctrl-btns">
            <view v-if="preBtn" class="btn-pre" @click="onClickPre"></view>
            <view v-if="nextBtn" class="btn-next" @click="onClickNext"></view>
        </view>

    </view>
</template>

<script module="test" lang="wxs">

var startY = 0
function touchstart(event, ins) {
    //console.log('currtarget:'+JSON.stringify(event.currentTarget));
    var touch = event.touches[0] || event.changedTouches[0]
    startY = touch.pageY

    //添加class
    //ins.selectComponent('.card-splices').addClass('no-tween');

}
function touchend(event, ins){
    var touch = event.touches[0] || event.changedTouches[0]
    var endY = touch.pageY;
    if(endY-startY>30){
        ins.callMethod('onClickNext')
    }
    if(endY-startY<-30){
         ins.callMethod('onClickPre')
    }
}
function touchmove(event, ins) {
    return false
}
module.exports = {
    msg: 'test',
    touchstart: touchstart,
    touchend: touchend,
    touchmove: touchmove
}

</script>

<script>

    import LoadingView from "./LoadingView";
    import { mapActions, mapState ,mapGetters} from 'vuex'
    import {AuthLevel} from "@/utils/global";

    export default {
        name: "cube-view",
        components: {LoadingView},
        data(){
            return {
                isShow:false,
                rotateDeg:0,
                opacity:0,

                /*盒子显示数据*/
                boxList:[
                    {index:0, face:'front',id:'', uid:'',title:'',desc:'',image:'',state:3,date:'',txtOpa:1,imgOpa:0,filter:5,visible:false},
                    {index:1, face:'top', id:'',uid:'',title:'',desc:'',image:'',state:3,date:'',txtOpa:1,imgOpa:0,filter:5,visible:false},
                    {index:2, face:'back',id:'', uid:'',title:'',desc:'',image:'',state:3,date:'',txtOpa:1,imgOpa:0,filter:5,visible:false},
                    {index:3, face:'bottom', id:'',uid:'',title:'',desc:'',image:'',state:3,date:'',txtOpa:1,imgOpa:0,filter:5,visible:false},
                ],

                //获取到的历史事件数据；
                historyList:[

                ],

                numMax:5,//一次最大请求数据；
                day:'09-06',//当前天
                date:'',
                pageIndex:0,
                stampTime:new Date('2020-09-07').getTime(),
                totalNum:0, //目标数据长度
                boxIndex:0,//当前显示索引
                dataIndex:0,//当前数据索引
                preBtn:false,
                nextBtn:true,
                loadingAll:false,//已经加载完所有数据
            }
        },
        props: {

        },

        computed:{
            computedFaceClass(){
                return function (index) {
                    if(index===0){
                        return 'front'
                    }else if(index===1){
                        return 'top'
                    }else if(index===2){
                        return 'back'
                    }else if(index===3){
                        return 'bottom'
                    }
                    return ''
                }
            },

            computedBoxIndex(){
                return function (index) {
                   return this.boxList[index].index;
                }
            },

            computedBoxTitle(){
                return function (index) {
                    return this.boxList[index].title;
                }
            },

            computedBoxDesc(){
                return function (index) {
                    return this.boxList[index].desc;
                }
            },

            computedBoxImage(){
                return function (index) {
                    return this.boxList[index].image;
                }
            },

            computedBoxRotate(){
                return 'transform:rotate3d(1, 0, 0, '+this.rotateDeg+'deg); opacity:'+this.opacity+';';
            },

            computedShowWrite(){
                if(this.userInfo&&this.userInfo.authLevel===AuthLevel.MANAGER){
                    return true;
                }
                return false;
            },
            ...mapState('server', ['userInfo', 'globalInfo']),

        },

        destroyed(){
        },
        async mounted(){
        },

        methods: {
             show(date){
                 this.isShow = true;
                 this.opacity = 0;
                 this.numMax = 5;//一次最大请求数据；
                 this.date = date;
                 let arr = date.split('-')
                 this.day = arr[1] + '-' + arr[2];//当前天
                 this.pageIndex = 0;
                 this.stampTime = new Date(date).getTime() + 24 * 60 * 60 * 1000;
                 this.totalNum = 0;
                 this.boxIndex = 0;//当前显示索引
                 this.dataIndex = 0;//当前数据索引
                 this.historyList = [];
                 this.preBtn = false;
                 this.nextBtn = false;
                 this.loadingAll = false;//已经加载完所有数据
                 this.boxList = [
                     {
                         index: 0,
                         face: 'front',
                         id: '',
                         uid: '',
                         title: '',
                         desc: '',
                         image: '',
                         state: 3,
                         date: '',
                         txtOpa: 1,
                         imgOpa: 0,
                         filter: 5,
                         visible: true
                     },
                     {
                         index: 1,
                         face: 'top',
                         id: '',
                         uid: '',
                         title: '',
                         desc: '',
                         image: '',
                         state: 3,
                         date: '',
                         txtOpa: 1,
                         imgOpa: 0,
                         filter: 5,
                         visible: false
                     },
                     {
                         index: 2,
                         face: 'back',
                         id: '',
                         uid: '',
                         title: '',
                         desc: '',
                         image: '',
                         state: 3,
                         date: '',
                         txtOpa: 1,
                         imgOpa: 0,
                         filter: 5,
                         visible: false
                     },
                     {
                         index: 3,
                         face: 'bottom',
                         id: '',
                         uid: '',
                         title: '',
                         desc: '',
                         image: '',
                         state: 3,
                         date: '',
                         txtOpa: 1,
                         imgOpa: 0,
                         filter: 5,
                         visible: false
                     },
                 ];

                 let timer = setTimeout(() => {
                     clearTimeout(timer);
                     this.opacity = 1;
                     this.rotateDeg = 0;
                     //
                     for (let i = 0; i < this.boxList.length; i++) {
                         let item = this.boxList[i];

                         item.state=1;
                         item.txtOpa=1;

                         //
                         // this.$set(item, 'state', 1);
                         // this.$set(item, 'txtOpa', 1);
                         this.$set(item, 'imgOpa', 0);

                         //this.boxList[i]=Object.assign({},this.boxList[i],{state:1,txtOpa:1,imgOpa:0})
                     }
                     //请求数据
                     this.initHistoryList()
                }, 50)
            },

            async initHistoryList() {
                await this.updateHistoryList();
                //更新loading状态
                this.boxIndex = 0;//当前显示索引
                this.dataIndex = 0;//当前数据索引
                if (this.historyList.length <= 1) {
                    this.preBtn = false;
                    this.nextBtn = false;
                } else {
                    this.preBtn = false;
                    this.nextBtn = true;
                }
                this.updateCubeShow()
            },

            async updateHistoryList() {
                let param = {
                    numMax: this.numMax,
                    day: this.day,
                    stampTime: this.stampTime,
                    pageIndex: this.pageIndex,
                }
                let result = await this.getHistoryList(param);
                if (result && result.code === 200) {
                    if (this.historyList.length === 0) {
                        this.totalNum = result.data.total + 1;
                    }
                    //result.data.list补充属性
                    this.historyList = this.historyList.concat(result.data.list);
                    if (this.historyList.length === result.data.total) {
                        this.historyList.push({state: 3});
                        this.loadingAll = true;
                    } else {
                        this.loadingAll = false;
                    }
                }

                //console.log('historyList:'+JSON.stringify(this.historyList))
            },

            //更新当前cub显示  目标dataIndex不存在时, Index+1不能继续旋转
            updateCubeShow() {
                //只更新显示当前一个盒子面

                let box = this.boxList[this.boxIndex];
                let data = this.historyList[this.dataIndex];

                let changeValues=[];

                if (box) {
                    if (data) {

                        //全局记录当前新闻数据：图片+标题
                        if (data.image) {
                            this.saveShareData({
                                image: data.image,
                                title: data.title,
                                path: "/pages/index/index?backflow=true&date=" + data.date,
                                date: data.date
                            })
                        } else {
                            this.saveShareData(null)
                        }

                        changeValues.push(['visible',true]);

                        if (box.uid === data.uid) return;

                        changeValues.push(['id',(this.dataIndex + 1)]);
                        changeValues.push(['uid',data.uid]);
                        changeValues.push(['title',data.title]);
                        changeValues.push(['desc',data.desc]);
                        changeValues.push(['image',data.image]);
                        changeValues.push(['date',data.date]);
                        changeValues.push(['imgOpa',0]);

                        /*
                           1、loading状态
                           2、显示数据状态
                           3、没有更多内容状态；
                           4、数据异常状态/重新请求；
                        */
                        if (this.loadingAll && this.dataIndex === this.historyList.length - 1) { //最后一个是没有更多内容提示状态
                            changeValues.push(['state',3]);

                        } else {
                            changeValues.push(['state',2]);
                        }

                    } else {
                        changeValues.push(['state',1]);
                    }


                    let updateValue=changeValues.pop();
                    for(let j=0;j<changeValues.length;j++){
                        box[changeValues[j][0]]=changeValues[j][1];
                    }
                    this.$set(box, updateValue[0], updateValue[1]);

                }

            },

            onTouchStart(item) {
                 item.txtOpa=0;
                // this.$set(item, 'txtOpa', 0);
                this.$set(item, 'filter', 0);
            },
            onTouchEnd(item) {
                 item.txtOpa=1
                // this.$set(item, 'txtOpa', 1);
                this.$set(item, 'filter', 5);
            },
            onLoadImg(item) {
                //console.log('item'+JSON.stringify(item))
                this.$set(item, 'imgOpa', 1)
            },
            //旋转到下一个历史事件
            async onClickNext(e) {

                if (this.dataIndex >= this.totalNum - 1) return;
                if (this.boxList[this.boxIndex].state === 1) return;//loading

                this.boxIndex++;
                if (this.boxIndex > 3) {
                    this.boxIndex = 0;
                }
                this.dataIndex++;

                let value = 90 - Math.abs(this.rotateDeg % 90);
                this.rotateDeg -= value;

                if (!this.loadingAll && this.dataIndex >= this.historyList.length) {

                    let nextbox = this.boxList[this.boxIndex];
                    this.$set(nextbox, 'state', 1);
                    this.pageIndex++;
                    await this.updateHistoryList()
                }

                if (this.loadingAll && this.dataIndex >= this.historyList.length - 1) {
                    this.nextBtn = false;
                    this.preBtn = true;
                } else {
                    this.nextBtn = true;
                    this.preBtn = true;
                }
                this.updateCubeShow();
            },

            //旋转到上一个历史事件
            onClickPre(e) {
                if (this.dataIndex <= 0) return;
                if (this.boxList[this.boxIndex].state === 1) return;
                this.boxIndex--;
                if (this.boxIndex < 0) {
                    this.boxIndex = 3;
                }

                this.dataIndex--;
                let value = 90 - Math.abs(this.rotateDeg % 90);
                this.rotateDeg += value;

                if (this.dataIndex === 0) {
                    this.nextBtn = true;
                    this.preBtn = false;
                } else {
                    this.nextBtn = true;
                    this.preBtn = true;
                }

                this.updateCubeShow();
            },

            onClickClose(e) {
                this.opacity = 0;
                this.saveShareData(null)

                let delayT = setTimeout(() => {
                    clearTimeout(delayT);
                    this.isShow = false;
                    this.rotateDeg = 0;
                    //清理变量
                    this.$emit('closeView')
                }, 400)
            },

            onClickEdite(uid) {
                uni.navigateTo({
                    url: '/pages/index/input?uid=' + uid
                })
            },

            ...mapActions(['saveShareData']),
            ...mapActions('server',['getHistoryList'])
        }
    }
</script>


<style scoped>

    .card-pnl{
        position: fixed;
        width: 100%;
        height: 100vh;
        left: 0;
        top:0;

        perspective: 1000px;
    }

    /*要旋转这个盒子而不是卡片*/
    .card-box{
        position: absolute;
        top:50%;
        left: 50%;

        width: 750upx;
        height: 800upx;
        transform: translate3d(-50%, -50%, -400upx);
        transform-style: preserve-3d;
    }

    .card-splices{
        display: inline-block;
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        top:0;
        left: 0;
        transform-style: preserve-3d;
        transition:transform 0.5s,opacity 0.5s;
        /*transform:rotate3d(1, 0, 0, -90deg);*/
        opacity: 0;
    }

    .face{
        position: absolute;
        overflow: hidden;
        user-select: none;
        width: 100%;
        height: 100%;
        top:0;
        left: 0;
        margin: 0;
        padding: 0;
        color: rgba(256,256,256,0.8);
    }

    .front{
        background-image: linear-gradient(135deg, #f7cb67, #f18434);
        /*box-shadow: 0px 20px 100px #555;*/
        transform: translate3d(0,0,400upx) rotate3d(0, 0, 0, 0deg);
        /*filter: drop-shadow(30px 30px 23px rgba(0,0,0,0.3));*/
    }

    .top{
        background-image: linear-gradient(135deg, #b36cd5, #513af5);
        /*box-shadow: 0px 20px 100px #555;*/
        transform: translate3d(0,-400upx,0) rotate3d(1, 0, 0, 90deg);
    }
    .back{
        background-image: linear-gradient(135deg, #75f8bc, #56c397);
        /*box-shadow: 0px 20px 100px #555;*/
        transform: translate3d(0,0,-400upx) rotate3d(1, 0, 0, 180deg);
    }
    .bottom{
        background-image: linear-gradient(135deg, #5b81eb, #145df5);
        /*box-shadow: 0px 20px 100px #555;*/
        transform: translate3d(0,400upx,0) rotate3d(1, 0, 0, -90deg);
    }

    .left{
        position: absolute;
        overflow: hidden;
        user-select: none;
        width: 800upx;
        height: 100%;
        top:0;
        left: 0;
        margin: 0;
        padding: 0;

        background-color: rgba(122,256,122,1);
        /*box-shadow: 0px 20px 100px #555;*/
        transform: translate3d(-400upx,0,0) rotate3d(0, 1, 0, -90deg);
    }

    .right{
        position: absolute;
        overflow: hidden;
        user-select: none;
        width: 800upx;
        height: 100%;
        top:0;
        left: 0;
        margin: 0;
        padding: 0;

        background-color: rgba(122,122,122,1);
        /*box-shadow: 0px 20px 100px #555;*/
        transform: translate3d(350upx,0,0) rotate3d(0, 1, 0, 90deg);
    }

    .ctrl-btns{
        position: absolute;
        width: 200upx;
        height: 50upx;
        bottom: 50upx;
        right: 30upx;

        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }

    .btn-pre{
        position: relative;
        width: 69upx;
        height: 40upx;
        background-image: url("../../static/icon-arr.png");
        background-size: 100% 100%;
    }

    .btn-next{
        position: relative;
        margin-left: 20upx;
        width: 69upx;
        height: 40upx;
        background-image: url("../../static/icon-arr.png");
        background-size: 100% 100%;
        transform: rotateX(180deg);
    }

    .btn-close{
        position: absolute;
        width: 44upx;
        height: 44upx;
        right: 30upx;
        top:50upx;
        background-image: url("../../static/btn-close.png");
        background-size: 100% 100%;
    }

    .card-content{
        margin: 0;
        padding: 0;
    }
    .card-none{
        height: 800upx;
        width: 100%;
        line-height: 800upx;
        text-align: center;
    }

    .card-image{
        position: absolute;
        top:0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: opacity 0.5s,filter 0.5s;
        opacity: 0;
        filter: blur(5px);
    }

    .card-txt{
        position: absolute;
        left: 0;
        top:0;
        margin: 20upx;
        font-size: 30upx;
        line-height: 40upx;
        transition: opacity 0.5s;
        opacity: 1;
    }

    .image-mask{
        position: absolute;
        left: 0;
        top:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.6);
        transition: opacity 0.5s;
        opacity: 1;

    }
    .his-title{
        font-weight: bold;
        line-height: 50upx;
    }
    .card-date{
        opacity: 0.5;
    }

    .btn-editor{
        position: absolute;
        width: 44upx;
        height: 44upx;
        right: 50upx;
        bottom: 50upx;
        opacity: 0.4;
        background-image: url("../../static/icon-write.png");
        background-size: 100% 100%;
    }


</style>
