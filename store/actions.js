import {
  Song,
  createSong
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
import {
  Cache
} from "../model/cache"

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


export const selectPlay = async function ({lists,
  index,prev
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
  if(!prev) {
    mutations(types.SET_FULL_SCREEN, true)
  }
  mutations(types.SET_PLAYING_STATE, true)

}

export const randomPlay = async function (Userlist) {
  let list = Userlist || state.playlist 
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


  if (playlist.length && !playlist[currentIndex].url) { //处理没有url的地址
    const data = await Song.getPlayUrl(playlist[currentIndex].mid)
    playlist[currentIndex].url = data.url_mid.data.midurlinfo[0].purl
  }
  if (sequenceList.length && !sequenceList[currentIndex].url) { //处理没有url的地址
    const data = await Song.getPlayUrl(sequenceList[currentIndex].mid)
    sequenceList[currentIndex].url = data.url_mid.data.midurlinfo[0].purl
  }

  mutations(types.SET_PLAYLIST, playlist)
  mutations(types.SET_SEQUENCE_LIST, sequenceList)
  mutations(types.SET_CURRENT_INDEX, currentIndex)

  if (!playlist.length) { //如果删除了最后一首
    mutations(types.SET_PLAYING_STATE, false)
  } else {
    mutations(types.SET_PLAYING_STATE, true)
  }

}


export const insertSong = async function (song) {
  console.log(song)
  let newSong = createSong(song)
  if (state.playlist === undefined) state.playlist = []
  if (state.currentIndex === undefined) state.currentIndex = -1
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  //记录当前的歌曲
  let currentSong = playlist[currentIndex]
  //查找当前列表中是否有待插入的歌曲并返回索引
  let fpIndex = findIndex(playlist, newSong)
  //因为插入歌曲，所以索引加一
  currentIndex++
  //插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, newSong)
  //如果已经包含这首歌
  if (fpIndex > -1) {
    //如果当前播放的序号大于原本列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1) //删除搜索到的歌曲 在原来列表位置的歌曲
      currentIndex--
    } else { //如果当前播放的序号小于搜索之后原本列表中的序号
      playlist.splice(fpIndex + 1, 1) //删除原本列表的一条歌曲，由于fp的索引是有发生了改变的，所以要加 1
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, newSong)
  sequenceList.splice(currentSIndex, 0, newSong)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  if (!sequenceList[currentIndex].url) { //处理没有url的地址
    const data = await Song.getPlayUrl(sequenceList[currentIndex].mid)
    sequenceList[currentIndex].url = data.url_mid.data.midurlinfo[0].purl
  }
  if (!playlist[currentIndex].url) { //处理没有url的地址
    const data = await Song.getPlayUrl(playlist[currentIndex].mid)
    playlist[currentIndex].url = data.url_mid.data.midurlinfo[0].purl
  }

  mutations(types.SET_PLAYLIST, playlist)
  mutations(types.SET_SEQUENCE_LIST, sequenceList)
  mutations(types.SET_CURRENT_INDEX, currentIndex)
  mutations(types.SET_FULL_SCREEN, true)
  mutations(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function (query) {
  const result = Cache.saveSearch(query)
  console.log(result)
  mutations(types.SET_SEARCH_HISTORY, result)
}

export const savePlayHistory = function (song) {
  console.log("设置播放的历史")
  mutations(types.SET_PLAY_HISTORY, Cache.savePlay(song))
}

export const clearSearchHistory = function () {
  mutations(types.SET_SEARCH_HISTORY, Cache.clearSearch())
}

export const deleteSearchHistory = function (query) {
  mutations(types.SET_SEARCH_HISTORY, Cache.deleteSearch(query))
}

export const saveFavoriteList = function(song) {
  mutations(types.SET_FAVORITE_LIST, Cache.saveFavorite(song))
}

export const deleteFavoriteList = function(song) {
  mutations(types.SET_FAVORITE_LIST, Cache.deleteFavorite(song))
}


//加载个人中心的时候更新播放链接
export const undatePlayUrl = async function () {
  const songFavorite = await Cache.loadFavorite()
  mutations(types.SET_FAVORITE_LIST, songFavorite)
  const songPlay = await Cache.loadPlay()
  mutations(types.SET_PLAY_HISTORY, songPlay)
}