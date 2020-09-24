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

export const checkoutAudioUrl = async function (index) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()

  if (!playlist[index].url) {
    const data = await Song.getPlayUrl(playlist[index].mid)
    playlist[index].url = data.url_mid.data.midurlinfo[0].purl
  }
  if (!sequenceList[index].url) {
    const data = await Song.getPlayUrl(sequenceList[index].mid)
    sequenceList[index].url = data.url_mid.data.midurlinfo[0].purl
  }

  mutations(types.SET_PLAYLIST, playlist)
  mutations(types.SET_SEQUENCE_LIST, sequenceList)

}


export const selectPlay = async function ({
  index
}) {
  let list = state.playlist
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

export const randomPlay = async function () {
  let list = state.playlist
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
  mutations(types.SET_PLAYING_STATE, true)

}


export const selectPrev = async function ({
  list,
  index
}) {
  if (!list[index].url) {
    const data = await Song.getPlayUrl(list[index].mid)
    list[index].url = data.url_mid.data.midurlinfo[0].purl
    mutations(types.SET_PLAYLIST, list)

  }
  mutations(types.SET_CURRENT_INDEX, index)
  // mutations(types.SET_FULL_SCREEN, true)
  // mutations(types.SET_PLAYING_STATE, true)


}

export const deleteSongList = function () {
  mutations(types.SET_PLAYLIST, [])
  mutations(types.SET_SEQUENCE_LIST, [])
  mutations(types.SET_CURRENT_INDEX, -1)
  mutations(types.SET_PLAY_ID, '')
  mutations(types.SET_PLAYING_STATE, false)
}

export const resetSongList = function () {
  console.log("reset")
  mutations(types.SET_PLAYLIST, [])
  mutations(types.SET_SEQUENCE_LIST, [])
  mutations(types.SET_CURRENT_INDEX, -1)
  mutations(types.SET_PLAY_ID, '')
  mutations(types.SET_PLAYING_STATE, false)
}

export const deleteSong = async function (song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1) //删除点击的一首歌曲
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1) //删除点击的一首歌曲


  if (currentIndex > pIndex || currentIndex === playlist.length) { //当前的索引 在 要删除歌曲的下面  或者当前的歌曲在最后一首
    currentIndex--
  }

  if (!playlist[currentIndex].url) { //处理没有url的地址
    const data = await Song.getPlayUrl(playlist[currentIndex].mid)
    playlist[currentIndex].url = data.url_mid.data.midurlinfo[0].purl
  }
  if (!sequenceList[currentIndex].url) { //处理没有url的地址
    const data = await Song.getPlayUrl(sequenceList[currentIndex].mid)
    sequenceList[currentIndex].url = data.url_mid.data.midurlinfo[0].purl
  }

  mutations(types.SET_PLAYLIST, playlist)
  mutations(types.SET_SEQUENCE_LIST, sequenceList)
  mutations(types.SET_CURRENT_INDEX, currentIndex)

  if(!playlist.length) {//如果删除了最后一首
    mutations(types.SET_PLAYING_STATE, false)
  } else {
    mutations(types.SET_PLAYING_STATE, true)
  }

}