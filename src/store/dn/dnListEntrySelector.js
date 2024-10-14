const EmptyArray = [];
const EmptyObject = {};
export const dnlistEntriesSelector = (store, id) => store.dn.dnListEntry.list[id]?.entries ?? EmptyArray;

export const rowModesModelSelector = (store, id) => store.dn.dnListEntry.list[id]?.rowModesModel ?? EmptyObject;