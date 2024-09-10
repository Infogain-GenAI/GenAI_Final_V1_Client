import React,{useState} from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter,Route,Link } from "react-router-dom";
import App from "./App";
import ConfigurationScreen from "./ConfigurationScreen";
import PieSettings from "./PieSettings";
import appConfigData from "./appconfig.json"
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import {PublicClientApplication, EventType} from '@azure/msal-browser';
import jsonData from './ConfigurationScreenData.json';
import Support from "./Support";
import Aboutus from "./Aboutus";

const root = ReactDOM.createRoot(document.getElementById('root'));
const pca = new PublicClientApplication({
    auth: {
        clientId: appConfigData.clientId, // "3b89be67-191b-457c-b29d-d62fa3174f33",// 'cf78d13c-cda7-4405-8bb1-eaf2632dd3df',
        authority: appConfigData.authority, //'https://login.microsoftonline.com/9f820413-72a6-4f25-885a-de1e06fae83a',
        redirectUri: '/'
    },
    cache:  {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false
    }
});
pca.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS) {
        console.log(event);
        pca.setActiveAccount(event.payload.account);
        //window.location.href = '/';
    } else if (event.eventType === EventType.LOGIN_FAILURE) {
        console.log('login failure');
    }
});
let jsonConfData = JSON.stringify(jsonData); //store the json data for default app settings in a variable

root.render(
    <React.StrictMode>
        <BrowserRouter>
   
<Route exact path="/config" render={(props) => <ConfigurationScreen {...props} msalInstance={pca} jsonConfData={jsonConfData}/>}  />
<Route exact path="/pie" render={(props) => <PieSettings {...props} msalInstance={pca} jsonConfData={jsonConfData}/>}  />
<Route exact path="/" render={(props) => <App {...props} msalInstance={pca} jsonConfData={jsonConfData}/>}  />
<Route  path="/aboutus" render={(props) => <Aboutus {...props} msalInstance={pca}  />}/>
<Route  path="/support" render={(props) => <Support {...props} msalInstance={pca} />}/>
        </BrowserRouter>
    </React.StrictMode>
);