# 历史日历（history-calendar）
历史上的今天发生了什么？

## 项目立项
一直喜欢历史，有一天灵光一闪，想到如果能够方便查看每一天历史上发生过的重大事件，一定会是一款很有意思的小工具；  

简单调研了一下，发现了"历史上的今天"这样的在线服务，于是这一想法很长时间扔到了备选项目列表里；   

 
直到最近决定参加微信小程序云开发挑战赛，因为决定参加比赛已经是9月份，项目不能太大，怕赶工来不及...反复斟酌后，又把这一个项目拎了出来，决定做一款小产品，不一定完全的创新，能采用新技术形式，提升阅读体验也是好的。  

以上就是这个项目的由来～

## 体验二维码  

![历史日历-历史上的今天](https://3bbys.com/minapp/hiscalendar/img-code.jpg)


## uni环境安装  
[uni官方文档](https://uniapp.dcloud.io/quickstart?id=_2-通过vue-cli命令行)
```
npm install -g @vue/cli
```

## 项目安装  
（请[云端部署](https://github.com/sadanwawa/history-calendar-cloud)完成后，再下载客户端项目）  

项目克隆到本地，然后命令行窗口执行安装命令

```
yarn install
```
## 项目配置

1.替换src/manifest.json中的appid为自己项目appid；  
2.云服务准备就绪


## 编译开发

```
yarn run dev:mp-weixin
```

## 编译发布

```
yarn run build:mp-weixin
```

## 项目待优化
1.录入的历史数据不够丰富，特别是配图缺失问题；  
2.滑动翻页交互可优化，旋转跟随手指移动效果未完成；  
3.ui设计优化；
