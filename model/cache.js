import { Song } from "./song"

class Cache {
  static SEARCH_KEY = "__search__"
  static SEARCH_LENGTH = 15

  static PLAY_KEY = "__play__"
  static PLAY_MAX_LENGTH = 200

  static FAVORITE_KEY = "__favorite__"
  static FAVORITE_MAX_LENGTH = 200

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

  static _getFavoriteListKeywords() {
    const key = wx.getStorageSync(Cache.FAVORITE_KEY)
    if (!key) {
      wx.setStorageSync(Cache.FAVORITE_KEY, [])
      return []
    }
    return key
  }

  
  static _getPlayListKeywords() {
    const key = wx.getStorageSync(Cache.PLAY_KEY)
    if (!key) {
      wx.setStorageSync(Cache.PLAY_KEY, [])
      return []
    }
    return key
  }

  static _setSearchKeywords(searches) {
    wx.setStorageSync(Cache.SEARCH_KEY, searches)
  }

  static _setFavoriteListKeywords(list) {
    wx.setStorageSync(Cache.FAVORITE_KEY, list)
  }

  static _setPlayListKeywords(list) {
    wx.setStorageSync(Cache.PLAY_KEY, list)
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

  static savePlay(song) {
    let songs = this._getPlayListKeywords()
    this.insertArray(songs, song, (item) => {
      return item.id === song.id
    }, Cache.PLAY_KEY)
    this._setPlayListKeywords(songs)
    return songs
  }

  static saveFavorite(song) {
    let songs = this._getFavoriteListKeywords()
    this.insertArray(songs, song, (item) => {
      return song.id === item.id
    }, Cache.FAVORITE_MAX_LENGTH)
    this._setFavoriteListKeywords(songs)
    return songs
  }
  
  static deleteFavorite(song) {
    let songs = this._getFavoriteListKeywords()
    this.deleteFromArray(songs, (item) => {
      return song.id === item.id
    })
    this._setFavoriteListKeywords(songs)
    return songs
  }

  static async loadFavorite() {
    let songs = await Song.updatePlayUrl(this._getFavoriteListKeywords())
    this._setFavoriteListKeywords(songs)
    return songs
  }

  static async loadPlay() {
    let songs = await Song.updatePlayUrl(this._getPlayListKeywords()) 
    this._setPlayListKeywords(songs)
    return songs
  }

  static loadSequenceList() {
    return []
  }

  






}

export {
  Cache
}