const { Menu, BrowserWindow, ipcMain, app } = require('electron');

const win = BrowserWindow.getFocusedWindow();
const template = [
    {
        label: '文件',
        submenu: [
            {
                label: '新建',
                accelerator: 'Ctrl+N',
                click() {
                    win.webContents.send('action', 'new');
                },
            },
            {
                label: '打开',
                accelerator: 'Ctrl+O',
                click() {
                    win.webContents.send('action', 'open');
                },
            },
            {
                label: '另存为',
                accelerator: 'Ctrl+S',
                click() {
                    win.webContents.send('action', 'save');
                },
            },
            {
                type: 'separator',
            },
            {
               label: '打印',
               accelerator: 'Ctrl+P',
               click() {
                   win.webContents.print();
               },
            },
            {
                label: '退出',
                accelerator: 'Ctrl+Q',
                click() {
                    win.webContents.send('action', 'exit');
                },
            },
        ],
    },
    {
        label: '视图',
        submenu: [
            {
                label: '重新载入',
                role: 'reload',
            },
            {
                label: '调试工具',
                role: 'toggledevtools',
            },
        ],
    },
];

const topMenu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(topMenu);

ipcMain.on('app-exit', () => {
    app.quit();
});
