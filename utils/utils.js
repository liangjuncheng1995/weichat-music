const promisic = function (func) {
  return function (params = {}) {
    return new Promise((resolve, reject) => {
      const args = Object.assign(params, {
        success: (res) => {
          resolve(res)
        },
        fail: (error) => {
          reject(error)
        }
      })
      func(args)
    })
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}


function sumArr(arr, n) {
  let sum = 0
  for (let index = 0; index < n; index++) {
    sum = sum + arr[index]
  }
  return sum
}


// 代理模式

export {
  promisic,
  shuffle,
  sumArr
}