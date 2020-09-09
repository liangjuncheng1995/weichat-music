import {
  Song
} from "../model/song"
import {
  mutations
} from "./mutations"
import {
  types
} from "./mutation-types"
import {
  state
} from "./state"
import {
  playMode
} from "../config/index.js"
import {
  shuffle
} from "../utils/utils"

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}


export const selectPlay = async function ({
  list,
  index
}) {
  if (!list[index].url) {
    const data = await Song.getPlayUrl(list[index].mid)
    list[index].url = data.url_mid.data.midurlinfo[0].purl
  }
  mutations(types.SET_SEQUENCE_LIST, list) //提交到循环的列表

  if (state.mode === playMode.random) {
    let randomList = shuffle(list) //随机打乱播放的列表
    mutations(types.SET_PLAYLIST, randomList) //把打乱的播放列表添加到playlist中
    index = findIndex(randomList, list[index]) //然后把打乱数据的index 也需要重置
  } else {
    mutations(types.SET_PLAYLIST, list) //提交到初始化的列表
  }

  mutations(types.SET_CURRENT_INDEX, index)
  mutations(types.SET_FULL_SCREEN, true)
  mutations(types.SET_PLAYING_STATE, true)

}

export const randomPlay = async function ({list}) {
  mutations(types.SET_PLAY_MODE, playMode.random) //更改播放的模式
  mutations(types.SET_SEQUENCE_LIST, list) //设置循环的播放列表
  let randomList = shuffle(list)
  if (!randomList[0].url) {
    const data = await Song.getPlayUrl(randomList[0].mid)
    randomList[0].url = data.url_mid.data.midurlinfo[0].purl
  }

  mutations(types.SET_PLAYLIST, randomList) //设置播放列表
  mutations(types.SET_CURRENT_INDEX, 0)
  mutations(types.SET_FULL_SCREEN, true)
  mutations(types.SET_PLAYING_STATE,true)

}