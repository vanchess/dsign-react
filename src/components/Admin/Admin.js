import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { userFetch } from "../../store/user/userAction";
import { userArrSelector } from "../../store/user/userSelectors";
import FullScreenDialog from "../Dialog/FullScreenDialog";
import { createColumns } from './columnsDataGrid.js'
import UserShow from "./UserShow";
import UserList from "./UsersList";

const title = 'Пользователи';

export default function Admin(props) {
    const history = useHistory();
    const {id:userId} = useParams();
    //const match = useRouteMatch();
    //const path = match.path;

    const dispatch = useDispatch();
    const users = useSelector(userArrSelector);

    useEffect(() => {
        props.setTitle(title);
        dispatch(userFetch(0, -1, 'roles'));
    }, [dispatch]);


    const handleClickShowItem = (id) => {
        history.push(`/admin/users/${id}`);
    }

    const handleCloseDialog = () => {
        history.push(`/admin/users`);
        props.setTitle(title);
    };
    
    let columns = createColumns(handleClickShowItem);

    return (
        <>
            <UserList 
                rowsPerPageOptions={[10, 15, 20, 50, 100]}
                pageSize={props.perPage}
                items = {users}
                columns = {columns}
                loading = {false}
                
                
                page={props.page}
                backIconButtonProps={{
                    'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                    'aria-label': 'Next Page',
                }}
                
                //onChangePage={this.props.handleChangePage}
                //onChangeRowsPerPage={this.props.handleChangeRowsPerPage}
            />
            <FullScreenDialog title={'Пользователь'} open={Boolean(userId)} onClose={handleCloseDialog}>
                <UserShow id={userId} setTitle={props.setTitle}/>
            </FullScreenDialog>
        </>
    )
}