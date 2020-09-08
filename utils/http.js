import {
  promisic
} from './utils';
import { config } from '../config/index';

class Http {
  static async request({
    url,
    data,
    method = "GET"
  }) {
    const res = await promisic(wx.request) ({
      url: `${config.apiBaseUrl}${url}`,
      data,
      method
    })
    return res.data
  }
}

export {
  Http
}