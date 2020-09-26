import {
  Dom
} from "../../utils/dom"

// components/list-view/index.js
const ANCHOR_HEIGHT = 18 //每一个字母的高度
const TITLE_HEIGHT = 30 //每一个title的高度

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    contentHeight: Number,
    show: Boolean,
    data: {
      type: Array,
      default: []
    }
  },

  observers: {
    "data": function (data) {
      this.shortcutList()
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    "scrollY": function (newY) {
      //监听滚动条的数据
      const listHeight = this.data.listHeight
      //当滚动到顶部， 则终止进程
      if (newY > 0) {
        this.setData({
          currentIndex: 0
        })
        return
      }

      //在中间的滚动的时候
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]

        if (-newY >= height1 && -newY < height2) {
          this.setData({
            currentIndex: i,
            diff: height2 + newY
          })
          return
        }
      }

      //当滚动到底部， 且-newY 大于最后一个元素的上限
      this.setData({
        currentIndex: listHeight.length - 2
      })
    },
    diff: function (newVal) {
      let fixedTop = newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0

      if (this.data.fixedTop === fixedTop) {
        //避免在fixedTop 为 0 的时候更改transform的属性
        return
      }
      this.setData({
        fixedTop
      })
    }

  },

  lifetimes: {
    created: function () {}
  },

  pageLifetimes: {
    show: function () {

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    placeholderURL: "../../image/loading.png",
    shortcutList: [],
    scrollY: -1,
    currentIndex: 0,
    scrollTop: 0,
    touch: {
      y1: '',
      y2: '',
      anchorIndex: 0
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async _calculateHeight() {
      this.data.listHeight = []
      let listHeight = []
      let height = 0
      const list = this.properties.data

      listHeight.push(height)
      this.setData({
        listHeight
      })

      list.forEach(async (item, index) => {
        //计算1 12 123 1234 。。。高度的集合
        let obj = await Dom(`.list-group-${index}`, this)
        height += obj.height
        listHeight.push(height)
        this.setData({
          listHeight
        })
      })

    },

    shortcutList() {
      let result = []
      let data = this.properties.data
      for (var i = 0; i < data.length; i++) {
        result.push(data[i].title.substr(0, 1))
      }
      this.setData({
        shortcutList: result
      })
    },
    scroll(e) {
      console.log(this.data.currentIndex)
      this.setData({
        scrollY: -e.detail.scrollTop
      })
    },

    onShortcutTouchStart(e) {
      let anchorIndex = e.target.dataset.index
      let firstTouch = e.touches[0]
    
      this.data.touch.y1 = firstTouch.pageY
      this.data.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },

    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      this.data.touch.y2 = firstTouch.pageY
      
      //计算滚动了多少个索引
      let delta = ((this.data.touch.y2 - this.data.touch.y1) / ANCHOR_HEIGHT) | 0; //或0 向下取整，和Math.floor一样
      let anchorIndex = parseInt(this.data.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },

    _scrollTo(index) {
      if(!index && index !== 0) {
        return 
      }

      if(index < 0) {
        //滑动超过顶部
        index = 0
      } else if(index > this.data.listHeight - 2) {
        //滑动超过底部
        //看不懂，应该是点击字母表末尾的一些位置
        index = this.data.listHeight.length - 2
      }
      this.setData({
        scrollY:  - this.data.listHeight[index],
      })
      this.setData({
        scrollTop: - this.data.scrollY
      })
    },
    selectItem(e) {
      this.triggerEvent("select", e.currentTarget.dataset.item)
    }
  }
})