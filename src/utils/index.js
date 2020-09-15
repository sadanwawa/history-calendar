// 格式化时间
function formatDate (dateInput, format) {
  let date = new Date(dateInput)

  let o = {
    'M+': date.getMonth() + 1, // month
    'd+': date.getDate(), // day
    'h+': date.getHours(), // hour
    'm+': date.getMinutes(), // minute
    's+': date.getSeconds(), // second
    'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    'S': date.getMilliseconds() // millisecond
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}


function getShowTime (dayTime) { //处理今天昨天等时间信息
  let now=new Date();
  let target=new Date(dayTime)
  if(now.getFullYear()===target.getFullYear()){ //今年
      if(now.getMonth()===target.getMonth()&&now.getDate()===target.getDate()){//今天
         return '今天 '+ formatDate(dayTime,'hh:mm:ss')
         //  return formatDate(dayTime,'MM-dd hh:mm:ss')
      }else{
        return formatDate(dayTime,'MM-dd hh:mm:ss')
      }
  }else{
    return formatDate(dayTime,'yyyy-MM-dd hh:mm:ss')

  }
}

function friendlyDate(timestamp) {
    var formats = {
        'year': '%n% 年前',
        'month': '%n% 月前',
        'day': '%n% 天前',
        'hour': '%n% 小时前',
        'minute': '%n% 分钟前',
        'second': '%n% 秒前',
    };

    var now = Date.now();
    var seconds = Math.floor((now - timestamp) / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var months = Math.floor(days / 30);
    var years = Math.floor(months / 12);

    var diffType = '';
    var diffValue = 0;
    if (years > 0) {
        diffType = 'year';
        diffValue = years;
    } else {
        if (months > 0) {
            diffType = 'month';
            diffValue = months;
        } else {
            if (days > 0) {
                diffType = 'day';
                diffValue = days;
            } else {
                if (hours > 0) {
                    diffType = 'hour';
                    diffValue = hours;
                } else {
                    if (minutes > 0) {
                        diffType = 'minute';
                        diffValue = minutes;
                    } else {
                        diffType = 'second';
                        diffValue = seconds === 0 ? (seconds = 1) : seconds;
                    }
                }
            }
        }
    }
    return formats[diffType].replace('%n%', diffValue);
}

//防抖函数
function throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
        gapTime = 1500
    }

    let _lastTime = null

    // 返回新的函数
    return function () {
        let _nowTime = + new Date()
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn.apply(this, arguments)   //将this和参数传给原函数
            _lastTime = _nowTime
        }
    }
}

function formatSize(size) {
  let sizeStr='';
  if(size<1024){ // b字节
    sizeStr=size+'b'
  }else if(size>=1024&&size<1024*1024){ // 1kb-1M
    sizeStr=(size/1024.0).toFixed(3)+'kb'
  }else if(size>=1024*1024&&size<1024*1024*1024){ // 1M-1G
    sizeStr=(size/(1024.0*1024)).toFixed(3)+'M'
  }else{ // 1G+
    sizeStr=(size/(1024.0*1024*1024)).toFixed(3)+'G'
  }
  return sizeStr;
}

//截取头部字符串
function getHeadStr(str,num) {
    if(str.length===0)return ''
  let target=str.replace(/(^\s*)/g,""); //去掉左边空格
  target = target.replace(/[\r\n]/g,"");//去掉回车换行
  if(target.length>num){
    target=target.substring(0,num);
  }
  return target;
}

