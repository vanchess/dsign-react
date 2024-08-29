import { combineReducers } from "redux";
import { dnContractMsgReducer } from "./dnContractMsgStore";

export const dnReducer = combineReducers({
    dnContractMsg: dnContractMsgReducer,
    // dnListMsg: 
});