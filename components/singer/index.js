import {
  Singer
} from "../../model/singer"
import {
  ERR_OK
} from "../../config/index"
const HOT_NAME = "热门"
const HOT_SINGER_LEN = 10

// components/singer/index.js
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

  pageLifetimes: {
    show() {
      // this._getSingerList()
    }
  },
  observers: {
    "activity": function (data) {
      if (data && !this.data.activityKey) {
        this.setData({
          activityKey: true
        })
        this._getSingerList()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activityKey: false,
    show: true,
    loadtype: "loading"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async _getSingerList() {
      const result = await Singer.getSingerList()
      if (result.code == ERR_OK) {
        setTimeout(() => {
          this.setData({
            singers: this._normalizeSinger(result.data.list),
            show: false,
          })
        }, 500)
      }
    },

    selectSinger(e) {
      console.log(e)
      wx.navigateTo({
        url: `/pages/singer-detail/index?singerId=${e.detail.id}&singername=${e.detail.name}&avatar=${encodeURIComponent(e.detail.avatar)}`,
      })
    },

    _normalizeSinger(list) {
      //定义一个map对象
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      //遍历传进来的数据
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          //筛选前10名的歌手
          map.hot.items.push(
            //调用singer类，获取对应得到图片，名字对象的集合
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          )
        }
        const key = item.Findex //获取对应歌手的首个字母
        if (!map[key]) {
          //设置map对象的属性，以返回数据的Findex作为map对象的key值，这个key值与 hot属性是同一级别
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        )
      })
      //处理有序的列表
      let hot = []
      let ret = []
      //再一次遍历map
      for (let key in map) {
        let val = map[key]; //遍历每一个对象的value值
        if (val.title.match(/[a-aA-Z]/)) {
          //筛选字母的歌手
          ret.push(val)
        } else if (val.title == HOT_NAME) {
          //前10位热门的歌手
          hot.push(val)
        }
      }

      ret.sort((a, b) => {
        //字母按顺序排序
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })

      return hot.concat(ret) //把热门的列表加到头部
    }
  }
})