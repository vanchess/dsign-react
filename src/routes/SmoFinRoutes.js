import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { PrivateRoute } from "../_components";
import SmoFinIn from "../components/SmoFin/SmoFinIn";
import SmoFinNewMessage from "../components/SmoFin/SmoFinNewMessage";

export default function SmoFinRoutes(props) {
    const match = useRouteMatch();
    const path = match.path;

    return (
        <Switch>
            <Route exact path={`${path}`} >
                <Redirect to={`${path}/list/smo-fin-advance`} />
            </Route>
            <PrivateRoute path={`${path}/list/:type/:id`} component={SmoFinIn} handleSetTitle={(title) => props.handleSetTitle(title)} />
            <PrivateRoute path={`${path}/list/:type`} component={SmoFinIn} handleSetTitle={(title) => props.handleSetTitle(title)} />
            <PrivateRoute path={`${path}/msg/:type/new`} component={SmoFinNewMessage} handleSetTitle={(title) => props.handleSetTitle(title)} />
        </Switch>
    )
}