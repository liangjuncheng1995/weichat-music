import {
  selectPlay, randomPlay
} from "../../store/actions"
const app = getApp()

// components/music-list/index.js
const RESERVED_HEIGHT = 80
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bgImage: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    }
  },

  observers: {
    "bgImage": function (data) {
      if (this.properties.bgImage != "") {
        this._getBgHeight()
      }
    },
    "songs": function (data) {
      if (this.properties.songs.length > 0) {
        this.setData({
          type: "end"
        })
      }
    }
  },

  lifetimes: {
    attached() {

    },
    ready() {
      // this._getBgHeight()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    top: 0,
    type: "loading",
    show: true,
    translateY: 0
  },


  /**
   * 组件的方法列表
   */
  methods: {

    selectItem(e) {
      selectPlay({
        list: this.properties.songs,
        index: e.detail.index
      })
    },

    random() {
      randomPlay({
        list: this.properties.songs
      })
    }, 

    _getBgHeight() {
      var query = wx.createSelectorQuery().in(this);
      query.select('.bg-image').boundingClientRect()
      query.exec((res) => {
        let clientHeight = res[0].height;
        let clientWidth = res[0].width;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio;
        this.setData({
          top: height,
          minTranslateY: -height + RESERVED_HEIGHT,
          imageHeight: height
        })
      })
    },
    scroll(e) {
      this.setData({
        scrollY: -e.detail.scrollTop
      })
      this._scrollY()
    },
    _scrollY() {
      let newY = this.data.scrollY
      let translateY = Math.max(this.data.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0

      this.setData({
        translateY,
        top: this.data.imageHeight + translateY
      })

    }
  }
})