const { state } = require("../../store/state")
const { SwitchType } = require("../../core/enums")
const { Switch } = require("../../model/switch")

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Switch: false
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
      const result = await Switch.getSwitchType() 
      if(result.switch === SwitchType.OPEN) {
        state.switch = SwitchType.OPEN
      } else {
        state.switch = SwitchType.CLOSE
      }
      if(state.switch === SwitchType.OPEN) {
        this.setData({
          Switch: true
        })
      } else {
        this.setData({
          Switch: false
        })
      }
    }
  },

  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})