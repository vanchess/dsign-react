import React from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import { PrivateRoute } from '../_components';

import MekNewMessage  from  '../components/Expertise/MekNewMessage.js'
import MekShowMessage from  '../components/Expertise/MekShowMessage.js'
import MekInMessage   from  '../components/Expertise/MekInMessage.js'
import MeeInMessage   from  '../components/Expertise/MeeInMessage.js'
import MekIn from '../components/Expertise/MekIn'

class Routes extends React.Component {

    render(){

      let path = this.props.match.path;
      return (
            <Switch>
              <Route exact path={`${path}`} >
                <Redirect to={`${path}/list/mek`} />
              </Route>
              <PrivateRoute path={`${path}/msg/:type/new`} component={MekNewMessage} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/:type/:id`} component={MekShowMessage}  handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/mee`} component={MeeInMessage} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/msg/mek`} component={MekInMessage}  handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/list/:type/:id`} component={MekIn} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
              <PrivateRoute path={`${path}/list/:type`} component={MekIn} handleSetTitle={(title) => this.props.handleSetTitle(title)} />
            </Switch>
      );
    }
}

export default withRouter(Routes);
