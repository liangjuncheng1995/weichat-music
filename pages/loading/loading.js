import {
  Switch 
} from "../../model/switch"
import { SwitchType } from "../../core/enums"
import { state } from "../../store/state"

// pages/loading/loading.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const result = await Switch.getSwitchType() 
    if(result.switch === SwitchType.OPEN) {
      state.switch = SwitchType.OPEN
      wx.redirectTo({
        url: '/pages/index/index',
      })
    } else {
      state.switch = SwitchType.CLOSE
      wx.redirectTo({
        url: '/pages/home/home',
      })
    }
  }
})