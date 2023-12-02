import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import CollectionScreen from './screens/Collection';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' Component={Home} />
        <Route path='/collection/:slug' Component={CollectionScreen} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
