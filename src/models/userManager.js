import { add, fetch, update, disableUser, resetPassword } from '../service/UserManagerService'

export default {
  namespace : 'userManager',
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
        data: {
          list:  action.payload.data
        }
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
    * disableUser({
      payload,
      callback
    }, {call}) {
      const response = yield call(disableUser, payload);
      if (callback)
        callback(response)
    },
    * resetPassword({
      payload,
      callback
    }, {call}) {
      const response = yield call(resetPassword, payload);
      if (callback)
        callback(response)
    }
  }
}