import { importForExcel } from '../service/addExcelService'

export default {
  namespace : 'addExcel',
  state : {},
  reducers : {},
  effects : {
    * uploadExce({
      payload,
      callback
    }, {call}) {
      const response = yield call(importForExcel, payload);
      if (callback)
        callback(response)
    }
  }
}