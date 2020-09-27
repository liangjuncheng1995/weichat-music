import {
  Rank
} from "../../model/rank"
import {
  ERR_OK
} from "../../config/index"

// components/rank/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    contentHeight: Number,
    activity: {
      type: Boolean,
      default: false
    }
  },

  observers: {
    'activity': function (data) {
      if (data && !this.data.activityKey) {
        this.setData({
          activityKey: true
        })
        this._getRankList()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    placeholderURL: "../../image/loading.png",
    activityKey: false,
    show: true,
    loadtype: "loading",
    topList: [],
    type: "loading",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async _getRankList() {
      const result = await Rank.getRankList()
      if (result.code === ERR_OK) {
        this.setData({
          topList: result.data.topList,
          type: "end"
        })
      }
    },
    selectItem(data) {
      const item = data.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/top-list/index?topid=${item.id}&toptile=${item.topTitle}&imgurl=${encodeURIComponent(item.picUrl)}`,
      })
    }
  }
})