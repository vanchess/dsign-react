import { createSelector } from "@reduxjs/toolkit";

const msgByTypeSelector = (store, msgType) => {
    if (msgType === 'dn-list') {
        return store.dn.dnListMsg;
    }
    if (msgType === 'dn-contract') {
        return store.dn.dnContractMsg;
    }
    if (msgType === 'smo-fin-advance') {
        return store.smoFin.smoFinAdvanceMsg;
    }
    if (msgType === 'smo-fin-payment') {
        return store.smoFin.smoFinPaymentMsg;
    }
    return store.messageReducer;
}

const EmptyArray = [];
export const msgItemsByTypeSelector = (store, msgType) => {
    const m = msgByTypeSelector(store, msgType);
    return m?.items ?? EmptyArray;
};

export const msgLoadingByTypeSelector = (store, msgType) => {
    const m = msgByTypeSelector(store, msgType);
    return m?.loading ?? false;
};

