const { app, BrowserWindow } = require('electron');
const path = require('path');

// Bỏ qua lỗi chứng chỉ SSL (chỉ nên sử dụng khi phát triển)
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');

// Hàm tạo cửa sổ chính
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false, // Cho phép truy cập trực tiếp vào Node.js API từ frontend
      enableRemoteModule: true // Bật khả năng sử dụng module Electron từ render process
    }
  });

  // Tải file room.html vào cửa sổ
  mainWindow.loadFile('room.html');

  // Mở DevTools (tùy chọn cho phát triển)
  mainWindow.webContents.openDevTools();
}

// Khi Electron khởi động, tạo cửa sổ chính
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // Mở cửa sổ mới nếu không có cửa sổ nào hiện có trên MacOS
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Thoát khi tất cả các cửa sổ đóng (trừ MacOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
