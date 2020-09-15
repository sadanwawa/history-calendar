import server from './serverStores'

const DIALOG_CONFIG = 'DIALOG_CONFIG'
const SYSTEM_INFO = 'SYSTEM_INFO'
const SHARE_DATA = 'SHARE_DATA'
const TOAST_CONFIG = 'TOAST_CONFIG'// 打开提示弹窗
const AUTH_USERINFO_STATE = 'AUTH_USERINFO_STATE' //更新是否授权userinfo状态
const IS_INIT = 'IS_INIT' //应用初始化完成

const stores = {
    modules: {
        server
    },
    // 全局状态管理
    state: {
        dialogConfig: {},//弹窗
        toastConfig: {},
        systemInfo: null,// 初始化时取到的系统信息
        shareData: null,//分享数据

        authUserInfoState: 0, //是否已经授权获取用户信息 0未知 1授权 2未授权
        authWritePhotosAlbumState: 0, //是否已经授权保存图片到相册 0未知 1授权 2未授权
        isInit: false,//初始化应用
    },
    mutations: {
        [DIALOG_CONFIG](state, payload) {
            state.dialogConfig = payload
        },
        [TOAST_CONFIG](state, payload) {
            state.toastConfig = payload
        },
        [SYSTEM_INFO](state, payload) {
            state.systemInfo = payload
        },

        [SHARE_DATA](state, payload) {
            state.shareData = payload
        },

        [AUTH_USERINFO_STATE](state, payload) {
            state.authUserInfoState = payload
        },
        [IS_INIT](state, payload) {
            state.isInit = payload
        }
    },
    // 通过getter 整合来源数据
    getters: {
        //是否已经成功登陆
        isLogin(state, getters) {
            if (state.authUserInfoState === 1 && state.server.userInfo) {
                return true;
            }
            return false;
        },
    },
    actions: {

        //应用启动时 初始化
        async initAppData({state, commit, dispatch}, payload) {
            let envId = '';

            //初始化云服务  添加云服务异常处理
            //#ifdef MP-WEIXIN
            envId = (payload && payload.publish) ? 'public-hav6k' : '';
            wx.cloud.init({
                env: envId
            })
            //#endif

            let extra = {
                scene: payload.scene,
                uscene: payload.uscene
            }
            await dispatch('initSystemInfo')//获取系统信息
            await dispatch('login')//登陆
            await dispatch('updateAuthUserInfoState', true);//更新当前授权状态
            await dispatch('server/loginCloud', extra);//返回用户信息
            if (!state.server.userInfo) {
                uni.showToast({title: '服务异常', icon: 'none'})
                return;
            }
            commit(IS_INIT, true); //初始化完成
            console.log('init')
        },

        /**
         * 打开弹窗
         * @param {String|Object} payload 支持字符串或者对象参数
         *  String参数：弹窗名称
         *  Object参数：{
         *    dialog: 弹窗名称
         *    isScroll: 弹窗是否可滚动
         *    isForce: 弹窗是否强制展示（点击弹窗周围空白处不可关闭）
         *    params: 其他弹窗参数
         *  }
         */
        openDialog({state: {dialogConfig}, commit}, payload) {
            let config = Object.assign({}, dialogConfig, {
                [payload.dialog || payload]: payload
            })
            commit(DIALOG_CONFIG, config)
        },

        /**
         * 关闭弹窗
         * @param {String|Object} payload 支持字符串或者对象参数
         *  String参数：弹窗名称
         *  Object参数：{
         *    dialog: 弹窗名称
         *  }
         */
        closeDialog({state: {dialogConfig}, commit}, payload) {
            let config = Object.assign({}, dialogConfig, {
                [payload.dialog || payload]: null
            })
            commit(DIALOG_CONFIG, config)
        },

        /*
         * 初始化取得系统信息
         */
        async initSystemInfo({state, commit}) {
            let info = await uni.getSystemInfoSync();
            //console.log('systemInfo:'+JSON.stringify(info.system));
            commit(SYSTEM_INFO, info);
        },

        //授权后调用 登录可以取得code 通过code去开发服换取openid sesson_key等
        login({state, commit}) {
            uni.login({
                success: function (res) {
                    //console.log('登陆：'+JSON.stringify(res));
                }
            })
        },

        //更新用户当前信息及用户信息授权状态
        async updateAuthUserInfoState({state, commit, dispatch}, init) {
            let detail = await dispatch('getUserInfo');
            // {"errMsg":"getUserInfo:fail 系统错误，错误码：-12006,auth deny"}
            if (detail && detail.errMsg && detail.errMsg.indexOf('-12006') != -1) {//未授权 需要授权
                commit(AUTH_USERINFO_STATE, 2)
            } else if (detail && detail.errMsg === 'getUserInfo:ok') { //已知取得授权 "errMsg":"getUserInfo:ok"
                commit(AUTH_USERINFO_STATE, 1)
                dispatch('server/updateUserInfo', detail.userInfo);//更新本地userInfo数据

                //同步服务器数据
                if (!init) {
                    dispatch('server/loginCloud');
                }

            } else {
                //网络异常
            }
        },

        saveShareData({state, commit}, payLoad) {
            commit(SHARE_DATA, payLoad)
        },

        //取得用户信息
        async getUserInfo({state, commit}) {
            return new Promise((resolve, reject) => {
                if (state.authUserInfoState === 1) {//已经授权
                    uni.getUserInfo({
                        withCredentials: true,
                        success: (res) => {
                            resolve(res);
                        },
                        fail: (res) => {
                            resolve(res);
                        }
                    })
                } else if (state.authUserInfoState === 2) {//未授权
                    resolve({errMsg: '-12006 auth deny'});
                } else { //未知是否授权
                    uni.getSetting(
                        {
                            success: function (res) {
                                if (res.authSetting['scope.userInfo']) {//已经授权了
                                    uni.getUserInfo({
                                        withCredentials: true,
                                        success: function (res) {
                                            //获取用户信息
                                            resolve(res); //正常返回用户信息
                                        },
                                        fail: function (res) {
                                            resolve(res); //网络异常
                                        }
                                    })

                                } else {
                                    //未授权
                                    resolve({errMsg: '-12006 auth deny'});
                                }
                            },
                            fail: function (res) {
                                resolve(res); //网络异常
                            }
                        }
                    )

                }
            })
        },

        //成功授权 取得用户信息
        authUserInfoSuccess({state, commit, dispatch}, detail) {
            commit(AUTH_USERINFO_STATE, 1)
            //更新userInfo数据
            dispatch('server/updateUserInfo', detail.userInfo || {});
            //同步服务器数据
            dispatch('server/loginCloud');
        },

        //订阅消息提醒
        async requestWxSubMessage({state, commit}, payload) {
            return new Promise((resolve, reject) => {
                wx.requestSubscribeMessage({
                    tmplIds: payload,
                    success: (res) => {
                        if (res.errMsg === 'requestSubscribeMessage:ok') {
                            resolve({code: 200, mess: '订阅消息', data: res})
                        } else {
                            resolve({code: 300, mess: '订阅异常', data: res})
                        }
                    },
                    fail: (err) => { //设置关闭了主消息按钮
                        resolve({code: 400, mess: '订阅消息关闭', data: err})
                    },
                    complete: (res) => {
                    }
                })

            })
        },

        //订阅消息提醒
        async requestQQSubMessage({state, commit}, payload) {
            return new Promise((resolve, reject) => {
                qq.subscribeAppMsg(
                    {
                        subscribe: true,
                        success: (res) => {
                            resolve({code: 200, mess: '订阅消息', data: res})
                        },
                        fail: (res) => {
                            resolve({code: 400, mess: '订阅消息', data: res})
                        }
                    }
                )

            })
        },

    }
}

export default stores
