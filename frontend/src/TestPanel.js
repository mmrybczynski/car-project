// frontend/src/TestPanel.js
//import React from 'react';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function TestPanel({ socket }) {

  const [isConnected, setIsConnected] = useState(socket.connected);

   useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
   });
  
  // Funkcje pomocnicze do wysyłania komend
  const sendPdcCmd = (cmd) => {
    socket.emit(cmd);
  };

  const sendSteeringCmd = (action) => {
    socket.emit('cmd_steering', action);
  };

  return (
    <div style={styles.panel}>
<div style={styles.topBar}>
          <span>Passat B7 System | <strong style={{color: isConnected ? '#4caf50' : 'red'}}>{isConnected ? 'ONLINE' : 'OFFLINE'}</strong></span>
          <div style={styles.navLinks}>
            <Link to="/" style={styles.link}>Ekran Główny</Link>
            <Link to="/test" style={styles.link}>Emulator</Link>
          </div>
        </div>
      <h2>🛠️ Panel Testowy (Emulator)</h2>
      
      <div style={styles.section}>
        <h3>Sterowanie Radiem (Kierownica)</h3>
        <div style={styles.buttonGrid}>
          <button style={styles.btn} onClick={() => sendSteeringCmd('vol_up')}>🔊 Vol +</button>
          <button style={styles.btn} onClick={() => sendSteeringCmd('vol_down')}>🔉 Vol -</button>
          <button style={styles.btnWarning} onClick={() => sendSteeringCmd('mute')}>🔇 Mute</button>
          <button style={styles.btn} onClick={() => sendSteeringCmd('prev_song')}>⏮ Prev</button>
          <button style={styles.btn} onClick={() => sendSteeringCmd('next_song')}>⏭ Next</button>
        </div>
      </div>

      <div style={styles.section}>
        <h3>Czujniki Parkowania (PDC)</h3>
        <div style={styles.buttonGrid}>
          <button style={styles.btnSuccess} onClick={() => sendPdcCmd('cmd_pdc_on')}>PDC ON</button>
          <button style={styles.btnSuccess} onClick={() => sendPdcCmd('cmd_pdc_off')}>PDC OFF</button>
          <button style={styles.btnSuccess} onClick={() => sendPdcCmd('cmd_pdc_start')}>▶️ PDC Start (Auto)</button>
          <button style={styles.btn} onClick={() => sendPdcCmd('cmd_pdc_random')}>🎲 Losowa Wartość</button>
          <button style={styles.btnDanger} onClick={() => sendPdcCmd('cmd_pdc_stop')}>⏹️ PDC Stop</button>
        </div>
      </div>

      <p style={{fontSize: '12px', color: '#aaa'}}>Kliknij przycisk, aby wysłać komendę do Backendu.</p>
    </div>
  );
}

const styles = {
  panel: {
    padding: '20px',
    backgroundColor: '#eee',
    color: '#333',
    borderRadius: '8px',
    marginTop: '20px',
    maxWidth: '400px',
    textAlign: 'center'
  },
  link: { color: '#0a84ff', textDecoration: 'none', fontSize: '14px' },
  section: { marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' },
  buttonGrid: { display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' },
  btn: { padding: '10px 15px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' },
  btnSuccess: { padding: '10px 15px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' },
  btnDanger: { padding: '10px 15px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' },
  btnWarning: { padding: '10px 15px', cursor: 'pointer', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '5px' }
};

export default TestPanel;