import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import DispListIn from "../components/DispList/DispListIn";
import { PrivateRoute } from "../_components";
import DispListNewMessage from "../components/DispList/DispListNewMessage";

export default function DispListRoutes(props) {
    const match = useRouteMatch();
    const path = match.path;

    return (
        <Switch>
            <Route exact path={`${path}`} >
                <Redirect to={`${path}/list/displist`} />
            </Route>
            <PrivateRoute path={`${path}/list/:type/:id`} component={DispListIn} handleSetTitle={(title) => props.handleSetTitle(title)} />
            <PrivateRoute path={`${path}/list/:type`} component={DispListIn} handleSetTitle={(title) => props.handleSetTitle(title)} />
            <PrivateRoute path={`${path}/msg/:type/new`} component={DispListNewMessage} handleSetTitle={(title) => props.handleSetTitle(title)} />
        </Switch>
    )
}