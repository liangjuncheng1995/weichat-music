
import {
  mutations 
} from "../../store/mutations"
import {
  types
} from "../../store/mutation-types"
import { state } from "../../store/state"

const app = getApp()
const getter = app.getters()
const audio = wx.getBackgroundAudioManager()
// components/mini-player/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    fullScreen: false,
    currentIndex: -1
  },

  pageLifetimes: {
    show: function() {
      console.log("页面被展示了")
      this.loadData()
    }
  },

  observers: {
    'percent': function(percent) {
      const data = Math.floor(percent * 100)
      if(data === 0 && this.data.currentSong.id!= state.playId ) {
        console.log("已经播完一首")
        this.loadData()
      } 
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadData() {
      const res = app.getters()
      const fullScreen = res.fullScreen
      const currentSong = res.playlist[res.currentIndex]
      const currentIndex = res.currentIndex
      const playing = res.playing
      this.setData({
        fullScreen,
        currentSong,
        playing,
        currentIndex
      })
      if(res.currentIndex === -1) {
        audio.pause()
        return
      }
      this.OberservePer()
    },
    OberservePer() {
      if(this.data.currentSong) {
        this.setData({
          percent: audio.currentTime / this.data.currentSong.duration
        })
      }
      audio.onTimeUpdate(() => {
        this.setData({
          percent: audio.currentTime / this.data.currentSong.duration
        })
      })
    },
    togglePlaying() {
      const data = !this.data.playing
      mutations(types.SET_PLAYING_STATE, data)
      this.setData({
        playing: data
      })
      if(getter.playing) {
        audio.play()
      } else {
        audio.pause()
      }
    },
    open() {
      wx.navigateTo({
        url: '/pages/player/index',
      })
      mutations(types.SET_FULL_SCREEN, true)
    }
  }
})
