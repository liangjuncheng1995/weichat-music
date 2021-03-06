import {
  types
} from "./mutation-types.js"
import {
  state
} from "./state.js"


export function mutations(type, data) {
  switch (type) {
    case types.SET_DISC:
      set_disc(data)
      break;
    case types.SET_SEQUENCE_LIST:
      set_sequence_list(data)
      break;
    case types.SET_PLAYLIST:
      set_playlist(data)
      break;
    case types.SET_CURRENT_INDEX:
      set_current_index(data)
      break;
    case types.SET_FULL_SCREEN:
      set_full_screen(data)
      break;
    case types.SET_PLAYING_STATE:
      set_playing_state(data)
      break;
    case types.SET_PLAY_MODE:
      set_play_mode(data)
      break;
    case types.SET_PLAY_ID:
      set_play_id(data)
      break;
    case types.SET_SEARCH_HISTORY:
      set_search_history(data)
      break;
    case types.SET_PLAY_HISTORY:
      set_plsy_history(data)
      break;
    case types.SET_FAVORITE_LIST:
      set_favorite_list(data)
      break;
  }

}

function set_disc(disc) {
  state.disc = disc
}

function set_sequence_list(list) { //设置播放模式的循环的歌曲列表
  state.sequenceList = list
}

function set_playlist(list) { //设置播放列表
  state.playlist = list
}

function set_current_index(index) { //设置点击了哪一首歌曲
  state.currentIndex = index
}

function set_full_screen(flag) { //设置迷你播放器的展示和隐藏
  state.fullScreen = flag
}

function set_playing_state(flag) { //设置歌曲的播放状态
  state.playing = flag
}

function set_play_mode(mode) { //设置播放列表的播放模式
  state.mode = mode
}

function set_play_id(id) { //设置正在播放的歌曲的id
  state.playId = id
}

function set_search_history(history) { //设置搜索历史的相关数据
  state.searchHistory = history
}

function set_plsy_history(history) { //设置搜索历史的相关数据
  state.playHistory = history
}

function set_favorite_list(list) { //设置搜索历史的相关数据
  state.favoriteList = list
}