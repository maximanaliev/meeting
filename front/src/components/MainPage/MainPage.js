import React from 'react';
import {useSelector} from "react-redux";
import Login from "../../containers/Login/Login";
import CreateEvent from "../Event/CreateEvent";

const MainPage = () => {

    const user = useSelector(state => state.users.user);
    return (
        <div>
            {user ? <CreateEvent/> : <Login/>}
        </div>
    );
};

export default MainPage;