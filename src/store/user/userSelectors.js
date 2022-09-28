export const userArrSelector = store => store.userReducer.items;

export const userByIdSelector = (store, id) => {
    const userArr = userArrSelector(store);
    for (const user of userArr) {
        if (user && Number(user.id) === Number(id)) {
            return user;
        }
    }
    return null;
}