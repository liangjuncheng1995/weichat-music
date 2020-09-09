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
  }


  
  

 

  
})