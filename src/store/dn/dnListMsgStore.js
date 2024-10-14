import { createAction } from "@reduxjs/toolkit";
import { messageService } from "../../services";

export const messageGetRequest = createAction('DN_LIST_MESSAGE_IN_GET_REQUEST');
export const messageGetSuccess = createAction('DN_LIST_MESSAGE_IN_GET_SUCCESS');
export const messageGetFailure = createAction('DN_LIST_MESSAGE_IN_GET_FAILURE');
  
export const msgDnListFetch = (page, perPage, status = [], period = [], org = []) => {
    return (dispatch) => {
        dispatch(messageGetRequest());
        
        messageService.getAll(page, perPage, 1, ['dn-list'], status, period, org).then(
            itemCollection => dispatch(messageGetSuccess(itemCollection.data)), 
            error => dispatch(messageGetFailure(error))
        );
    }
}

/* Reducer */
const initialState = {
    items: [],
    loading: false,
    error: false,
  };

export function dnListMsgReducer(state = initialState, action) {
    switch (action.type) {
        case messageGetRequest.type: 
            return { ...state,
                loading: true
            };
        case messageGetSuccess.type:
            return { ...state,
                items: action.payload,
                loading: false
            };
        case messageGetFailure.type:
            return { ...state,
                error: action.payload,
                loading: false
            };
        default: 
            return state;
    }
}