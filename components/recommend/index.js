import {
  Recommend
} from "../../model/recommend"
// const app = getApp()
// components/recommend/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    contentHeight: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    refreshLoading: false,
    show: true,
    type: "loading",
    recommends: [],
    discList: [],
    placeholderURL: "../../image/loading.png"
  },
  attached() {
    console.log("加载数据：")
    this.getBannerList()
    this.getDiscList()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getBannerList() {
      const result = await Recommend.getBannerList()
      this.setData({
        recommends: result.data.slider
      })
    },
    async getDiscList() {
      const result = await Recommend.getDiscList()
      this.setData({
        discList: result.data.list,
        type: "end"
      })
    },
    refresh() {
      console.log("触发下拉刷新")
      this.setData({
        refreshLoading: false
      })
    },
    loadmore() {

    },
    gotoURL(data) {
      const url = data.target.dataset.url
      console.log(url)
      wx.navigateTo({
        url: `/pages/webView/webView?url=${url}`,
      })
    },
    
    selectItem(data) {
      const item = data.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/recommend-detail/index?dissid=${item.dissid}&dissname=${item.dissname}&imgurl=${encodeURIComponent(item.imgurl)}`,
      })
      // app.mutation("SET_DISC",item)
    }
  }
})