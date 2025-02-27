import { combineReducers } from "redux";
import { smoFinAdvanceMsgReducer } from "./smoFinAdvanceMsgStore";
import { smoFinPaymentMsgReducer } from "./smoFinPaymentMsgStore";

export const smoFinReducer = combineReducers({
    smoFinAdvanceMsg: smoFinAdvanceMsgReducer,
    smoFinPaymentMsg: smoFinPaymentMsgReducer
});