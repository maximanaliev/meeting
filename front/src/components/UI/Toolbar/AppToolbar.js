import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import UserMenu from "./UserMenu";
import {logoutUser} from "../../../store/actions/usersActions";
import logo from '../../../assets/images/logo.png';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";

const useStyles = makeStyles(() => ({
    main: {
        backgroundColor: "#DFDFDF",
        position: "fixed"
    },
    toolBottom: {
        marginBottom: '30px'
    },
    image: {
        width: "100%"
    },
    right: {
        marginLeft: 'auto',
        display: 'flex',
        justifyContent: 'space-between'
    },
    link: {
        textDecoration: 'none',
        margin: '0 10px',
        fontSize: '20px'
    },
}));

const AppToolbar = () => {

    const user = useSelector(state => state.users.user);
    const dispatch = useDispatch();

    const classes = useStyles();

    return (
        <>
            <AppBar className={classes.main}>
                <Toolbar>
                    <Link to="/"><img className={classes.image} src={logo} alt=""/></Link>

                    {user ?
                        <UserMenu
                            user={user}
                            logout={() => dispatch(logoutUser())}
                        /> : null}
                </Toolbar>
            </AppBar>
            <Toolbar className={classes.toolBottom}/>
        </>
    );
};

export default AppToolbar;