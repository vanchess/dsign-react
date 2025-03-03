import { createSelector } from "@reduxjs/toolkit";

export const periodListSelector = (store) => store.periodReducer.items;

export const periodSortedListSelector = createSelector(
    periodListSelector, 
    (items) => items.slice().sort(function(a, b) {
        if (a.attributes.from < b.attributes.from) {
          return 1; }
        if (a.attributes.from > b.attributes.from) {
          return -1; }
        return 0;
    }));