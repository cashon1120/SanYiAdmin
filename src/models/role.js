import { add, fetch } from '../service/RoleService'

export default {
  namespace: 'role',

  state: {
    data: {
      list: [],
      pagination: {}
    },
    allRole: []
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(fetch, payload);
      if (response) {
        yield put({
          type: 'save',
          payload: response
        });
        if (callback) callback(response);
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      };
    },
    saveAll(state, action) {
      return {
        ...state,
        allRole: action.payload.data
      };
    }
  }
};
