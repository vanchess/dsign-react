import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import Admin from "../components/Admin/Admin";
import { PrivateRoute } from "../_components";

export default function AdminRoutes(props) {
    const match = useRouteMatch();
    const path = match.path;

    return (
        <Switch>
            <Route exact path={`${path}`} >
                <Redirect to={`${path}/users`} />
            </Route>
            <PrivateRoute path={`${path}/users/:id`} component={Admin} handleSetTitle={(title) => props.handleSetTitle(title)} />
            <PrivateRoute path={`${path}/users`} component={Admin} handleSetTitle={(title) => props.handleSetTitle(title)} />
        </Switch>
    )
}