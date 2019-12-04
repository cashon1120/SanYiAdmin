import { fetchSystem } from '../service/chassisComponentService'
import { fetch } from '../service/pointCheckProjectService'
import { importForExcel } from '../service/addExcelService'

export default {
  namespace : 'publicModel',
  state : {
    systemList: [],
    projectList: []
  },
  reducers : {
    saveSystemList(state, action) {
      return {
        ...state,
        systemList: action.payload.data.list
      }
    },
    saveProjectList(state, action) {
      return {
        ...state,
        projectList: action.payload.data.list
      }
    }
  },
  effects : {
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
    * fetchProject({
      payload,
      callback
    }, {call, put}) {
      const response = yield call(fetch, payload);
      if (response) {
        yield put({
          type: 'saveProjectList',
          payload: response
        });
      }
      if (callback)
        callback(response)
    },
    * importForExcel({
      payload,
      callback
    }, {call}) {
      const response = yield call(importForExcel, payload);
      if (callback)
        callback(response)
    }
  }
}