// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'; // Importujemy routing
import { io } from 'socket.io-client';

import Dashboard from './Dashboard';
import TestPanel from './TestPanel';

// Jedno wspólne połączenie dla całej aplikacji
const socket = io('http://localhost:3001');

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <BrowserRouter>
      <div style={styles.mainContainer}>
        
        {/* Pasek statusu widoczny zawsze na górze (dla wygody) */}
        <div style={styles.topBar}>
          <span>System Passat B7 | Status: <strong style={{color: isConnected ? '#4caf50' : 'red'}}>{isConnected ? 'ONLINE' : 'OFFLINE'}</strong></span>
          
          {/* Menu nawigacyjne (tylko dla wygody dewelopera, w aucie można ukryć) */}
          <div style={styles.navLinks}>
            <Link to="/" style={styles.link}>Dashboard</Link>
            <Link to="/test" style={styles.link}>Test Panel</Link>
          </div>
        </div>

        {/* Tutaj React decyduje co wyświetlić na podstawie adresu URL */}
        <Routes>
          {/* Adres główny: "/" -> Wyświetl Dashboard */}
          <Route path="/" element={<Dashboard socket={socket} />} />
          
          {/* Adres testowy: "/test" -> Wyświetl Panel Testowy */}
          <Route path="/test" element={<TestPanel socket={socket} />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

const styles = {
  mainContainer: {
    backgroundColor: '#282c34',
    minHeight: '100vh',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  topBar: {
    width: '100%',
    padding: '10px 20px',
    backgroundColor: '#111',
    borderBottom: '1px solid #444',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  navLinks: {
    display: 'flex',
    gap: '15px'
  },
  link: {
    color: '#61dafb',
    textDecoration: 'none',
    fontSize: '14px'
  }
};

export default App;