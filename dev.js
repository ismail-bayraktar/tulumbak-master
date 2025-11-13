#!/usr/bin/env node

/**
 * Start both frontend and backend with clean ports
 * Usage: node dev.js
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Tulumbak Development Environment\n');
console.log('━'.repeat(60));

// Start backend
console.log('\n📦 Backend başlatılıyor (Port 4001)...\n');
const backend = spawn('npm', ['run', 'start:clean'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Wait a bit for backend to start
setTimeout(() => {
  // Start frontend
  console.log('\n🎨 Frontend başlatılıyor (Port 3000)...\n');
  const frontend = spawn('npm', ['run', 'dev:clean'], {
    cwd: path.join(__dirname, 'frontend-new'),
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (err) => {
    console.error('❌ Frontend başlatma hatası:', err);
  });

  frontend.on('exit', (code) => {
    console.log('\n👋 Frontend kapatıldı');
    backend.kill();
    process.exit(code || 0);
  });
}, 3000);

backend.on('error', (err) => {
  console.error('❌ Backend başlatma hatası:', err);
  process.exit(1);
});

backend.on('exit', (code) => {
  console.log('\n👋 Backend kapatıldı');
  process.exit(code || 0);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n👋 Development environment kapatılıyor...');
  backend.kill('SIGINT');
  process.exit(0);
});

console.log('\n💡 İpucu: Ctrl+C ile her ikisini birden kapatabilirsiniz\n');
console.log('━'.repeat(60));
