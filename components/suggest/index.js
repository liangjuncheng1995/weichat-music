import {
  Search
} from "../../model/search"
import {
  ERR_OK
} from "../../config/index";
import {
  createSong
} from "../../model/song";
import { Singer } from "../../model/singer";
import { insertSong } from "../../store/actions";
const perpage = 20;
const TYPE_SINGER = "singer"
// components/suggest/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    },
    contentHeight: Number
  },

  observers: {
    "query": function (query) {
      this.search()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    page: 1,
    result: [],
    hasMore: true,
    showFlag: true,
    suggetOffsetHeight: 0,
    err_play: '0', //songmid为0的歌曲，不能播放
    show: true,
    endtext: "已经到底了"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async search() {
      this.setData({
        page: 1,
        hasMore: true,
        showFlag: true,
        result: []
      })
      const result = await Search.search(this.data.query, this.data.page, this.properties.showSinger, perpage)
      if (result.code === ERR_OK) {
        console.log(result)
        this.setData({
          result: this._genResult(result.data)
        })
        this._checkMore(result.data)
      }
    },

    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid && this.data.page == 1) {
        ret.push({
          ...data.zhida,
          ...{
            type: TYPE_SINGER
          }
        })
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },

    _normalizeSongs(list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },

    _checkMore(data) {
      const song = data.song
      if (!song.list.length || song.curnum + song.curpage * perpage > song.totalnum) {
        console.log("已经是最后一页了")
        //没有数据返回，或者已经拿到最后一页的数据
        this.setData({
          hasMore: false,
          showFlag: false,
          endtext: "已经到底了"
        })
      }
      if(!this.data.hasMore && !this.data.result.length) {
        this.setData({
          endtext: "没有想关搜索"
        })
      }
    },

    scroll(e) {
      console.log("到底部了")
      if (this.data.showFlag) {
        this.searchMore()
      }
    },

    async searchMore() {
      if (!this.data.hasMore) {
        return
      }
      this.setData({
        showFlag: false,
        page: this.data.page + 1
      })
      const result = await Search.search(this.data.query, this.data.page, this.properties.showSinger, perpage)
      if(result.code === ERR_OK) {
        this.setData({
          result: this.data.result.concat(this._genResult(result.data)),
          showFlag: true
        })
        this._checkMore(result.data)
      }
    }, 

    async selectItem(e) {
      const item = e.currentTarget.dataset.item
      if(item.mid === this.data.err_play) {
        return
      }
      if(item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        wx.navigateTo({
          url: `/pages/singer-detail/index?singerId=${singer.id}&singername=${singer.name}&avatar=${encodeURIComponent(singer.avatar)}`,
        })
      } else {
        await insertSong(item)
        wx.navigateTo({
          url: '/pages/player/index',
        })
      }
      this.triggerEvent("select")
    }

  }
})