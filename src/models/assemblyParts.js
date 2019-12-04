import { add, fetch, update, info, systemComponent } from '../service/AssemblyPartsService'

export default {
  namespace : 'assemblyParts',
  state : {
    data: {
      list: [],
      pagination: {}
    },
    systemList: []
  },
  reducers : {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    saveSystem(state, action) {
      return {
        ...state,
        systemList: action.payload.data.list
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
    * fetchSystem({
      payload,
      callback
    }, {call, put}) {
      const response = yield call(systemComponent, payload);
      if (response) {
        yield put({
          type: 'saveSystem',
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