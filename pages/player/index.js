import {
  Lyric
} from "../../model/lyric"
import {
  mutations
} from "../../store/mutations"
import {
  types
} from "../../store/mutation-types"
import {
  state
} from "../../store/state"
import {
  selectPrev,
  selectPlay,
  deleteSongList,
  resetSongList,
  savePlayHistory,
  deleteFavoriteList,
  saveFavoriteList,
  insertSong
} from "../../store/actions"
import {
  playMode
} from "../../config/index"
import {
  shuffle, sumArr
} from "../../utils/utils"
import
Toast
from "../../miniprogram_npm/@vant/weapp/toast/toast.js"
import { Dom } from "../../utils/dom"

const app = getApp()
const getter = app.getters()
const audio = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songReady: false,

    currentSong: {},
    playlist: [],
    sequenceList: [],
    fullScreen: false,
    playing: false,
    mode: 0,

    currentLyric: null, //全部歌词
    currentLineNum: 0,
    playingLyric: "", //正在播放的歌词
    currentShow: "cd",
    opacity: 1,
    transitionDurationMiddleL: `300ms`,
    transitionDurationLyricList: `300ms`,
    offsetWidth: 0,
    scrollHeight: 0,
    scrollTop: 0,

    currentTime: 0,

    showDialog: false,
    gotoed: false,

    DeleteSystemMusic: false,
    contentTip: "该歌曲需要vip才能听，请打开qq音乐App搜索该歌曲",
    getLyricScroll: [],
    getMiddle_R_Height: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    
    

    if (options.c) { //分享进来 
      await this.setShareSong(options)
      this.loadingData()
      setTimeout(() => {
        // wx.navigateTo({
        //   url: '/pages/test/index',
        // })
      }, 3000)

    } else {
      this.loadingData()
    }
  },

  onReady() {},

  async setShareSong(s) {
    const song = {
      album: s.a,
      duration: s.b,
      id: Number(s.c),
      mid: s.d,
      name: s.e,
      shareAlbumId: s.f,
      singer: s.g
    }
    await insertSong(song)
  },

  async loadingData() {

    const res = app.getters()
    console.log(res)
    this.setData({
      currentIndex: res.currentIndex,
      currentSong: res.playlist[res.currentIndex] || {},
      playlist: res.playlist,
      sequenceList: res.sequenceList,
      fullScreen: res.fullScreen,
      playing: res.playing,
      mode: res.mode,
      favoriteList: res.favoriteList || []
    })
    //采用赋值的方式更改变量会更好
    this.currentIndex = res.currentIndex
    this.data.currentSong = res.playlist[res.currentIndex] || {}
    this.playlist = res.playlist
    this.sequenceList = res.sequenceList
    this.fullScreen = res.fullScreen
    this.data.playing = res.playing
    this.data.mode = res.mode
    this.favoriteList = res.favoriteList || []

    console.log("播放的状态：")
    console.log(this.data.playing)

    
    

    if (!this.data.currentSong.url) { //vip的歌曲提示
      if(state.switch === 0) {
        this.setData({
          Switch: true
        })
        return 
      }
      this.setData({
        showDialog: true
      })
      if (!this.data.fullScreen) {
        resetSongList()
        return
      }
      deleteSongList()
      return
    }
     
    if (this.data.currentLyric) {
      //切换歌曲的时候，如果已经有this.currentLyric了就停止之前
      this.data.currentLyric.stop();
    }
    await this.getLyric() //获取歌词
    
    if (state.playId !== this.data.currentSong.id) {
      //设置正在播放的歌曲id
      mutations(types.SET_PLAY_ID, this.data.currentSong.id)
      this.setPlayData()
    }
    if (this.data.playing) {
      audio.play()
    }
    if (state.fullScreen) { //mini播放器存在的话就不用执行监听了

      audio.onTimeUpdate(() => {
        this.setData({
          currentTime: audio.currentTime,
          percent: audio.currentTime / this.data.currentSong.duration
        })
      })
    }


    audio.onCanplay((res) => {
      this.setData({
        songReady: true
      })
    })
    this.setData({
      songReady: true
    })



    audio.onPlay((res) => {
      console.log("onPlay-normal")
      this.setPlay()
    })
    audio.onPause(() => {
      console.log("onPause-normal")
      this.setPause()
    })
    audio.onEnded(() => {
      this.EndEdSet()
    })
    audio.onNext(() => {
      this.next()
    })
    audio.onPrev(() => {
      this.prev()
    })
    audio.onStop(() => {
      console.log("用户删除了播放器")
      this.setData({
        DeleteSystemMusic: true
      })
      mutations(types.SET_PLAY_ID, "")
      mutations(types.SET_FULL_SCREEN, true)
      this.setPause()
    })
    audio.onWaiting(() => {
      console.log("音乐正在加载中")
    })
    audio.onError(() => {
      console.log("音乐错误")
    })

  

    this.setScrollHeight() //设置歌词的滚动区域
  },

  setPlayData() {
    audio.src = this.data.currentSong.url
    audio.title = this.data.currentSong.name || this.data.currentSong.singer || "无歌名"
    //设置播放的历史
    savePlayHistory(this.data.currentSong)
  },

  setPlay() {

    this.setData({
      playing: true
    })
    mutations(types.SET_PLAYING_STATE, true)
  },

  setPause() {
    this.setData({
      playing: false
    })
    mutations(types.SET_PLAYING_STATE, false)
  },
  EndEdSet() {
    if (state.mode === playMode.loop) {
      this.loop()
    } else {
      this.next()
    }
  },

  async next() {

    if (!this.data.songReady) {
      console.log("地址错误，下一首歌曲获取不了");
      return
    }
    console.log("下一首触发player")
    if (state.playlist.length === 1) {
      this.loop()
    } else {
      let index = state.currentIndex + 1
      if (index === state.playlist.length) { //最后一首点击下一首的时候
        index = 0
      }
      await selectPrev({
        list: state.playlist,
        index: index
      })
      this.loadingData()
    }
    this.setData({
      songReady: false,
    })

  },

  async prev() {
    if (!this.data.songReady) {
      console.log("上一首的地址错误")
      return
    }
    if (this.playlist.length === 1) {
      this.loop()
    } else {
      let index = this.data.currentIndex - 1
      if (index === -1) {
        //如果是从第一首歌曲点击了上一首，应该跳转到播放歌曲列表的最后一首
        index = this.data.playlist.length - 1
      }
      await selectPlay({
        list: this.data.playlist,
        index,
        prev: "prev"
      })
      this.loadingData()
    }
    this.setData({
      songReady: false
    })
  },

  loop() {
    audio.seek(0)
    this.setPlayData()
    audio.play()
    if (this.data.currentLyric) {
      this.data.currentLyric.seek(0)
    }
  },

  setScrollHeight() {
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('.middle').boundingClientRect()
    query.exec((res) => {
      let r = res[0][0]
      let clientHeight = r.height;
      let clientWidth = r.width;
      let ratio = 750 / clientWidth;
      let height = clientHeight * ratio;
      console.log(height)
      this.setData({
        scrollHeight: height,
      })
    })
  },

  async getLyric() {
    const resultLyric = await this.data.currentSong.getLyric()
    console.log("需要重置：")
    this.setData({
      getMiddle_R_Height: 0,
      scrollTop: 0,
      currentLineNum: 0
    })
   
    if (resultLyric != 'no lyric' && resultLyric.indexOf("此歌曲为没有填词的纯音乐，请您欣赏") === -1) {
      this.setData({
        currentLyric: new Lyric(resultLyric, this.handleLyric)
      })
      // console.log(this.data.currentLyric)
      if (state.playId !== this.data.currentSong.id) {
        this.data.currentLyric.play()
      } else { //点击同一首歌曲的时候，再进来需要跟进歌词的进度条位置
        const audioCurrentTime = audio.currentTime || 0
        console.log(audioCurrentTime)
        const percent = audioCurrentTime / this.data.currentSong.duration
        if (this.data.playing) {
          this.data.currentLyric.seek(audioCurrentTime * 1000)
        } else {
          const currentTime = this.data.currentSong.duration * percent
          this.data.currentLyric.setPlayLyric(currentTime * 1000)
        }
        //需要同步下进度条的进度
        this.setData({
          percent
        })
      }
    } else if (resultLyric.indexOf("此歌曲为没有填词的纯音乐，请您欣赏") > -1) {
      this.setData({
        playingLyric: "此歌曲为没有填词的纯音乐，请您欣赏",
        currentLyric: null
      })
      this
    } else {
      this.setData({
        currentLyric: null,
        playingLyric: "",
        currentLineNum: 0
      })
    }
  },

  async handleLyric({
    lineNum,
    txt
  }) {
    this.setData({
      currentLineNum: lineNum
    })
    this.setData({
      playingLyric: txt
    })

    if(this.data.getMiddle_R_Height === 0) {
      console.log("重新获取高度：")
      await this.getLyricScroll()
    }

    let LyricScrollHeight = sumArr(this.data.getLyricScroll, lineNum)
    if(LyricScrollHeight > Math.floor(this.data.getMiddle_R_Height / 2 - 38)) {
      let scrollSum = LyricScrollHeight - Math.floor(this.data.getMiddle_R_Height / 2 - 38)
      this.setData({
        scrollTop: scrollSum
      })
    } else {
      this.setData({
        scrollTop: 0
      })
    }
  },

  async getLyricScroll() {
    let getMiddle_R_Height = await Dom(".middle-r", this)
    let all_arr = await this.getScrollArr()
    this.setData({
      getMiddle_R_Height: getMiddle_R_Height.height,
      getLyricScroll: all_arr
    })
  },

  async getScrollArr() {
    let lines = this.data.currentLyric.lines
    let arr = []
    for (let index = 0; index < lines.length; index++) {
      let heightDom = await Dom(`.scroll-lyric-${index}`, this)
      arr.push(heightDom.height)
    }
    return arr
  },

  middleTouchStart(e) {
    const touch = e.touches[0]
    this.setData({
      touch: {
        initiated: true,
        startX: touch.pageX,
        startY: touch.pageY
      },
    })
  },
  middleTouchMove(e) {
    if (!this.data.touch.initiated) {
      return
    }
    const touch = e.touches[0]
    const detalX = touch.pageX - this.data.touch.startX
    const detalY = touch.pageY - this.data.touch.startY
    if (Math.abs(detalY) > Math.abs(detalX)) {
      return
    }
    const left = this.data.currentShow === "cd" ? 0 : wx.getSystemInfoSync().windowWidth
    const offsetWidth = Math.min(0, Math.max(-wx.getSystemInfoSync().windowWidth, left + detalX))

    this.data.touch.percent = Math.abs(offsetWidth / wx.getSystemInfoSync().windowWidth)

    this.setData({
      transitionDurationMiddleL: `300ms`,
      transitionDurationLyricList: `300ms`,
      opacity: 1 - this.data.touch.percent,
      offsetWidth
    })
  },
  middleTouchEnd(e) {
    let offsetWidth;
    let opacity;
    const touch = e.changedTouches[0];
    const detalX = touch.pageX - this.data.touch.startX
    const detalY = touch.pageY - this.data.touch.startY
    if (Math.abs(detalY) > Math.abs(detalX)) {
      return
    }
    if (this.data.currentShow === "cd") {
      //如果在cd页面，向左滑动超过10%就跳转到lyric页面
      if (this.data.touch.percent > 0.1) {
        offsetWidth = -wx.getSystemInfoSync().windowWidth;
        opacity = 0;
        this.setData({
          currentShow: "lyric"
        })
      } else {
        offsetWidth = 0;
        this.setData({
          currentShow: "cd"
        })
        opacity = 1;
      }
    } else {
      //在lyric 页面，向右滑动比例低于90%，就跳转到cd页面
      console.log("在歌词的页面")
      if (this.data.touch.percent < 0.9) {
        offsetWidth = 0;
        this.setData({
          currentShow: "cd"
        })
        opacity = 1;
      } else {
        offsetWidth = -wx.getSystemInfoSync().windowWidth;
        opacity = 0;
      }
    }

    this.setData({
      transitionDurationMiddleL: `300ms`,
      transitionDurationLyricList: `300ms`,
      offsetWidth,
      opacity
    })
    this.data.touch.initiated = false;
  },

  onProgressBarChange(e) {
    const currentTime = this.data.currentSong.duration * e.detail.percent
    audio.seek(currentTime)
    if (!this.data.playing) {
      console.log("切换进度的时候，播放的状态是停止")
      this.togglePlaying()
    }
    if (this.data.currentLyric) {
      this.data.currentLyric.seek(currentTime * 1000)
    }

  },

  togglePlaying() {
    console.log("点击了暂停")

    if (this.data.DeleteSystemMusic) { //如果删除了系统的播放器
      mutations(types.SET_PLAYING_STATE, true)
      mutations(types.SET_PLAY_ID, "") //需要把正在播放歌曲id也需要删除
      this.loadingData()
      this.setData({
        DeleteSystemMusic: false
      })
      return
    }

    if (!this.data.songReady) {
      return
    }

    const data = !this.data.playing
    mutations(types.SET_PLAYING_STATE, data)
    this.setData({
      playing: data
    })

    if (this.data.currentLyric) {
      if (getter.playing) {
        const audioCurrentTime = audio.currentTime
        this.data.currentLyric.seek(audioCurrentTime * 1000)
      } else {
        this.data.currentLyric.togglePlay()
      }
    }
    if (getter.playing) {
      audio.play()
    } else {
      audio.pause()
    }
  },

  changeMode() {
    const mode = (this.data.mode + 1) % 3
    mutations(types.SET_PLAY_MODE, mode)
    let list = null;
    if (mode === playMode.random) {
      list = shuffle(this.data.sequenceList)
    } else {
      list = this.data.sequenceList
    }
    this._resetCurrentIndex(list)
    mutations(types.SET_PLAYLIST, list)
    this.setData({
      mode,
      playlist: list
    })
    this.Toasts()
  },
  Toasts() {
    if (state.mode === playMode.sequence) {
      Toast('列表循环');
    }
    if (state.mode === playMode.loop) {
      Toast('单曲循环');
    }
    if (state.mode === playMode.random) {
      Toast('随机播放');
    }
  },
  _resetCurrentIndex(list) {
    let index = list.findIndex(item => {
      return item.id === this.data.currentSong.id
    })
    mutations(types.SET_CURRENT_INDEX, index)
    this.setData({
      currentIndex: index
    })
  },

  toggleFavorite() {
    if (this.isFavorite(this.data.currentSong)) {
      deleteFavoriteList(this.data.currentSong)
    } else {
      saveFavoriteList(this.data.currentSong)
    }
    this.setData({
      favoriteList: state.favoriteList
    })
  },

  isFavorite(song) {
    const index = this.data.favoriteList.findIndex((item) => {
      return item.id === song.id
    })
    return index > -1
  },



  //弹窗事件
  confirm() {
    // wx.navigateTo({
    //   url: '/pages/webView/webView',
    // })
    // this.setData({
    //   gotoed: true
    // })
    wx.navigateBack()
    deleteSongList()
  },
  cancel() {
    wx.navigateBack()
    deleteSongList()
  },





  onShow() {
    if (!this.data.currentSong.url && this.data.gotoed) {
      wx.showToast({
        title: '该歌曲的播放链接已经失效',
      })
      deleteSongList()
      wx.navigateBack()
    }
  },
  onUnload() {
    console.log("退出了播放器")
    console.log(this.data.currentSong)
    mutations(types.SET_FULL_SCREEN, false)
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("用户开始分享")
    console.log("当前播放的歌曲：")
    console.log(state.playlist[state.currentIndex])
    const shareObj = state.playlist[state.currentIndex]
    let p = [
      "a=" + shareObj.album,
      "b=" + shareObj.duration,
      "c=" + shareObj.id,
      "d=" + shareObj.mid,
      "e=" + shareObj.name,
      "f=" + shareObj.shareAlbumId,
      "g=" + shareObj.singer
    ].join('&')
    console.log(p)
    return {
      imageUrl: shareObj.image,
      title: shareObj.name,
      path: `/pages/player/index?${p}`
    }
  },

})