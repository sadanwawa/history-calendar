const USER_INFO = 'USER_INFO'
const GLOBAL_INFO = 'GLOBAL_INFO'//全局配置

const stores = {
    namespaced: true,
    state: {
        userInfo: null, //用户基本数据
        globalInfo: null,//全局数据配置
    },
    mutations: {
        [USER_INFO](state, payload) {
            if (state.userInfo) {
                state.userInfo = Object.assign({}, state.userInfo, payload)
            } else {
                state.userInfo = payload;
            }
        },

        [GLOBAL_INFO](state, payload) {
            //console.log('globalInfo:'+JSON.stringify(payload))
            if (state.globalInfo) {
                state.globalInfo = Object.assign({}, state.globalInfo, payload)
            } else {
                state.globalInfo = payload;
            }
        },

    },
    getters: {},
    actions: {

        /**
         * 微信授权后  传用户openid 登录 返回用户详情信息
         *
         * 数据库无用户信息时，返回用户不存在；
         */
        async loginCloud({state, rootState, commit, dispatch}, payload) {
            //console.log('loginCloud:')
            let params = {};
            if (!payload) {
                params = {info: state.userInfo};
            } else {
                let from = payload.scene;
                let uscene = payload.uscene;
                params = {info: state.userInfo, from: from, uscene: uscene};
            }

            let result = null;

            let func = null;
            //#ifdef MP-WEIXIN
            func = wx.cloud.callFunction;
            //#endif

            //#ifdef MP-QQ
            func = qq.cloud.callFunction;
            //#endif

            await func({
                name: 'loginCloud',
                data: params,
            }).then((res) => {
                if (res.result.code === 200) {
                    commit(USER_INFO, res.result.data.userInfo);
                    commit(GLOBAL_INFO, res.result.data.globalInfo);
                    result = {code: 200, msg: '登陆成功', data: res.result.data};
                } else {
                    result = res.result;
                }
            }).catch((err) => {
                result = {code: 400, msg: '网络异常', data: err}
            })

            //console.log('loginCloud:'+JSON.stringify(result));
            return result;
        },

        //更新用户信息
        updateUserInfo({state, commit, dispatch}, detail) {
            //console.log('detail:'+JSON.stringify(detail));
            commit(USER_INFO, detail);
        },
        /*
        * 取得当前日期的历史事件列表
        *
        * day
        * numMax
        * stampTime
        *
        *
        * */
        async getHistoryList({state, commit, dispatch}, payload) {
            let params = Object.assign({}, {
                openid: state.userInfo.openid,
                userId: state.userInfo.uid
            }, payload)
            let result = null;
            await wx.cloud.callFunction({
                name: 'getHistoryList',
                data: params,
            }).then((res) => {
                result = res.result;
            }).catch((err) => {
                result = {code: 400, msg: '网络异常', data: err}
            })
            return result;
        },


        async getHistoryInfo({state, commit, dispatch}, payload) {
            let params = Object.assign({}, {
                openid: state.userInfo.openid,
                userId: state.userInfo.uid
            }, payload)
            let result = null;
            await wx.cloud.callFunction({
                name: 'getHistoryInfo',
                data: params,
            }).then((res) => {
                result = res.result;
            }).catch((err) => {
                result = {code: 400, msg: '网络异常', data: err}
            })
            return result;
        },

        async saveHistoryInfo({state, commit, dispatch}, payload) {
            let params = Object.assign({}, {
                openid: state.userInfo.openid,
                userId: state.userInfo.uid
            }, payload)
            let result = null;
            await wx.cloud.callFunction({
                name: 'saveHistoryInfo',
                data: params,
            }).then((res) => {
                result = res.result;
            }).catch((err) => {
                result = {code: 400, msg: '网络异常', data: err}
            })
            return result;
        },
        /*
          提交检测文本图片合规性
          参数：
          txts:['他妈的','b'],
          imgs:[ArryBuffer,ArrayBuffer],
          返回:
          result={
              code:200,
              msg:'检测完成',
              data:{
                  txts:[0],
                  imgs:[]
              }
          }
          if(result.data.txts.length===0&&result.data.txts.imgs.length===0){
              //检查通过
          }
       */
        async contentSecurityCheck({commit, dispatch}, payload) {
            let txts = payload.txts;
            let imgs = payload.imgs;

            let result = null;

            let func = null;
            //#ifdef MP-WEIXIN
            func = wx.cloud.callFunction;
            //#endif

            //#ifdef MP-QQ
            func = qq.cloud.callFunction;
            //#endif

            await func({
                name: 'contentSecurityCheck',
                data: {
                    txts: txts,
                    imgs: imgs
                },
            }).then((res) => {
                // console.log('---'+JSON.stringify(res));
                if (res.result.code === 200) {
                    result = {code: 200, msg: '成功检测', data: res.result.data}
                } else {
                    result = {code: 300, msg: '未完成检测', data: res.result.data} //= {code:300,msg:'收藏列表获取异常',data:res.result.data}
                }
            }).catch((err) => {
                result = {code: 400, msg: '网络异常', data: err}
            })
            return result;
        },

        /*
           识别图片中的二维码/小程序码
           openapi.img.scanQRCode 云函数中调用 返回识别到的数据；
           参数：等待识别的图片列表
                imgs:[]
           返回：识别结果；
                {
                    code:200,
                    msg:'',
                    data:{
                        imgs:[
                            {},
                            {}
                        ]
                    }
                }
        */
        async readQRCode({state, commit}, payload) {
            let imgs = payload.imgs;

            let result = null;

            let func = null;
            //#ifdef MP-WEIXIN
            func = wx.cloud.callFunction;
            //#endif

            //#ifdef MP-QQ
            func = qq.cloud.callFunction;
            //#endif

            await func({
                name: 'readQRCode',
                data: {
                    imgs: imgs
                },
            }).then((res) => {
                //console.log('检测结果：'+JSON.stringify(res));
                if (res.result.code === 200) {
                    result = {code: 200, msg: '成功识别', data: res.result.data}
                } else {
                    result = {code: 300, msg: '未完成识别', data: res.result.data}
                }
            }).catch((err) => {
                result = {code: 400, msg: '网络异常', data: err}
            })
            return result;
        },


        /*
         取得用户信息接口
      */
        async getUserInfo({state, commit, dispatch}, payload) {
            let params = Object.assign({}, payload, {
                openid: state.userInfo.openid
            })
            let result = null;

            let func = null;
            //#ifdef MP-WEIXIN
            func = wx.cloud.callFunction;
            //#endif

            //#ifdef MP-QQ
            func = qq.cloud.callFunction;
            //#endif

            await func({
                name: 'getUserInfo',
                data: params,
            }).then((res) => {
                result = res.result;
            }).catch((err) => {
                result = {code: 400, msg: '网络异常', data: err}
            })
            return result;
        },


        /*
         取得小程序码fileID接口
        */
        async getQRImage({state, commit, dispatch}, payload) {
            let params = Object.assign({
                openid: state.userInfo.openid,
                userId: state.userInfo.uid
            }, payload)
            let result = null;

            let func = null;
            //#ifdef MP-WEIXIN
            func = wx.cloud.callFunction;
            //#endif

            //#ifdef MP-QQ
            func = qq.cloud.callFunction;
            //#endif

            await func({
                name: 'getQRImage',
                data: params,
            }).then((res) => {
                result = res.result;
            }).catch((err) => {
                result = {code: 400, msg: '网络异常', data: err}
            })
            return result;
        },
    }
}

export default stores
