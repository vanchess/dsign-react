import React, { useState } from "react";
import Home from "./Home";
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import DnRoutes from "./routes/DnRoutes";

export default function DnHome(props) {
    const match = useRouteMatch();
    const path = match.path;
    // const {path} = props.match;
    const [title, setTitle] = useState();
    const permission = useSelector(store => store.authReducer.user.permissions)

    const handleSetTitle = t => {
        setTitle(t);
    }
    let actions = [];
    let sidebarMainListItems = [];

    if(permission) {
        if (permission.includes('send dn-list')) {
            actions.push({'key':1, 'title':'Создать список','tooltip':'Создать новый список на диспансерное наблюдение','to':`${path}/msg/dn-list/new`});
        }
        if (permission.includes('send dn-contract')) {
            actions.push({'key':2, 'title':'Добавить договор','tooltip':'Загрузить в систему договор с работодателем на диспансерное наблюдение сотрудников','to':`${path}/msg/dn-contract/new`});
        }

        sidebarMainListItems.push({'key':3, 'title':'Списки на диспансерное наблюдение', 'to':`${path}/list/dn-list`,   'tooltip':'Списки сотрудников на диспансерное наблюдение', 'icon': <ListAltIcon />});
        sidebarMainListItems.push({'key':4, 'title':'Договоры', 'to':`${path}/list/dn-contract`,   'tooltip':'Договоры с работодателями на диспансерное наблюдение сотрудников', 'icon': <ListAltIcon />});
    }

    return (  
        <Home
            title={title}
            main={<DnRoutes handleSetTitle={(title) => handleSetTitle(title)}/>}
            sidebarMainListItems={sidebarMainListItems}
            actions={actions}
        />
      );
}