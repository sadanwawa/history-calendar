/**
 * Created by ycma on 2020/09/06.
 * 项目业务 全局数据和方法封装
 */
// 弹层组件名称
const ModuleNames = {

}

//本地存储字段
const LocalStorages={

}

//全局事件
const GlobalEvents={

}

//通讯码枚举
const ServerCode={
    SUCCESS: 200,//通讯正常
    NO_NET: 400,//网络异常
    ERR_DATA: 500,//数据异常 >=500
}

//用户的权限类型
const AuthLevel={
    NORMAL:0,//普通用户
    MANAGER:1,//管理员
    VIP:2,//vip用户
    BAD:3,//黑名单用户
}

export {
    AuthLevel,
    GlobalEvents,
}
