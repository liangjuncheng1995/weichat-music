import {
  Rank
} from "../../model/rank"
import {
  ERR_OK
} from "../../config/index"
import {
  createSong
} from "../../model/song"
import {
  mutations
} from "../../store/mutations"
import {
  types
} from "../../store/mutation-types"

// pages/top-list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs: [],
    title: '',
    bgImage: '',
    rank: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getRankDetail(options.topid)
    this.setTitleImage(options)
  },

  async _getRankDetail(topid) {
    const result = await Rank.getRankDetail(topid)
    if (result.code == ERR_OK) {
      this.setData({
        songs: this._normalizeSongs(result.songlist)
      })
    }
  },

  _normalizeSongs(list) {
    let ret = []
    list.forEach(item => {
      const musicData = item.data;
      if (musicData.songid && musicData.albumid) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  },

  setTitleImage(options) {
    this.setData({
      title: options.dissname,
      bgImage: decodeURIComponent(options.imgurl)
    })
  },

  setPlayList() {
    console.log("开始设置排行榜歌曲仓库的数据")
    if (this.data.songs.length > 0) {
      mutations(types.SET_PLAYLIST, this.data.songs)
    }
  },




  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})