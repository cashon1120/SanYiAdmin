import { login, queryCurrent, editPassword } from '../service/LoginService'
import { fetchSystem } from '../service/chassisComponentService'

export default {
  namespace : 'login',
  state : {
    isLogin: false,
    userInfo: {},
    systemList: []
  },
  reducers : {
    saveCurrentUser(state, action) {
      return {
        ...state,
        userInfo: action.payload
      }
    },
    save(state, action) {
      return {
        ...state,
        systemList: action.payload.data.list
      }
    }
  },
  effects : {
    * login({
      payload,
      callback
    }, {call}) {
      const response = yield call(login, payload);
      if (callback)
        callback(response)
    },
    * fetchSystem({
      payload,
      callback
    }, {call, put}) {
      const response = yield call(fetchSystem, payload);
      if (response) {
        yield put({
          type: 'saveSystemList',
          payload: response
        });
      }
      if (callback)
        callback(response)
    },
    *fetchCurrent({ payload, callback }, { call, put }) {
      const response = yield call(queryCurrent, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: response
      });
      if (callback) callback(response);
    },
    *editPassword({ payload, callback }, { call }) {
      const response = yield call(editPassword, payload);
      if (callback) callback(response);
    }
  }
}