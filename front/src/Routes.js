import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import Register from "./containers/Register/Register";
import {useSelector} from "react-redux";

const Routes = () => {

    const user = useSelector(state => state.users.user);

    const LoggedInRoute = ({isAllowed, ...props}) => (
        isAllowed ? <Redirect to='/'/> : <Route {...props} />
    );

    return (
        <>
            <Switch>
                <Route path='/' exact component={MainPage}/>
                <LoggedInRoute isAllowed={user} path="/register" exact component={Register}/>
                <Route render={() => <h1>Not found</h1>}/>
            </Switch>
        </>
    );
};

export default Routes;