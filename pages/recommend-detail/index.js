import {
  Recommend
} from "../../model/recommend"
import {
  createSong
} from "../../model/song"
import { mutations } from "../../store/mutations"
import { types } from "../../store/mutation-types"


// pages/recommend-detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs: [],
    title: '',
    bgImage: '',
    bottom: 0,
    dissid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dissid: options.dissid
    })
    this._getSongList(options.dissid)
    this.setTitleImage(options)
  },

  onShow() {
    // if(this.data.songs.length > 0) { //数据重新入库
    //   mutations(types.SET_PLAYLIST, this.data.songs)
    // }
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
    // mutations(types.SET_PLAYLIST, this.data.songs)//保存数据到仓库
  },

  setPlayList() {
    console.log("开始设置仓库的数据")
    if(this.data.songs.length > 0) {
      mutations(types.SET_PLAYLIST, this.data.songs)//保存数据到仓库
    }
  },

  _normalizeSongs(list) {
    let ret = []
    list.forEach(musicData => {
      if(musicData.songid && musicData.albumid) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  },
  getBottom(e) {
    console.log(e)
    this.setData({
      bottom: e.detail
    })
  },

  onShareAppMessage: function() {
    return {
      path: `/pages/recommend-detail/index?dissid=${this.data.dissid}&dissname=${this.data.title}&imgurl=${encodeURIComponent(this.data.bgImage)}`,
      title: this.data.title,
      imageUrl: this.data.bgImage
    }
  }

})