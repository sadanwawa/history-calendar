<script>
    import { mapActions } from 'vuex'
	export default {
		onLaunch: function(e) {
			console.log('App Launch')
            let scene=''
            if(e&&e.query&&e.query.scene){
                scene=e.query.scene
            }

            if(e&&e.scene===1154){
                return;
            }
            this.initAppData({publish:true,scene:scene,uscene:e.scene})
            //#ifdef MP-WEIXIN
            this.checkUpdateApp();
            //#endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},

        methods:{
            checkUpdateApp(){

                let scene=wx.getLaunchOptionsSync();
                if(scene.scene===1154){
                    return;
                }

                const updateManager = uni.getUpdateManager();
                updateManager.onCheckForUpdate(function (res) {
                    // 请求完新版本信息的回调
                    //console.log(res.hasUpdate);
                });

                updateManager.onUpdateReady(function (res) {
                    uni.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，是否重启更新？',
                        success(res) {
                            if (res.confirm) {
                                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                updateManager.applyUpdate();
                            }
                        }
                    });

                });

                updateManager.onUpdateFailed(function (res) {
                    // 新的版本下载失败
                });
            },
            ...mapActions(['initAppData'])
        }
	}
</script>

<style>
	/*每个页面公共css */



</style>
