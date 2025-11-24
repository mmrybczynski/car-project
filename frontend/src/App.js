// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { io } from 'socket.io-client';

import HomeView from './HomeView';
import PdcView from './PdcView'; // Pamiętaj o zmianie importu!
import TestPanel from './TestPanel';

const socket = io('http://localhost:3001');

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  
  // Stan globalny: Czy PDC jest aktywne?
  const [isPdcActive, setIsPdcActive] = useState(false);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // Kluczowa zmiana: App.js nasłuchuje statusu PDC
    socket.on('pdc_status', (status) => {
      console.log('App: Zmiana statusu PDC na:', status);
      setIsPdcActive(status);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pdc_status');
    };
  }, []);

  const handleOpenApp = (appName) => {
    console.log('Kliknięto aplikację:', appName);
    // Tu później dodasz logikę przełączania na radio/carplay
  };

  return (
    <BrowserRouter>
      <div style={styles.mainContainer}>
        
        {/* Pasek statusu */}
        
        {/*
        <div style={styles.topBar}>
          <span>Passat B7 System | <strong style={{color: isConnected ? '#4caf50' : 'red'}}>{isConnected ? 'ONLINE' : 'OFFLINE'}</strong></span>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.link}>Ekran Główny</Link>
            <Link to="/test" style={styles.link}>Emulator</Link>
          </div>
        </div>*/}

        {/* Zawartość główna */}
        <div style={styles.contentArea}>
            <Routes>
              {/* Główny widok ("Ekran w aucie") */}
              <Route path="/" element={
                  // LOGIKA PRZEŁĄCZANIA:
                  // Jeśli isPdcActive jest TRUE -> Pokaż PdcView
                  // Jeśli isPdcActive jest FALSE -> Pokaż HomeView
                  isPdcActive ? (
                    <PdcView socket={socket} />
                  ) : (
                    <HomeView onOpenApp={handleOpenApp} />
                  )
              } />
              
              {/* Widok inżynierski */}
              <Route path="/test" element={<TestPanel socket={socket} />} />
            </Routes>
        </div>

        <div style={styles.bottomBar}>
              <div style={styles.clima}>20</div>
              <div style={styles.homeButton}></div>
              <div style={styles.clima}>20</div>
        </div>

      </div>
    </BrowserRouter>
  );
}

const styles = {
  mainContainer: {
    width: '100%',
    backgroundColor: '#1c1c1e', // Bardziej "Applowe/Nowoczesne" tło
    minHeight: '100vh',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  topBar: {
    width: '100%',
    padding: '10px 20px',
    backgroundColor: '#000',
    borderBottom: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
    height: '50px'
  },
  navLinks: { display: 'flex', gap: '15px' },
  link: { color: '#0a84ff', textDecoration: 'none', fontSize: '14px' },
  contentArea: {
    width: '100%',
    flex: 1, // Zajmij resztę miejsca
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    //position: 'relative' // Ważne dla pozycjonowania
  },
  bottomBar: {
    width: '90%',
    margin: '0 auto 0 auto',
    padding: '10px 20px',
    height: '60px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  clima: {
    width: '60px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '25px'
  },
  homeButton: {
    width: '40px',
    height: '40px',
    border: '2px solid #fff'
  },
};

export default App;