import {getStaticPath} from "./index";
//分享数据配置 (默认)
let shareConfigDefault = {
    title: '历史日历',
    desc: '历史上的今天都发生了什么？',
    imageUrl:'cloud://public-hav6k.7075-public-hav6k-1303062327/static/share/share-1.jpg',//getStaticPath('img-share-card.jpg'),
    path: '/pages/index/index?backflow=true', // 路径，传递参数到指定页面。
}
let shareConfig=Object.assign({},shareConfigDefault);

function updateShareConfig(config){
    shareConfig=Object.assign(shareConfig,config)
}

export {
    shareConfig,
    shareConfigDefault,
    updateShareConfig,
}
