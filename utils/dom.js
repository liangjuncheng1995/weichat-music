const Dom = function (dom, that) {

  return new Promise((reolve, reject) => {
    const query = wx.createSelectorQuery().in(that)
    query.selectAll(dom).boundingClientRect()
    query.exec((res) => {
      reolve(res[0][0])
    })
  })
}

export {
  Dom
}