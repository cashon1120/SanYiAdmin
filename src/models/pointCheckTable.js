import { add, fetch, update, del, info, review } from '../service/pointCheckTableService'

export default {
  namespace : 'pointCheckTable',
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
    * del({
      payload,
      callback
    }, {call}) {
      const response = yield call(del, payload);
      if (callback)
        callback(response)
    },
    * getInfo({
      payload,
      callback
    }, {call}) {
      const response = yield call(info, payload);
      if (callback)
        callback(response)
    },
    * review({
      payload,
      callback
    }, {call}) {
      const response = yield call(review, payload);
      if (callback)
        callback(response)
    }
  }
}