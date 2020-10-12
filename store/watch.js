import {
  state
} from "./state.js"

export const watchCurrentIndex = function (method, currentIndex, callback) {
  Object.defineProperty(state, "currentIndex", {
    configurable: true,
    enumerable: true,
    set: function (value) {
      this._currentIndex = value
      callback(value)
    },
    get: function (value) {
      if (this._currentIndex === undefined) {
        this._currentIndex = -1
      }
      return this._currentIndex 
    },
  })
}

export const watchPlayList = function (method, playlist, callback) {
  Object.defineProperty(state, playlist, {
    configurable: true,
    enumerable: true,
    set: function (value) {
      this._playlist = value
      callback(value)
    },
    get: function (value) {
      if (this._playlist === undefined) {
        return []
      }
      return this._playlist 
    }
  })
}

export const watchPlayId = function (method, playId, callback) {
  Object.defineProperty(state, playId, {
    configurable: true,
    enumerable: true,
    set: function (value) {
      this._playId = value
      callback(value)
    },
    get: function (value) {
      if (this._playId === undefined) {
        return ''
      }
      return this._playId 
    }
  })
}