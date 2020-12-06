import React from 'react';
import './App.css';
import CssBaseline from "@material-ui/core/CssBaseline";
import {ToastContainer} from "react-toastify";
import Routes from "./Routes";
import AppToolbar from "./components/UI/Toolbar/AppToolbar";

const App = () => {

  return (
      <div className='App'>
        <CssBaseline/>
        <ToastContainer
            draggable={false}
            hideProgressBar
            autoClose={3000}
            style={{
              width: 250,
              transform: window.innerWidth >= 640 ? null : "translateX(calc(100vw - 100%))"
            }}
        />
          <AppToolbar/>
          <Routes/>
      </div>
  );
};

export default App;