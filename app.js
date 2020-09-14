//app.js

import {
  state
} from "./store/state.js"

import {
  mutations
} from "./store/mutations"


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
  
  watch: function(method) {
    var obj = this.globalData
    Object.defineProperty(obj, 'data', {
      configurable: true,
      enumerable: true,
      set: function(value) {
        this.data = value.data
        method(value) 
      },
      get: function() {
        return this.globalData
      }
    })
  }


  
})