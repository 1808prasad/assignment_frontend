import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Redirect
} from 'react-router-dom';
import UserList from './components/userList';

function App() {
  return (
    <div className="App">
		<UserList />
    </div>
  );
}

export default App;
