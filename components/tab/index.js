// components/tab/index.js
import {
  px2rpx
} from "../../miniprogram_npm/lin-ui/utils/util"

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

  attached() {
    let windowHeight = px2rpx(wx.getSystemInfoSync().windowHeight) //整个窗口的高度
    let headerHeight = 88
    let headerNav = 86
    this.setData({
      contentHeight: windowHeight - headerHeight - headerNav
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
