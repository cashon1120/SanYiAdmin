import { add, fetch, update, del } from '../service/DepartmentManagerService'

export default {
  namespace : 'departmentManager',
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
    * del({
      payload,
      callback
    }, {call}) {
      const response = yield call(del, payload);
      if (callback)
        callback(response)
    }
  }
}