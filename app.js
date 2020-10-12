//app.js
require('./common/runtime.js')
require('./common/vendor.js')
require('./common/main.js')


import {
  state
} from "./store/state.js"

import {
  mutations
} from "./store/mutations"
import { types } from "./store/mutation-types.js"
import { watchCurrentIndex, watchPlayId, watchPlayList } from "./store/watch.js"

watchCurrentIndex(mutations, "currentIndex", _currentIndex)
watchPlayId(mutations, "playId", _playId)
watchPlayList(mutations, "playlist", _playlist)
function _currentIndex() {

}
function _playId() {
  
}
function _playlist() {
  
}

console.log("小程序启动的时候：")
// console.log(state.currentIndex)
// console.log(state.playlist)
// console.log(state.playId)
state


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
  
  


  

  
})


