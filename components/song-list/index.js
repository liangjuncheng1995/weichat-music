// components/song-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songs: {
      type: Array,
      default: []
    },
    rank: {
      type: Boolean,
      default: false
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
      this.triggerEvent('select', {
        item: e.currentTarget.dataset.item,
        index: e.currentTarget.dataset.index
      })
    }
  }
})
