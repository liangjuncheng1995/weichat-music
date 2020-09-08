import {
  Switch 
} from "../../model/switch"
import { SwitchType } from "../../core/enums"

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
      wx.redirectTo({
        url: '/pages/index/index',
      })
    } else {
      wx.redirectTo({
        url: '/pages/home/home',
      })
    }
  }
})