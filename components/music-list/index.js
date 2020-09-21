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

    async selectItem(e) {
      console.log(this.properties.songs)
      await selectPlay({
        index: e.detail.index
      })

      const param = this._combinaParam(this.properties.songs, e.detail.index)
      //分享测试
      // wx.navigateTo({
      //   url: `/pages/player/index?${param}`,
      // })
      //正常点击跳转
      wx.navigateTo({
        url: `/pages/player/index`,
      })
    },

    random() {
      randomPlay()
      wx.navigateTo({
        url: `/pages/player/index`,
      })
    }, 

    _combinaParam(songs, index) {
      let that = songs[index]
      const p = [
        "id=" + that.id,
        "mid=" + that.mid,
        "singer=" + that.singer,
        "name=" + that.name,
        "album=" + that.album,
        "duration=" + that.duration,
        "image=" + encodeURIComponent(that.image),
        "url=" +  encodeURIComponent(that.url)
      ].join('&')
      return p
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