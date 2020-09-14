import {
  commonParams, ERR_OK
} from "../config/index.js"
import {
  Http
} from "../utils/http"

import {
  Base64
} from "../utils/base64"

class Song {
  constructor({
    id,
    mid,
    singer,
    name,
    album,
    duration,
    image,
    url
  }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  async getLyric() {
    if (this.lyric) {
      return this.lyric
    }
    const result = await this.GetLyric(this.mid)
    if(result.retcode === ERR_OK) {
      this.lyric = Base64.decode(result.lyric)
      return this.lyric
    } else {
      return 'no lyric'
    }
  }

  async GetLyric(mid) {
    const data = Object.assign({}, commonParams, {
      songmid: mid,
      platform: 'yqq',
      hostUin: 0,
      needNewCode: 0,
      categoryId: 10000000,
      pcachetime: +new Date(),
      format: 'json'
    })
    return await Http.request({
      url: "/getLyric",
      data
    })
  }


  static async getPlayUrl(mid) {
    let mids = []
    let types = []
    if (typeof mid === "object") {
      mids = mid
    } else {
      mids.push(mid)
    }
    types.push(0)

    const urlMid = this.genUrlMid(mids, types)
    const data = Object.assign({}, commonParams, {
      g_tk: 5381,
      format: 'json',
      platform: 'h5',
      needNewCode: 1,
      uin: 0,
      urlMid
    })

    return await Http.request({
      url: "/getPlayUrl",
      data: {
        comm: data,
        url_mid: urlMid
      },
      method: "post"
    })

  }

  static genUrlMid(mids, types) {
    const guid = this.getUid()
    return {
      module: 'vkey.GetVkeyServer',
      method: "CgiGetVkey",
      param: {
        guid,
        songmid: mids,
        songtype: types,
        uin: '0',
        loginflag: 0,
        platform: '23'
      }
    }
  }

  static getUid() {
    let _uid = ''

    if (_uid) {
      return _uid
    }
    if (!_uid) {
      const t = (new Date).getUTCMilliseconds()
      _uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10
    }
    return _uid
  }



}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterString(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
  })
}

function filterString(singer) { //组装合唱的歌手名
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

export {
  Song
}