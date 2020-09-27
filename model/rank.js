import {
  commonParams
} from "../config/index"
import {
  Http
} from "../utils/http"

class Rank {
  static async getRankList() {
    const data = Object.assign({}, commonParams, {
      uin: 0,
      playform: 'h5',
      needNewCode: 1
    })
    return await Http.request({
      url: "/getRankList",
      data,
      method: "get"
    })
  }

  static async getRankDetail(topid) {
    const data = Object.assign({}, commonParams, {
      topid,
      platform: 'h5',
      needNewCode: 1,
      page: 'detail',
      type: 'top',
      tpl: 3
    })

    return await Http.request({
      url: "/getRankDetail",
      data,
      method: "get"
    })
  }

}

export {
  Rank
}