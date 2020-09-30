// components/switches/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    switches: {
      type: Array,
      default: []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchItem(e) {
      const index = e.currentTarget.dataset.index
      this.triggerEvent("switch", index)
    }
  }
})
