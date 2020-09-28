// components/search-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    searches: {
      type: Array,
      default: []
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
    selectItem(e) {
      const item = e.currentTarget.dataset.item
      this.triggerEvent("select", item)
    },
    deleteOne(e) {
      const item = e.currentTarget.dataset.item
      this.triggerEvent("delete", item)
    }
  }
})