import { uploadBanner, getBanner } from '../service/IndexBannerService'

export default {
  namespace : 'indexBanner',
  state : {},
  reducers : {},
  effects : {
    * uploadBanner({
      payload,
      callback
    }, {call}) {
      const response = yield call(uploadBanner, payload);
      if (callback)
        callback(response)
    },
    * getBanner({
      payload,
      callback
    }, {call}) {
      const response = yield call(getBanner, payload);
      if (callback)
        callback(response)
    }
  }
}