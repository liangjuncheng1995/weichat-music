function getRankCls(index) {
  if(index <= 2) {
    return 'icon icon' + index
  } else {
    return 'text'
  }
} 

module.exports = {
  getRankCls: getRankCls
}