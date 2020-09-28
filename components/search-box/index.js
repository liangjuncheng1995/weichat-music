// components/search-box/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    query: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clear() {
      this.setData({
        query: ""
      })
      this.triggerEvent("query", this.data.query)
    },

    setQuery(query) {
      this.setData({
        query
      })
      this.triggerEvent("query", this.data.query)
    },

    confirm() {
      this.triggerEvent("query", this.data.query)
    }
  }
})
