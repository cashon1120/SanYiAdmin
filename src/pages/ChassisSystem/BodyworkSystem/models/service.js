import {selectFaultInfo, addFaultAndMultimedia, update, add} from "@/service/BodyworkSystemService";
import {findAllSCorePartsByStatus} from "@/service/CoreComponentNameService";
import {findAllSAssemblyPartsByStatus} from "@/service/AssemblyPartsNameService";
import {message} from "antd";

export default {
    namespace: 'BodyworkSystem',
    state: {
        logData: [],
        corePartsData: [],
        assemblyPartsData: [],
        faultData: [],
        faultInfoExVO: [],
    },

    reducers:{
        findCorePartsData(state, { payload: todoList }){
            // console.log('==3==>',todoList)
            return {
                ...state,
                corePartsData: todoList
            }
        },
        findAssemblyPartsData(state, { payload: todoList }){
            return {
                ...state,
                assemblyPartsData: todoList
            }
        },
        setFaultData(state, { payload: todoList }){
            // console.log('====>',todoList)
            return {
                ...state,
                faultData: todoList
            }
        },
        saveFaultInfoExVO(state, { payload: todoList }){
            console.log('===saveData===>',todoList)
            return {
                ...state,
                faultInfoExVO: todoList
            }
        }
    },

    effects: {
        * dataInfo({payload, callback}, {call, put}) {
            const res = yield call(selectFaultInfo, payload);
            if (res && res.code == 200) {
                if (callback && typeof callback === 'function') {
                    callback(res);
                }
            } else if (res.code == 400) {
                message.error(res.message);
            }
        },

        * corePartsInfo({payload, callback},{call, put}){
            const res = yield call(findAllSCorePartsByStatus, payload);
            if (res && res.code == 200) {
                const todoList = res.data;
                // console.log('==2==>',todoList);
                yield put({ type: 'findCorePartsData', payload: todoList });
            } else if (res.code == 400) {
                message.error(res.message);
            }
        },

        * assemblyPartsInfo({payload, callback},{call, put}){
            const res = yield call(findAllSAssemblyPartsByStatus, payload);
            if (res && res.code == 200) {
                const todoList = res.data;
                yield put({ type: 'findAssemblyPartsData', payload: todoList });
            } else if (res.code == 400) {
                message.error(res.message);
            }
        },

        * setFaultInfo({payload,callback},{call,put}){
            const todoList = payload;
            yield put({ type: 'setFaultData', payload: todoList });
        },

        * add({payload, callback},{call, put}){
            const res = yield call(addFaultAndMultimedia, payload);
            if (res && res.code == 200) {
                if (callback && typeof callback === 'function') {
                    callback(res);
                }
            } else if (res.code == 400) {
                message.error(res.message);
            }
        },

        * update({payload, callback},{call, put}){
            const res = yield call(update, {payload});
            if (res && res.code == 200) {
                if (callback && typeof callback === 'function') {
                    callback(res);
                }
            } else if (res.code == 400) {
                message.error(res.message);
            }
        },

        * saveData({payload, callback},{call, put}){
            if(payload != null){
                let todoList = payload;
                yield put({ type: 'saveFaultInfoExVO', payload: todoList });
            }
        },
    }
};