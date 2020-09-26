import {
  commonParams
} from "../config/index"
import {
  Http
} from "../utils/http";

class Singer {
  constructor({
    id,
    name
  }) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }


  static async getSingerList() {
    const data = Object.assign({}, commonParams, {
      channel: 'singer',
      page: 'list',
      key: 'all_all_all',
      pagesize: 100,
      pagenum: 1,
      hostUin: 0,
      needNewCode: 0,
      platform: 'yqq'
    })
    return await Http.request({
      url: "/getSingerList",
      data,
      method: "get"
    })
  }

  static async getSingerDetail(singerId) {
    const data = Object.assign({}, commonParams, {
      hostUin: 0,
      needNewCode: 0,
      platform: 'yqq',
      order: 'listen',
      begin: 0,
      num: 80,
      songstatus: 1,
      singermid: singerId
    })
    return await Http.request({
      url: "/getSingerDetail",
      data,
      method: "get"
    })
  }
}

export {
  Singer
}