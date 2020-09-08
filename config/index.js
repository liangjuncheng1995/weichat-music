const config = {
  apiBaseUrl: "http://192.168.1.40:6001/recordApi"
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

export {
  config,
  options,
  ERR_OK,
  commonParams
}