import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import AppWithRouter from "./App";
import ErrorBoundaryPage from "./pages/errorboundary/ErrorBoundaryPage";

if(localStorage.getItem("theme")==="natural"){
    document.documentElement.style.setProperty('--sub-color', "#d0ffd6");
    document.documentElement.style.setProperty('--primary-color', "#8cd09f");
}
else if(localStorage.getItem("theme")==="sky"){
    document.documentElement.style.setProperty('--sub-color', "#9FFCDF");
    document.documentElement.style.setProperty('--primary-color', "#52AD9C");
}
else{
    localStorage.setItem("theme","default")
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundaryPage>
        <AppWithRouter/>
    </ErrorBoundaryPage>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
