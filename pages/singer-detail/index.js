import {
  Singer
} from "../../model/singer"
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

// pages/singer-detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs: [],
    title: '',
    bgImage: '',
    singerId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options.singerId) {
      wx.navigateTo({
        url: '/pages/index/index',
      })
      return
    }
    this.setData({
      singerId: options.singerId
    })
    this._getDetail(options.singerId)
    this.setTitleImage(options)
  },

  setTitleImage(options) {
    this.setData({
      title: options.singername,
      bgImage: decodeURIComponent(options.avatar)
    })
  },

  async _getDetail(singerId) {
   
    const result = await Singer.getSingerDetail(singerId)
    if (result.code === ERR_OK) {
      this.setData({
        songs: this._normalizeSongs(result.data.list)
      })
      console.log(this.data.songs)
    }
  },

  _normalizeSongs(list) {
    let ret = []
    list.forEach(item => {
      let musicData = item.musicData
      if (musicData.songid && musicData.albumid) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  },

  setPlayList() {
    console.log("开始设置歌手仓库的数据")
    if (this.data.songs.length > 0) {
      mutations(types.SET_PLAYLIST, this.data.songs)
    }
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: `/pages/singer-detail/index?singerId=${this.data.singerId}&singername=${this.data.title}&avatar=${encodeURIComponent(this.data.bgImage)}`,
      title: this.data.title,
      imageUrl: this.data.bgImage
    }
  }
})