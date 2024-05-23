const EmptyArray = [];
const EmptyObject = {};
export const displistEntriesSelector = (store, id) => store.displist.displistEntry.list[id]?.entries ?? EmptyArray;

export const rowModesModelSelector = (store, id) => store.displist.displistEntry.list[id]?.rowModesModel ?? EmptyObject;