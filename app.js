//app.js

import {
  state
} from "./store/state.js"

import {
  mutations
} from "./store/mutations"
import { types } from "./store/mutation-types.js"


App({
  
  getters() {
    return state
  },

  mutation(type, data) {
    mutations(type, data)
  },

  globalData: {
    data: state
  },
  
  watchPlayId: function(method, playId, callback) {
    let obj = state
    Object.defineProperty(obj, playId, {
      configurable: true,
      enumerable: true,
      set: function(value) {
        this._playId = value
        callback(value)
      },
      get: function(value) {
        return this._playId
      }
    })
  },

  watchCurrentIndex: function(method, currentIndex, callback) {
    let obj = state
    Object.defineProperty(obj, currentIndex, {
      configurable: true,
      enumerable: true,
      set: function(value) {
        this._currentIndex = value
        callback(value)
      },
      get: function(value) {
        return this._currentIndex
      }
    })
  },

  watchPlayList: function(method, playlist, callback) {
    let obj = state
    Object.defineProperty(obj, playlist, {
      configurable: true,
      enumerable: true,
      set: function(value) {
        this._playlist = value
        callback(value)
      },
      get: function(value) {
        return this._playlist
      }
    })
  }
  
})