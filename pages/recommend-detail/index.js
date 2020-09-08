import {
  Recommend
} from "../../model/recommend"
import {
  createSong
} from "../../model/song"


// pages/recommend-detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs: [],
    title: '',
    bgImage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getSongList(options.dissid)
    this.setTitleImage(options)
  },

  setTitleImage(options) {
    this.setData({
      title: options.dissname,
      bgImage: decodeURIComponent(options.imgurl) 
    })
  },

  async _getSongList(dissid) {
    const result = await Recommend.getSongList(dissid)
    this.setData({
      songs: this._normalizeSongs(result.cdlist[0].songlist)
    })
  },

  _normalizeSongs(list) {
    let ret = []
    list.forEach(musicData => {
      if(musicData.songid && musicData.albumid) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }


})