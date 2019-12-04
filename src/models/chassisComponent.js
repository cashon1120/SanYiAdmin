import { add, fetchVehicleSystem, fetchOptionLogs, fetchSystem, update, review, del, info, downLoad  } from '../service/chassisComponentService'

export default {
  namespace : 'chassisComponent',
  state : {
    data: {
      list: [],
      pagination: {}
    },
    optionLogs: {
      data: [],
      pagination: {}
    },
    vehicleSystem: []
  },
  reducers : {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    saveLogs(state, action) {
      return {
        ...state,
        optionLogs: action.payload.data
      };
    },
    saveVehicleSystem(state, action) {
      return {
        ...state,
        vehicleSystem: action.payload.data.list
      };
    }
  },
  effects : {
    * fetchVehicleSystem({
      payload,
      callback
    }, {call, put}) {
      const response = yield call(fetchVehicleSystem, payload);
      if (response) {
        yield put({
          type: 'saveVehicleSystem',
          payload: response
        });
      }
      if (callback)
        callback(response)
    },
    * fetchLogs({
      payload,
      callback
    }, {call, put}) {
      const response = yield call(fetchOptionLogs, payload);
      if (response) {
        yield put({
          type: 'saveLogs',
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
      const response = yield call(fetchSystem, payload);
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
    * review({
      payload,
      callback
    }, {call}) {
      const response = yield call(review, payload);
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
    * info({
      payload,
      callback
    }, {call}) {
      const response = yield call(info, payload);
      if (callback)
        callback(response)
    },
    * download({
      payload,
      callback
    }, {call}) {
      const response = yield call(downLoad, payload);
      if (callback)
        callback(response)
    }
  }
}