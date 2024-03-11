import React from 'react';
import { withRouter } from "react-router-dom";
//import clsx from 'clsx';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import withStyles from '@mui/styles/withStyles';

import { useDispatch, useSelector } from 'react-redux';
import { authPermissionsSelector } from '../../store/auth/authSelectors';
import { userByIdSelector } from '../../store/user/userSelectors';
import { userRoleService } from '../../services/api/userRoleService';
import { userFetch } from '../../store/user/userAction';

const styles = theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(0),
  },
  paper: {
    padding: theme.spacing(2),
    //margin: theme.spacing(1),
    display: 'flex',
    overflow: 'auto',
    //flexDirection: 'column',
  },
})


const UserShow = (props) => {
    const { classes, id } = props;
    const user = useSelector(store => userByIdSelector(store, id));
    const permissions = useSelector(authPermissionsSelector);
    const dispatch = useDispatch();

    const assignRole = (userId, role) => {
        userRoleService.assignRole(userId, role).then(
            () => {dispatch(userFetch(0,-1, 'roles'))}
        )
    }
    const removeRole = (userId, role) => {
        userRoleService.removeRole(userId, role).then(
            () => {dispatch(userFetch(0,-1, 'roles'))}
        )
    }

    const showActionButton = (
            permissions
            && (
                permissions.includes('assign-role mo-lider')
                || permissions.includes('assign-role mo-chief-accountant')
                || permissions.includes('remove-role mo-lider')
                || permissions.includes('remove-role mo-chief-accountant')
            )
        );

    return (
            <Container maxWidth="lg" className={classes.container}>
            { showActionButton ? (
                
                <Grid container spacing={3}>
                    {/* Recent Orders */}
                    <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        {(permissions.includes('assign-role mo-lider')) &&
                        <Button 
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => {assignRole(id, 'mo-lider')}}>Добавить роль Руководитель</Button>
                        }
                        {(permissions.includes('assign-role mo-chief-accountant')) &&
                        <Button 
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => {assignRole(id, 'mo-chief-accountant')}}>Добавить роль Главный бухгалтер</Button>
                        }
                        {(permissions.includes('remove-role mo-lider')) &&
                        <Button 
                            variant="contained"
                            color="primary"
                            startIcon={<RemoveIcon />}
                            onClick={() => {removeRole(id, 'mo-lider')}}>Удалить роль Руководитель</Button>
                        }
                        {(permissions.includes('remove-role mo-chief-accountant')) &&
                        <Button 
                            variant="contained"
                            color="primary"
                            startIcon={<RemoveIcon />}
                            onClick={() => {removeRole(id, 'mo-chief-accountant')}}>Удалить роль Главный бухгалтер</Button>
                        }
                    </Paper>
                    </Grid>
                </Grid>
            
            ) :null }
          <div>{user?.attributes.name}</div>
          {user?.relationships.roles.data.map(r => {
            const name = r?.attributes.name;
            if (name === 'mo-lider') {
                return (<div key={name}>Руководитель МО</div>);
            }
            if (name === 'mo-chief-accountant') {
                return (<div key={name}>Главный бухгалтер МО</div>);
            }
            return (<div key={name}>{name}</div>)
          })}
          
          </Container>
    )
}

export default (withRouter(withStyles(styles)(UserShow)));