// components/welcome/index.js
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
    show: false
  },

  pageLifetimes: {
    show: function() {
      setTimeout(() => {
        this.setData({
          show: true
        })
      }, 3000)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotoHome() {
      wx.navigateTo({
        url: '/pages/home/home',
      })
    }
  }
})
