import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import DispList from "../components/DispList/DispList";
import { PrivateRoute } from "../_components";

export default function DispListRoutes(props) {
    const match = useRouteMatch();
    const path = match.path;

    return (
        <Switch>
            <Route exact path={`${path}`} >
                <Redirect to={`${path}/list`} />
            </Route>
            <PrivateRoute path={`${path}/list/:id`} component={DispList} handleSetTitle={(title) => props.handleSetTitle(title)} />
            <PrivateRoute path={`${path}/list`} component={DispList} handleSetTitle={(title) => props.handleSetTitle(title)} />
        </Switch>
    )
}