//
function trim(str){ //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

//取得文件格式
function getFileFormat(url) {
  let arr=url.slice('.');
  return arr[arr.length-1];
}


// 获取static目录文件的实际路径
function getStaticPath (path) {
  return __webpack_public_path__ + 'static/' + path // eslint-disable-line
}

// 获取url参数
function getSearch (name, url) {
  let href = url.replace(/#.*/, '')

  let search = /\?.*/.exec(href)
  search = (search && search[0]) || ''

  let data = {}
  search.replace(/([^?=&]+)(=([^&]*))?/g, ($0, $1, $2, $3) => {
    data[decodeURIComponent($1)] = decodeURIComponent($3)
  })
  return name ? data[name] : data
}

// 设置url参数
function setSearch (name, value, url) {
  let href = url.replace(/[?#].*/, '')

  let data = getSearch(null, url)
  data[name] = value

  let search = '?' + toSearchParams(data)

  let hash = /#.*/.exec(url)
  hash = (hash && hash[0]) || ''

  return href + search + hash
}

// 将对象转换为Search参数
function toSearchParams (params) {
  let result = []
  for (let i in params) {
    if (params.hasOwnProperty(i)) {
      result.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]))
    }
  }
  return result.join('&')
}

//洗牌算法 高效
function RandomVec(vec) {
    for(var i = 0;i < vec.length;i++) {
        var rand = Math.floor(vec.length * Math.random());
        var temp = vec[i];
        vec[i] = vec[rand];
        vec[rand] = temp;
    }
    for(var i = 0;i < vec.length;i++) {
        var rand = Math.floor(vec.length * Math.random());
        var temp = vec[i];
        vec[i] = vec[rand];
        vec[rand] = temp;
    }//交换了2*nums次 平均约2%的对象还在原来的位置
}

//把字符串打乱顺序
function RandomStr(str) {
    let charArr=str.split('');
    RandomVec(charArr);
    let target=charArr.join('')
    return target;
}

//进制转换；
//10进制 转为26进制
function num10ToNum26(num){
    let chars='nyhowftmkbavdpcieusrjqglzx'
    let charArr=chars.split('');
    let targets=[];
    while (num>0){
        let yn= num%26;
        targets.push(yn);
        num=(num-yn)/26;
    }
    targets.reverse();
    let target='';
    for(let i=0;i<targets.length;i++){
        target+=charArr[targets[i]];
    }
    //console.log('targets:'+JSON.stringify(targets));
    return target;
}

function num26TNum10(str){
    let chars='nyhowftmkbavdpcieusrjqglzx'
    let charArr=chars.split('');

    let strs=str.split('');
    let total=0;
    for(let i=0;i<strs.length;i++){
        let num=0;
        for(let j=0;j<charArr.length;j++){
            if(charArr[j]===strs[i]){
                num=j;
                break;
            }
        }
        let dd=1;
        for(let m=0;m<strs.length-i-1;m++){
            dd=dd*26;
        }
        //取得num
        total+=(num*dd);
    }
    return total;
}

//取得字符串长度
function getStrLen(str) {
    if (str == null) return 0;
    if (typeof str != "string"){
        str += "";
    }
    return str.replace(/[^\x00-\xff]/g,"01").length;
}


//n*n矩阵 斜向数据索引index 映射到行列位置号
function getRLByIndex(n,index){
    let r=0;
    let l=0;
    let m=0;
    for(let i=1;i<2*n;i++){
        if(i>n){
            for(let j=0;j<2*n-i;j++){
                m++;
                r=j+(i-n);
                l=n-j-1;
                if(m===index){
                    return [r,l]
                }
            }
        }else{
            for(let j=0;j<i;j++){
                m++;
                r=j;
                l=i-r-1;
                if(m===index){
                    return [r,l];
                }
            }
        }
    }
    return []
}


//根据两点坐标,取得直线方程参数
function getLineParamsByTwoPoints(pointA,pointB){
    var x1 = pointA[0];
var y1 = pointA[1];
var x2 = pointB[0];
var y2 = pointB[1];

if(x1==x2){return []};

var k = (y2 - y1) / (x2 - x1);
var b = y1 - x1 * k;
return [k,b];
}


export {
  getLineParamsByTwoPoints,
  num26TNum10,
  num10ToNum26,
  toSearchParams,
  formatDate,
    trim,
  getShowTime,
  friendlyDate,
  formatSize,
  getHeadStr,
  getStaticPath,
  getSearch,
  getStrLen,
  setSearch,
}
