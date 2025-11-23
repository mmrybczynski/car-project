// frontend/src/Dashboard.js
import React, { useState, useEffect } from 'react';

// Ten komponent odpowiada tylko za WYŚWIETLANIE (to jest Twój widok produkcyjny)
function Dashboard({ socket }) {
  const [pdcData, setPdcData] = useState({ front_left: 0, front_right: 0,front_sub_left: 0, front_sub_right: 0, rear_left: 0, rear_right: 0, rear_sub_left: 0, rear_sub_right: 0 });
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    // Nasłuchujemy danych tylko gdy ten widok jest włączony
    socket.on('pdc_data', (data) => setPdcData(data));
    socket.on('steering_wheel', (action) => {
      setLastAction(action);
      setTimeout(() => setLastAction(null), 2000);
    });

    return () => {
      socket.off('pdc_data');
      socket.off('steering_wheel');
    };
  }, [socket]);

  const getColor = (value) => {
    if (value === 0) return '#555';
    if (value <= 1) return '#ff0000';
    if (value <= 3) return '#ffcc00';
    return '#00ff00';
  };

  return (
    <div style={styles.carContainer}>
      <h2>Passat B7 Dashboard</h2>
      
      {/* Przód */}
      <div style={styles.sensorRow}>
        <SensorBox label="FL" value={pdcData.front_left} color={getColor(pdcData.front_left)} />
        <SensorBox label="FSL" value={pdcData.front_sub_left} color={getColor(pdcData.front_sub_left)} />
        <div style={styles.carBodyFront}>PRZÓD</div>
        <SensorBox label="FSR" value={pdcData.front_sub_right} color={getColor(pdcData.front_sub_right)} />
        <SensorBox label="FR" value={pdcData.front_right} color={getColor(pdcData.front_right)} />
        
      </div>

      {/* Środek */}
      <div style={styles.carBodyCenter}>
          {lastAction && <div style={styles.actionToast}>{lastAction}</div>}
          {!lastAction && <span style={{color: '#444', fontSize: '30px'}}>VW</span>}
      </div>

      {/* Tył */}
      <div style={styles.sensorRow}>
        <SensorBox label="RL" value={pdcData.rear_left} color={getColor(pdcData.rear_left)} />
        <SensorBox label="RSL" value={pdcData.rear_sub_left} color={getColor(pdcData.rear_sub_left)} />
        <div style={styles.carBodyRear}>TYŁ</div>
        <SensorBox label="RSR" value={pdcData.rear_sub_right} color={getColor(pdcData.rear_sub_right)} />
        <SensorBox label="RR" value={pdcData.rear_right} color={getColor(pdcData.rear_right)} />
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
  carContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#444', padding: '20px', borderRadius: '15px', width: '300px', marginTop: '50px' },
  sensorRow: { display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '10px', marginTop: '10px' },
  sensor: { width: '60px', height: '60px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#000', fontWeight: 'bold', transition: 'background 0.3s' },
  carBodyFront: { width: '100px', textAlign: 'center', color: '#aaa', borderBottom: '2px solid #666' },
  carBodyRear: { width: '100px', textAlign: 'center', color: '#aaa', borderTop: '2px solid #666' },
  carBodyCenter: { height: '150px', width: '120px', backgroundColor: '#222', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  actionToast: { backgroundColor: '#007bff', padding: '5px 10px', borderRadius: '5px', fontSize: '14px', color: 'white' }
};

export default Dashboard;