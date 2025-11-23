const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = 3001;

// Zmienna globalna dla interwału symulacji (jedna dla całego serwera)
let simulationInterval = null;

io.on('connection', (socket) => {
  console.log('✅ Klient połączony ID:', socket.id);

  // --- OBSŁUGA KOMEND Z TEST PANELU ---

  // 1. Sterowanie symulacją PDC
  socket.on('cmd_pdc_on', () => {
    if (!simulationInterval) {
      console.log('🟢 Uruchamiam symulację PDC');
      simulationInterval = setInterval(() => {
        const fakePdcData = {
          front_left: Math.floor(Math.random() * 5) + 1,
      front_sub_left: Math.floor(Math.random() * 5) + 1,
      front_right: Math.floor(Math.random() * 5) + 1,
      front_sub_right: Math.floor(Math.random() * 5) + 1,
      rear_left: Math.floor(Math.random() * 5) + 1,
      rear_sub_left: Math.floor(Math.random() * 5) + 1,
      rear_right: Math.floor(Math.random() * 5) + 1,
      rear_sub_right: Math.floor(Math.random() * 5) + 1,
        };
        // Wysyłamy do WSZYSTKICH podłączonych klientów (Dashboardu i Panelu)
        io.emit('pdc_data', fakePdcData);
      }, 1000);
      io.emit('server_log', 'Symulacja PDC włączona');
    }
  });

  socket.on('cmd_pdc_off', () => {
    if (simulationInterval) {
      console.log('🔴 Zatrzymuję symulację PDC');
      clearInterval(simulationInterval);
      simulationInterval = null;
      // Wysyłamy "zerowe" dane, żeby wyczyścić ekran
      io.emit('pdc_data', { front_left: 0, front_right: 0,front_sub_left: 0, front_sub_right: 0, rear_left: 0, rear_right: 0, rear_sub_left: 0, rear_sub_right: 0 });
      io.emit('server_log', 'Symulacja PDC wyłączona');
    }
  });

  socket.on('cmd_pdc_random', () => {
    console.log('🎲 Wylosowano pojedynczą wartość PDC');
    const randomData = {
      front_left: Math.floor(Math.random() * 5) + 1,
      front_sub_left: Math.floor(Math.random() * 5) + 1,
      front_right: Math.floor(Math.random() * 5) + 1,
      front_sub_right: Math.floor(Math.random() * 5) + 1,
      rear_left: Math.floor(Math.random() * 5) + 1,
      rear_sub_left: Math.floor(Math.random() * 5) + 1,
      rear_right: Math.floor(Math.random() * 5) + 1,
      rear_sub_right: Math.floor(Math.random() * 5) + 1,
    };
    io.emit('pdc_data', randomData);
    io.emit('server_log', 'Wysłano losowe dane PDC');
  });

  // 2. Sterowanie multimediami (Steering Wheel)
  // Lista komend: cmd_vol_up, cmd_vol_down, cmd_mute, cmd_next, cmd_prev
  socket.on('cmd_steering', (action) => {
    console.log(`kierownica: ${action}`);
    // Backend przekazuje to "udawane" kliknięcie do Dashboardu jako zdarzenie 'steering_wheel'
    io.emit('steering_wheel', action);
    io.emit('server_log', `Wykonano akcję: ${action}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Klient rozłączony ID:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Backend gotowy na porcie ${PORT}`);
});