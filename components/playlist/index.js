import {
  state
} from "../../store/state"
import {
  mutations
} from "../../store/mutations"
import {
  types
} from "../../store/mutation-types"
import {
  playMode
} from "../../config/index.js"
import {
  shuffle
} from "../../utils/utils"
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast.js"
import {
  checkoutAudioUrl,
  deleteSongList,
  deleteSong,
  deleteFavoriteList,
  saveFavoriteList
} from "../../store/actions"
const app = getApp()

// components/playlist/index.js
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
    show: false,
    mode: 0,
    sequenceList: [],
    scrollTop: 0,
    showDialog: false,
    deleteOperation: false
  },

  pageLifetimes: {
    show: function () {
      console.log("迷你播放列表被展示了")
      this.watchData()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show() {
      this.setData({
        sequenceList: state.sequenceList,
        playlist: state.playlist,
        currentSong: state.playlist[state.currentIndex] || {},
        favoriteList: state.favoriteList || [],
        mode: state.mode
      })
      this.setData({
        show: true
      })
      this.scrollToCurrent(this.data.currentSong)
    },
    update() {
      this.setData({
        sequenceList: state.sequenceList,
        playlist: state.playlist,
        currentSong: state.playlist[state.currentIndex] || {},
        favoriteList: state.favoriteList || [],
        mode: state.mode
      })
      if (this.data.deleteOperation) { //如果进行了删除歌曲的操作，则不定位列表
        this.setData({
          deleteOperation: false
        })
        return
      }
      this.scrollToCurrent(this.data.currentSong)
      this.triggerEvent("loadData")
    },
    hide() {
      this.setData({
        show: false
      })
    },
    scrollToCurrent(current) {
      const index = this.data.sequenceList.findIndex(song => {
        return current.id === song.id
      })
      let unit = 40;
      this.setData({
        scrollTop: unit * index
      })
    },
    changeMode() {
      const mode = (this.data.mode + 1) % 3
      mutations(types.SET_PLAY_MODE, mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.data.sequenceList)
      } else {
        list = this.data.sequenceList
      }
      mutations(types.SET_PLAYLIST, list)
      this._resetCurrentIndex(list)
      this.setData({
        mode,
        playlist: list
      })
      this.Toasts()
    },
    Toasts() {
      if (state.mode === playMode.sequence) {
        Toast({
          message: "列表循环",
          context: this,
          selector: "#van-toast"
        });
      }
      if (state.mode === playMode.loop) {
        Toast({
          message: "单曲循环",
          context: this,
          selector: "#van-toast"
        });
      }
      if (state.mode === playMode.random) {
        Toast({
          message: "随机播放",
          context: this,
          selector: "#van-toast"
        });
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
    watchData() {
      app.watchCurrentIndex(mutations, "currentIndex", FinishPlaylist);
      let self = this

      function FinishPlaylist(currentIndex) {
        console.log("play-list组件")
        self.update()
      }
    },

    async selectItem(e) {
      let item = e.currentTarget.dataset.item
      let index = e.currentTarget.dataset.index
      console.log(this.data.mode)
      if (this.data.mode === playMode.random) {
        index = this.data.playlist.findIndex(song => {
          return song.id === item.id
        })
      }
      await checkoutAudioUrl(index)
      mutations(types.SET_CURRENT_INDEX, index)
      mutations(types.SET_PLAYING_STATE, true)
      // this.triggerEvent("loadData")
    },

    showConfirm() {
      this.setData({
        showDialog: true
      })
    },

    confirm() {
      deleteSongList()
      this.setData({
        showDialog: false
      })
      this.triggerEvent("loadData")
    },

    async deleteOne(e) {
      console.log("点击了删除歌曲")
      this.setData({
        deleteOperation: true
      })
      let item = e.currentTarget.dataset.item
      await deleteSong(item)


      this.triggerEvent("loadData")
    },

    toggleFavorite(e) {
      const id = e.currentTarget.dataset.item.id
      const item = this.FindItem(id)
      if (this.isFavorite(item)) {
        deleteFavoriteList(item)
      } else {
        saveFavoriteList(item)
      }
      this.setData({
        favoriteList: state.favoriteList
      })
    },

    FindItem(id) {
      function findIndex(list, id) {
        return list.findIndex((item) => {
          return item.id === id
        })
      }
      let index = findIndex(state.playlist, id)
      return state.playlist[index]
    },

    isFavorite(song) {
      const index = state.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },

    addSong() {
      this.selectComponent("#addsong").show()
    }
  }
})