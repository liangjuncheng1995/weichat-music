import { state } from "../../store/state"
import { undatePlayUrl, insertSong, randomPlay } from "../../store/actions"
import { Song } from "../../model/song"
import { mutations } from "../../store/mutations"
import { types } from "../../store/mutation-types"
import { watchPlayList } from "../../store/watch"
import { SwitchType } from "../../core/enums"

const app = getApp()

// pages/user-center/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    switches: [{
        name: "我喜欢的"
      },
      {
        name: "我最近听的"
      }
    ],
    favoriteList: [],
    playHistory: [],
    bottom: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if(state.switch === SwitchType.OPEN) {
      this.setData({
        Switch: true
      })
    } else {
      this.setData({
        Switch: false
      })
    }

    await undatePlayUrl()
    this.setData({
      favoriteList: state.favoriteList,
      playHistory: 
      state.playHistory
    })
    // this.watchData()
    this.NoWwatchgetScrollViewBottom()
  },

  onShow() {
    this.setData({
      favoriteList: state.favoriteList,
      playHistory: state.playHistory
    })
    this.watchData()
    // this.NoWwatchgetScrollViewBottom()
  },

  watchData() {
    console.log("开始监听user-center：playlist")
    // app.watchPlayList(mutations, 'playlist', Finish)
    watchPlayList(mutations, 'playlist', Finish)
    let self = this
    function Finish(playlist) {
      self.getScrollViewBottom(playlist)
    }
  },

  getScrollViewBottom(playlist) {
    if(!playlist.length) {
      this.setData({
        bottom: 0
      })
    } else {
      this.setData({
        bottom: 120
      })
    }
  },
  NoWwatchgetScrollViewBottom() {
    console.log(state)
    if(state.sequenceList === undefined) {
      
    }
    console.log(state.sequenceList)
    if(!state.sequenceList.length) {
      this.setData({
        bottom: 0
      })
    } else {
      this.setData({
        bottom: 120
      })
    }
  },
  switchItem(e) {
    const index = e.detail
    this.setData({
      currentIndex: index
    })
  },

  async selectSong(e) {
    console.log(e)
    const song = e.detail.item
    await insertSong(new Song(song))
    wx.navigateTo({
      url: '/pages/player/index'
    })
  },
  async random() {
    let list = this.data.currentIndex === 0 ? this.data.favoriteList : this.data.playHistory
    if(list.length === 0) {
      return 
    }
    list = list.map(song => {
      return new Song(song)
    })
    await randomPlay(list)
    wx.navigateTo({
      url: '/pages/player/index'
    })
  },
  gotoHome() {
    wx.navigateTo({
      url: '/pages/home/home',
    })
  }
})