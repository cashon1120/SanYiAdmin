import { add, fetch, update, info } from '../service/ImportantPartsService'

export default {
  namespace : 'importantParts',
  state : {
    data: {
      list: [],
      pagination: {}
    }
  },
  reducers : {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    }
  },
  effects : {
    * fetch({
      payload,
      callback
    }, {call, put}) {
      const response = yield call(fetch, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: response
        });
      }
      if (callback)
        callback(response)
    },
    * add({
      payload,
      callback
    }, {call}) {
      const response = yield call(add, payload);
      if (callback)
        callback(response)
    },
    * update({
      payload,
      callback
    }, {call}) {
      const response = yield call(update, payload);
      if (callback)
        callback(response)
    },
    * info({
      payload,
      callback
    }, {call}) {
      const response = yield call(info, payload);
      if (callback)
        callback(response)
    }
  }
}