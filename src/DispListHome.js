import React, { useState } from "react";
import Home from "./Home";
import DispListRoutes from "./routes/DispListRoutes";
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DispListHome(props) {
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
        if (permission.includes('send displist')) {
            actions.push({'key':1, 'title':'список на проф.мероприятия','tooltip':'Создать новый список на проф.мероприятия','to':`${path}/msg/displist/new`});
        }

        sidebarMainListItems.push({'key':2, 'title':'Списки на проф.мероприятия', 'to':`${path}/list/displist`,   'tooltip':'Списки сотрудников на проф.мероприятия', 'icon': <ListAltIcon />});

        
    }

    return (  
        <Home
            title={title}
            main={<DispListRoutes handleSetTitle={(title) => handleSetTitle(title)}/>}
            sidebarMainListItems={sidebarMainListItems}
            actions={actions}
        />
      );
}