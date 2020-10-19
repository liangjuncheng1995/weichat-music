const config = {
  apiBaseUrl: "http://192.168.1.40:6001/recordApi" //可更换自己的服务器api
}

const options = {
  param: "jsonpCallback"
}

const commonParams = {
  g_tk: 570906732,
	inCharset: 'utf-8',
	outCharset: 'utf-8',
	notice: 0,
	format: 'jsonp'
}

const ERR_OK = 0


// 定义枚举 0 列表播放 1 单曲循环 2 随机播放
const playMode = {
  sequence: 0,
  loop: 1,
  random: 2
}

// const netWorkurl = "https://y.qq.com"
const netWorkurl = ""



export {
  config,
  options,
  ERR_OK,
  commonParams,
  playMode,
  netWorkurl
}