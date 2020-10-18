import {
  Search
} from "../../model/search"
import {
  ERR_OK
} from "../../config/index"
import {
  Dom
} from "../../utils/dom"
import {
  saveSearchHistory,
  clearSearchHistory,
  deleteSearchHistory
} from "../../store/actions"
import {
  state
} from "../../store/state"

// components/search/index.js
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

  /**
   * 组件的初始数据
   */
  data: {
    hotKey: [],
    searchHistory: [],
    query: '',
    showDialog: false,
    activityKey: false,
  },
  pageLifetimes: {
    show() {
      // this._getHotkey()
      // this.getsearchBoxHeight()
      this.setSearchHistory()
    }
  },

  observers: {
    'activity': function (data) {
      if (data && !this.data.activityKey) {
        this.setData({
          activityKey: true
        })
        this._getHotkey()
        this.getsearchBoxHeight()
        this.setSearchHistory()
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setSearchHistory() {
      console.log("刷新缓存")
      this.setData({
        searchHistory: state.searchHistory
      })
    },

    async _getHotkey() {
      const result = await Search.gethotkey()
      if (result.code === ERR_OK) {
        this.setData({
          hotKey: result.data.hotkey.slice(0, 20)
        })
      }
    },

    async getsearchBoxHeight() {
      const searchBoxDom = await Dom(".search-box-container", this)
      console.log(searchBoxDom)
      console.log(this.properties.contentHeight)
      this.setData({
        searchBoxDomHeight: searchBoxDom.height * 4
      })
    },

    onQueryChange(e) {
      this.setData({
        query: e.detail
      })
    },

    addQuery(e) {
      const query = e.currentTarget.dataset.item.k || e.currentTarget.dataset.item
      this.selectComponent("#searchBox").setQuery(query)
    },

    addQueryhistory(e) {
      const query = e.detail
      this.selectComponent("#searchBox").setQuery(query)
    },

    deleteSearchHistory(e) {
      console.log(e)
      const query = e.detail
      deleteSearchHistory(query)
      this.setSearchHistory()
    },

    showConfirm() {
      this.setData({
        showDialog: true
      })
    },

    confirm() {
      clearSearchHistory()
      this.setSearchHistory()
    },

    saveSearch() {
      // saveSearchHistory(this.data.query)
      console.log("开始保存搜索的历史")
      saveSearchHistory(this.data.query)
    }
  }
})