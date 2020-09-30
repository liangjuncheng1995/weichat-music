import {
  state
} from "../../store/state"
import {
  insertSong,
  deleteSearchHistory,
  saveSearchHistory
} from "../../store/actions"
import {
  Song
} from "../../model/song"
import {
  px2rpx
} from "../../miniprogram_npm/lin-ui/utils/util"
import {
  Dom
} from "../../utils/dom"
import { mutations } from "../../store/mutations"
import { types } from "../../store/mutation-types"

// components/add-song/index.js
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
    show: false,
    switches: [{
        name: "最近播放"
      },
      {
        name: "搜索历史"
      }
    ],
    currentIndex: 0,
    query: "",
    searchHistory: [],
    playHistory: [],
    contentHeight: 0
  },

  observers: {
    "show": function(show) {
      if(show) {
        this.loadData()
      }
    }
  },

  pageLifetimes: {
    show() {
      this.loadData()
      this.setScrollHeight()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadData() {
      this.setData({
        playHistory: state.playHistory,
        searchHistory: state.searchHistory
      })
    },
    async setScrollHeight() {
      let windowHeight = px2rpx(wx.getSystemInfoSync().windowHeight) //整个窗口的高度
      let headerHeight = 88
      let searchBoxContainer = 80 + 80
      this.setData({
        contentHeight: windowHeight - headerHeight - searchBoxContainer
      })
    },
    show() {
      this.setData({
        show: true
      })
    },
    hide() {
      this.setData({
        show: false
      })
    },
    switchItem(e) {
      const index = e.detail
      this.setData({
        currentIndex: index
      })
    },
    async selectSong(e) {
      const index = e.detail.index
      if(index === 0) {
        return
      }
      const song = e.detail.item
      await insertSong(new Song(song))
      this.showMessage()
      //如果添加了add-song组件的列表歌曲，需要展示mini播放器
      mutations(types.SET_FULL_SCREEN, false)
      this.loadData()
    },

    onQueryChange(e) {
      this.setData({
        query: e.detail
      })
    },

    addQueryhistory(e) {
      const query = e.detail
      this.selectComponent("#search-Box").setQuery(query)
    },

    deleteSearchHistory(e) {
      const query = e.detail
      deleteSearchHistory(query)
      this.setSearchHistory()
    },

    setSearchHistory() {
      this.setData({
        searchHistory: state.searchHistory
      })
    },

    selectSuggest() {
      this.saveSearch()
      this.showMessage()
      //如果添加了add-song组件的列表歌曲，需要展示mini播放器
      mutations(types.SET_FULL_SCREEN, false)
      this.loadData()
    },

    saveSearch() {
      saveSearchHistory(this.data.query)
    },

    showMessage() {
      wx.lin.showMessage({
        content: '1首歌曲已经添加播放列表'
      })
    }

  }
})