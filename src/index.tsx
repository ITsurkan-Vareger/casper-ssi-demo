import dayjs from 'dayjs';
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './common/store';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import "reflect-metadata";
// import initSqlJs from 'sql.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
//window.SQL = initSqlJs;

const utc = require('dayjs/plugin/utc')
dayjs.extend(utc);


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

Modal.setAppElement('#root');