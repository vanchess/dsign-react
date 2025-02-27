import React, { useState } from "react";
import Home from "./Home";
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import SmoFinRoutes from "./routes/SmoFinRoutes";

export default function SmoFinHome(props) {
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
        if (permission.includes('send smo-fin-advance')) {
            actions.push({'key':1, 'title':'Аванс','tooltip':'Подать заявку на аванс','to':`${path}/msg/smo-fin-advance/new`});
        }
        if (permission.includes('send smo-fin-payment')) {
            actions.push({'key':2, 'title':'Расчет','tooltip':'Подать заявку на расчет','to':`${path}/msg/smo-fin-payment/new`});
        }

        sidebarMainListItems.push({'key':3, 'title':'Заявки на аванс', 'to':`${path}/list/smo-fin-advance`,   'tooltip':'Заявки СМО на аванс', 'icon': <ListAltIcon />});
        sidebarMainListItems.push({'key':4, 'title':'Заявки на расчет', 'to':`${path}/list/smo-fin-payment`,   'tooltip':'Заявки СМО на расчет', 'icon': <ListAltIcon />});
    }

    return (  
        <Home
            title={title}
            main={<SmoFinRoutes handleSetTitle={(title) => handleSetTitle(title)}/>}
            sidebarMainListItems={sidebarMainListItems}
            actions={actions}
        />
      );
}