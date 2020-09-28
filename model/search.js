import {
  commonParams
} from "../config/index"
import {
  Http
} from "../utils/http"

class Search {
  static async gethotkey() {
    const data = Object.assign({}, commonParams, {
      uin: 0,
      needNewCode: 1,
      platform: 'h5'
    })
    return await Http.request({
      url: "/gethotkey",
      data,
      method: "get"
    })
  }

  static async search(query, page, zhida) {
    const data = Object.assign({}, commonParams, {
      w: query,
      p: page,
      catZhida: zhida ? 1 : 0,
      zhidaqu: 1,
      t: 0,
      flag: 1,
      ie: 'utf-8',
      sem: 1,
      aggr: 0,
      perpage: 20,
      n: 20,
      remoteplace: 'txt.mqq.all',
      uid: 0,
      needNewCode: 1,
      platform: 'h5'
    })

    return await Http.request({
      url: "/search",
      data,
      method: "get"
    })
  }
}

export {
  Search
}