import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { PrivateRoute } from "../_components";
import DnIn from "../components/Dn/DnIn";
import DnNewMessage from "../components/Dn/DnNewMessage";

export default function DnRoutes(props) {
    const match = useRouteMatch();
    const path = match.path;

    return (
        <Switch>
            <Route exact path={`${path}`} >
                <Redirect to={`${path}/list/dn-list`} />
            </Route>
            <PrivateRoute path={`${path}/list/:type/:id`} component={DnIn} handleSetTitle={(title) => props.handleSetTitle(title)} />
            <PrivateRoute path={`${path}/list/:type`} component={DnIn} handleSetTitle={(title) => props.handleSetTitle(title)} />
            <PrivateRoute path={`${path}/msg/:type/new`} component={DnNewMessage} handleSetTitle={(title) => props.handleSetTitle(title)} />
        </Switch>
    )
}