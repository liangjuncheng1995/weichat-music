import { playMode } from "../config/index.js";

export const state = {
  disc: {},//存储推荐歌曲的相关数据
  sequenceList: [], //设置播放模式的循环的歌曲列表
  mode: playMode.sequence, //存储列表的播放模式，默认列表播放
  playlist: [], //设置播放列表，初始值为空
  currentIndex: -1, //保存用户点击了哪一首歌曲，默认是-1
  playing: false, //播放的状态
  fullScreen: false, //正常的播放器是否正常加载，与模拟播放器的状态是相反的，只能显示一个
}