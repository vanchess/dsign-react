import React, { useState } from "react";
import Home from "./Home";
import AdminRoutes from "./routes/AdminRoutes";

export default function AdminHome(props) {
    const {path} = props;
    const [title, setTitle] = useState();

    const handleSetTitle = t => {
        setTitle(t);
    }
    let actions = [];
    let sidebarMainListItems = [];

    return (  
        <Home
            path={path}
            title={title}
            main={<AdminRoutes handleSetTitle={(title) => handleSetTitle(title)}/>}
            sidebarMainListItems={sidebarMainListItems}
            actions={actions}
        />
      );
}