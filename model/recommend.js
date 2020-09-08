import {
  Http
} from "../utils/http"
import {
  commonParams
} from "../config/index.js"

class Recommend {
  static async getBannerList() {
    return await Http.request({
      url: "/getBannerList"
    })
  }

  static async getDiscList() {
    const data = Object.assign({}, commonParams, {
      platform: 'yqq',
      hostUin: 0,
      sin: 0,
      ein: 29,
      sortId: 5,
      needNewCode: 0,
      categoryId: 10000000,
      rnd: Math.random(),
      format: 'json'
    })
    return await Http.request({
      url: "/getDiscList",
      data,
      method: "get"
    })
  }

  static async getSongList(disstid) {
    const data = Object.assign({}, commonParams, {
      disstid,
      type: 1,
      json: 1,
      utf8: 1,
      onlysong: 0,
      platform: 'yqq',
      hostUin: 0,
      needNewCode: 0
    })
    return await Http.request({
      url: "/getSongList",
      data,
    })
  }
}

export {
  Recommend
}