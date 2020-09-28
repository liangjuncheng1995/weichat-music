class Cache {
  static SEARCH_KEY = "__search__"
  static SEARCH_LENGTH = 15

  static insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare) //寻找搜索key的索引
    if (index === 0) {
      return
    }

    if (index > 0) { //删除已经搜索过的索引
      arr.splice(index, 1)
    }
    arr.unshift(val)
    if (maxLen && arr.length > maxLen) { //如果搜索历史的个数达到了上限，则删除最后一个搜索历史
      arr.pop()
    }
  }

  static deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
      arr.splice(index, 1)
    }
  }

  static saveSearch(query) {
    console.log(query)
    let searches = this._getSearchKeywords()
    this.insertArray(searches, query, (item) => {
      return item === query
    }, Cache.SEARCH_LENGTH)
    this._setSearchKeywords(searches)
    return searches
  }

  static _getSearchKeywords() {
    const key = wx.getStorageSync(Cache.SEARCH_KEY)
    if (!key) {
      wx.setStorageSync(Cache.SEARCH_KEY, [])
      return []
    }
    return key
  }

  static _setSearchKeywords(searches) {
    wx.setStorageSync(Cache.SEARCH_KEY, searches)
  }

  static clearSearch() {
    wx.setStorageSync(Cache.SEARCH_KEY, [])
    return []
  }

  static deleteSearch(query) {
    let searches = this._getSearchKeywords()
    this.deleteFromArray(searches, (item) => {
      return item === query
    })
    this._setSearchKeywords(searches)
    return searches
  }






}

export {
  Cache
}