import {
  Http
} from "../utils/http"

class Switch {
  static async getSwitchType() {
    return await Http.request({
      url: "/turn"
    })
  }
}

export {
  Switch
}