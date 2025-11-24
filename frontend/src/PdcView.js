// frontend/src/PdcView.js
import React, { useState, useEffect } from 'react';

function PdcView({ socket }) {
  const [pdcData, setPdcData] = useState({ front_left: 0, front_right: 0, rear_left: 0, rear_right: 0 });

  useEffect(() => {
    socket.on('pdc_data', (data) => setPdcData(data));
    return () => {
      socket.off('pdc_data');
    };
  }, [socket]);

  const getColor = (value) => {
    if (value === 0) return '#555'; // Brak sygnału / daleko
    if (value <= 1) return '#ff0000'; // STOP
    if (value <= 3) return '#ffcc00'; // Ostrzeżenie
    return '#00ff00';                 // OK
  };

  return (
    <div style={styles.overlay}>
      <h2 style={{marginTop: 0}}>Asystent Parkowania</h2>
      <div style={styles.carContainer}>
        {/* Przód */}
        <div style={styles.sensorRow}>
          <SensorBox label="FL" value={pdcData.front_left} color={getColor(pdcData.front_left)} />
          <div style={styles.carBodyFront}>PRZÓD</div>
          <SensorBox label="FR" value={pdcData.front_right} color={getColor(pdcData.front_right)} />
        </div>

        {/* Środek */}
        <div style={styles.carBodyCenter}>
            <span style={{color: '#444', fontSize: '30px'}}>VW</span>
        </div>

        {/* Tył */}
        <div style={styles.sensorRow}>
          <SensorBox label="RL" value={pdcData.rear_left} color={getColor(pdcData.rear_left)} />
          <div style={styles.carBodyRear}>TYŁ</div>
          <SensorBox label="RR" value={pdcData.rear_right} color={getColor(pdcData.rear_right)} />
        </div>
      </div>
    </div>
  );
}

const SensorBox = ({ label, value, color }) => (
  <div style={{ ...styles.sensor, backgroundColor: color }}>
    <strong>{label}</strong><br />{value}
  </div>
);

const styles = {
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Ciemne tło, żeby zasłonić HomeView
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    borderRadius: '10px'
  },
  carContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#333', padding: '20px', borderRadius: '15px', width: '300px' },
  sensorRow: { display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '10px', marginTop: '10px' },
  sensor: { width: '60px', height: '60px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#000', fontWeight: 'bold', transition: 'background 0.1s' },
  carBodyFront: { width: '100px', textAlign: 'center', color: '#aaa', borderBottom: '2px solid #666' },
  carBodyRear: { width: '100px', textAlign: 'center', color: '#aaa', borderTop: '2px solid #666' },
  carBodyCenter: { height: '150px', width: '120px', backgroundColor: '#222', display: 'flex', justifyContent: 'center', alignItems: 'center' }
};

export default PdcView;