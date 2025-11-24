// frontend/src/HomeView.js
import React from 'react';

function HomeView({ onOpenApp }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={{fontSize: '24px'}}>Passat B7 Infotainment</span>
        <span style={{fontSize: '18px'}}>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>

      <div style={styles.grid}>
        {/* Ikonka CarPlay */}
        <div style={styles.iconBox} onClick={() => onOpenApp('carplay')}>
          <div style={{...styles.iconCircle, background: '#4cd964'}}>C</div>
          <span>CarPlay</span>
        </div>

        {/* Ikonka Radia */}
        <div style={styles.iconBox} onClick={() => onOpenApp('radio')}>
          <div style={{...styles.iconCircle, background: '#ff9500'}}>R</div>
          <span>Radio FM</span>
        </div>

        {/* Ikonka Ustawień */}
        <div style={styles.iconBox} onClick={() => onOpenApp('settings')}>
          <div style={{...styles.iconCircle, background: '#5ac8fa'}}>S</div>
          <span>Ustawienia</span>
        </div>

        {/* Ikonka Telefonu */}
        <div style={styles.iconBox} onClick={() => onOpenApp('phone')}>
          <div style={{...styles.iconCircle, background: '#ff3b30'}}>T</div>
          <span>Telefon</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '40px',
    color: 'white'
  },
  header: {
    width: '95%',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '50px',
    borderBottom: '1px solid #444',
    paddingBottom: '10px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
  },
  iconBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.1s'
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
  }
};

export default HomeView;