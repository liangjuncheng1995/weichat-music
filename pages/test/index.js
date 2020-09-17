// pages/test/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    percent: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let bgMusic = wx.getBackgroundAudioManager();
    bgMusic.title = "测试";
    // bgMusic.desc = "描述";
    // bgMusic.singer = "阿龙";
    // bgMusic.coverImgUrl = "http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000";
    bgMusic.src = "http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400002Xq0zz0jdhXD.m4a?guid=6065637766&vkey=873A57B7DBFFB8B91B45A7286ACE4C8938F6491E13291F1DF970E630EB40FDC30F0094824FF6547843C8BE55FA7713AF56468968433C4E59&uin=0&fromtag=38";
   

    bgMusic.onTimeUpdate(() => {
      console.log('------')
      this.setData({
        time: bgMusic.currentTime
      })
    })
    // bgMusic.play();

    setInterval(() => {
      var d = this.data.percent + 0.1
      this.setData({
        percent: d
      })
      console.log(this.data.percent)
    },1000)

  },

  playMusic: function () {
    
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