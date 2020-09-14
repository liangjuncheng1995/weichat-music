// components/progress-bar/index.js
const progressBtnWidth = 16
import {
  Dom
} from "../../utils/dom"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    percent: {
      type: Number,
      default: 0
    }
  },

  observers: {
    "percent": async function (newPercent) {
      if (newPercent >= 0 && !this.data.initiated) {
        const progressBar = await Dom('.progress-bar', this)
        const barWidth = progressBar.width - progressBtnWidth
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  },

  lifetimes: {
    attached: async function() {
      // const res = await Dom(".progress-bar", this)
      // console.log(res)
      // const query = wx.createSelectorQuery().in(this)
      // query.selectAll('.progress-bar').boundingClientRect()
      // query.exec((res) => {
      //   console.log(res)
      // })
    }
  },
  

  /**
   * 组件的初始数据
   */
  data: {
    offsetWidth: 0,
    touch: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async progressClick(e) {
      const rect = await Dom(".progress-bar", this)
      const offsetWidth = e.touches[0].pageX - rect.left
      this._offset(offsetWidth)
      this._triggerPercent()
    },

    async _triggerPercent() {
      const progressBar = await Dom(".progress-bar", this)
      const progress = await Dom("#progress", this)
      const barWidth = progressBar.width - progressBtnWidth
      const percent = progress.width / barWidth
      this.triggerEvent("percentChange",{
        percent
      })
    },

    async progressTouchStart(e) {
      this.data.touch.initiated = true
      this.data.touch.startX = e.touches[0].pageX
      const progress = await Dom('#progress', this)
      this.data.touch.left = progress.width
    },

    async progressTouchMove(e) {
      if(!this.data.touch.initiated) {
        return
      }
      const detalX = e.touches[0].pageX - this.data.touch.startX
      const progressBar = await Dom(".progress-bar", this)
      const offsetWidth = Math.min(progressBar.width - progressBtnWidth, Math.max(0, this.data.touch.left + detalX))
      this._offset(offsetWidth)
    },

    progressTouchEnd() {
      this.data.touch.initiated = false
      this._triggerPercent()
    },

    _offset(offsetWidth) {
      this.setData({
        offsetWidth
      })
    }
  }
})