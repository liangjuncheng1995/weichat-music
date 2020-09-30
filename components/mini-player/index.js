import {
  mutations
} from "../../store/mutations"
import {
  types
} from "../../store/mutation-types"
import {
  state
} from "../../store/state"
import { deleteSongList, savePlayHistory } from "../../store/actions"

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
    currentIndex: -1,
    DeleteSystemMusic: false,
    bottom: 0
  },

  pageLifetimes: {
    show: function () {
      console.log("页面被展示了")
      this.loadData()
      this.watchData()
    }
  },

  observers: {
    'percent': function (percent) {
      const data = Math.floor(percent * 100)
      if (data === 0 && this.data.currentSong.id != state.playId) {
        console.log("已经播完一首")
        this.loadData()
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    watchData() {
      app.watchPlayId(mutations, "playId", Finish);
      let self = this

      function Finish(playId) {
        self._Finish(playId)
      }
    },
    _Finish(playId) {
      if (!playId) {
        console.log("执行回调函数：")
        this.loadData()
      }
    },
    loadData(e) {
      const res = app.getters()
      const fullScreen = res.fullScreen
      const currentSong = res.currentIndex > -1 ?  res.playlist[res.currentIndex] : ""
      const currentIndex = res.currentIndex
      const playing = res.playing
      const favoriteList = res.favoriteList
      this.setData({
        fullScreen,
        currentSong,
        playing,
        currentIndex,
        favoriteList
      })
      if (res.currentIndex === -1 || res.playId === "") {
        audio.pause()
        this.hidePlaylist()
        return
      }
      if((e && e.detail) || this.data.currentSong.id !== res.playId) {//在mini播放列表点击了歌曲
        //设置正在播放的歌曲id
        this.setPlayData()
      }
      
      this.OberservePer()
    },

    OberservePer() {
      if (!this.data.currentSong) {
        return
      }
      this.setData({
        percent: audio.currentTime / this.data.currentSong.duration
      })
      audio.onTimeUpdate(() => {
        this.setData({
          percent: audio.currentTime / this.data.currentSong.duration
        })
      })
      audio.onStop(() => {
        console.log("在迷你播放器的组件销毁了系统的播放器")
        this.setData({
          DeleteSystemMusic: true
        })
        this.setPause()
      })
      audio.onPlay(() => {
        console.log("onPlay-mini")
        this.setPlay()
      })
      audio.onPause(() => {
        console.log("onPause-mini")
        this.setPause()
      })

    },
    setPlay() {
      audio.play()
      this.setData({
        playing: true
      })
      mutations(types.SET_PLAYING_STATE, true)
      mutations(types.SET_PLAY_ID, this.data.currentSong.id)
    },
    setPause() {
      audio.pause()
      this.setData({
        playing: false,
      })
      mutations(types.SET_PLAYING_STATE, false)
      if (this.data.DeleteSystemMusic) {
        mutations(types.SET_PLAY_ID, '')
      }
    },
    togglePlaying() {
      if (!state.playId) {
        this.setPlayData()
        this.OberservePer()
      }
      const data = !this.data.playing
      mutations(types.SET_PLAYING_STATE, data)
      this.setData({
        playing: data
      })
      if (getter.playing) {
        this.setPlay()
      } else {
        this.setPause()
      }
    },
    setPlayData() {
      if(this.data.currentSong.url) {
        audio.src = this.data.currentSong.url
        audio.title = this.data.currentSong.name || this.data.currentSong.singer || "无歌名"
        mutations(types.SET_PLAY_ID, this.data.currentSong.id)
        //设置播放的历史
        savePlayHistory(this.data.currentSong)
      
      } else {
        console.log("跳转：161")
        wx.navigateTo({
          url: '/pages/player/index',
        })
      }
    },
    open() {
      wx.navigateTo({
        url: '/pages/player/index',
      })
      mutations(types.SET_FULL_SCREEN, true)
    },
    showPlaylist() {
      let playlistComponent = this.selectComponent("#playlist")
      playlistComponent.show()
    },
    hidePlaylist() {
      let playlistComponent = this.selectComponent("#playlist")
      playlistComponent.hide()
    }
  }
})