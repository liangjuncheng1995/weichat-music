// components/tab/index.js
import {
  px2rpx
} from "../../miniprogram_npm/lin-ui/utils/util"
import { state } from "../../store/state"
import { mutations } from "../../store/mutations"
const app = getApp()
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
    contentHeight: 0
  },
  pageLifetimes: {
    show() {
      this.getScrollViewHeight()
      this.watchData()
    }
  },

  attached() {
    this.getScrollViewHeight()

  },

  /**
   * 组件的方法列表
   */
  methods: {
    watchData() {
      console.log("tab组件的监听：")
      app.watchPlayList(mutations, 'playlist', Finish)
      let self = this
      function Finish(playlist) {
        self.getScrollViewHeight()
      }
    },
    getScrollViewHeight() {
      let windowHeight = px2rpx(wx.getSystemInfoSync().windowHeight) //整个窗口的高度
      let headerHeight = 88
      let headerNav = 86
      let miniPlayer = this.getMiniPlayHeight()
      this.setData({
        contentHeight: windowHeight - headerHeight - headerNav - miniPlayer
      })
    },
    getMiniPlayHeight() {
      const playlist = state.playlist ? state.playlist : []
      if(playlist.length > 0) {
        return 120
      }
      return 0
    }
  }
})