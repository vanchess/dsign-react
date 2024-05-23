import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { userFetch } from "../../store/user/userAction";
import { userArrSelector } from "../../store/user/userSelectors";
import FullScreenDialog from "../Dialog/FullScreenDialog";
import DispListDataGrid from "./DispListDataGrid";

const title = 'Список сотрудников на проф.мероприятия';

export default function DispList(props) {
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

/*
    const handleClickShowItem = (id) => {
        history.push(`/admin/users/${id}`);
    }

    const handleCloseDialog = () => {
        history.push(`/admin/users`);
        props.setTitle(title);
    };
  */  

    return (
        <>
            <DispListDataGrid 
                rowsPerPageOptions={[10, 15, 20, 50, 100, 200]}
                pageSize={1000}
                items = {users}
                loading = {false}
                
                
                page={props.page}
                backIconButtonProps={{
                    'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                    'aria-label': 'Next Page',
                }}
            />
        </>
    )
}