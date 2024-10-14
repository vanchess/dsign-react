import { combineReducers } from "redux";
import { dnContractMsgReducer } from "./dnContractMsgStore";
import { dnListMsgReducer } from "./dnListMsgStore";
import { dnListEntriesReducer } from "./dnListEntryStore";

export const dnReducer = combineReducers({
    dnContractMsg: dnContractMsgReducer,
    dnListMsg: dnListMsgReducer,
    dnListEntry: dnListEntriesReducer
});