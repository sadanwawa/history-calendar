<template>
	<view class="content">
		<view>
			<picker :disabled="pickDisabled" mode="date" name="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
				<view class="date-input">{{date}}</view>
			</picker>
			<!--<view class="btn-write" v-if="computedShowWrite" @click="onClickWrite"></view>-->
		</view>
		<!--展示盒子-->
		<cube-view ref="cubeView" @closeView="onCloseCubeView"></cube-view>

	</view>
</template>

<script>
	import {shareConfigDefault,shareConfig,updateShareConfig} from "@/utils/share";
	import CubeView from "../common/CubeView";
	import {AuthLevel} from "@/utils/global";
    import { mapActions, mapState } from 'vuex'

	export default {
		components: {CubeView},
		data() {
			return {
				date: '输入日期',
				pickDisabled:false,
				canWrite:true,
				timer:null
			}
		},

		computed:{
			computedShowWrite(){
				if(this.canWrite&&this.userInfo&&this.userInfo.authLevel===AuthLevel.MANAGER){
					return true;
				}
				return false;
			},
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			nowDate(){
				return this.getDate('now');
			},
			...mapState('server', ['userInfo', 'globalInfo']),
			...mapState(['isInit','shareData']),
		},

		onShareAppMessage(res){
			if(this.shareData){
				updateShareConfig({
					title:this.shareData.title,
					imageUrl:this.shareData.image,
					path:this.shareData.path
				});
			}else{
				updateShareConfig(shareConfigDefault);
			}
			return shareConfig;
		},

		onShareTimeline(res){
			if(this.shareData){
				return {
					title:this.shareData.title,
					query:'date='+this.shareData.date
				}
			}else{
				return {
					title:'历史上的今天都发生了什么？'
				}
			}
		},

		onLoad(e) {
		    uni.showLoading({title:'初始化...',icon:'none'});
		    this.pickDisabled=true;
			if(this.isInit){
				if(e.date){
					this.$refs.cubeView.show(e.date);
					this.canWrite=false;
				}
			}else{
				this.timer = setInterval(() => {
					if (this.isInit) {
					    uni.hideLoading()
                        this.pickDisabled=false;
						clearInterval(this.timer);
						this.timer=null;
						if(e.date){
							this.$refs.cubeView.show(e.date);
							this.canWrite=false;
						}
					}
				},50)
			}

			wx.showShareMenu({
				withShareTicket:true,
				menus:['shareAppMessage','shareTimeline']
			})
		},
		methods: {
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = 1;
				} else if (type === 'end') {
					year = year + 2;
				} else if(type === 'now'){

				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},

			bindDateChange: function(e) {
				if(!this.isInit)return;
				this.date = e.target.value;
				//cube展示内容
				this.$refs.cubeView.show(this.date);
				this.canWrite=false;
			},

			async onClickWrite(){
				if(!this.isInit)return;

			},
			//关闭展示回调
			onCloseCubeView(e){
				this.canWrite=true;
			},

            ...mapActions('server',['getHistoryList','saveHistoryInfo'])
		}
	}
</script>

<style scoped>
	.content {
		position: fixed;
		top:0;
		left: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #121212;
		width: 100%;
		height:100vh;
	}

	.date-input{
		font-size: 36rpx;
		line-height: 60upx;
		height: 60upx;
		width: 260upx;
		color: #8f8f94;
		border: 1px solid #8f8f94;
		border-radius: 30upx;
		text-align: center;

		animation: animate-input linear 2000ms infinite;
	}

	@keyframes animate-input{
		0%{ opacity: 0.3; }
		50%{
			opacity:1;
			text-shadow: 0 0 80px Red,0 0 30px orange,0 0 6px DarkRed;
		}
		100%{ opacity: 0.3; }
	}
	.btn-write{
		position: absolute;
		width: 44upx;
		height: 44upx;
		right: 50upx;
		top:50upx;
		opacity: 0.4;
		background-image: url("../../static/icon-write.png");
		background-size: 100% 100%;
	}

	@keyframes animate-input{
		0%{ opacity: 0.3; }
		50%{
			opacity:1;
			text-shadow: 0 0 80px Red,0 0 30px orange,0 0 6px DarkRed;
		}
		100%{ opacity: 0.3; }
	}

	@keyframes animate-card-in{
		0%{
			opacity: 1.0;
			transform: translate3d(-50%, -50%, -400upx) rotate3d(0, 0, 0, 90deg);
		}

		100%{
			opacity: 1.0;
			transform: translate3d(-50%, -50%, -400upx) rotate3d(0, 0, 0, 0deg);
		}
	}
</style>
