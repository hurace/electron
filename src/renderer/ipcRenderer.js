const { remote, ipcRenderer } = require('electron');

const { dialog, Menu } = remote;

const fs = require('fs');

document.title = '无标题';

const textDom = document.querySelector('#textDom');
// 文件是否需要保存
let isSave = false;
// 当前文件的路径
let currentFilePath = '';

textDom.oninput = function () {
    if (!isSave) {
        document.title += ' *';
    }
    isSave = true;
};

const contextmenuTemp = [
    {
        label: '复制',
        role: 'copy',
    },
    {
        label: '粘贴',
        role: 'paste',
    },
];

const menu = Menu.buildFromTemplate(contextmenuTemp);

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    menu.popup({ window: remote.getCurrentWindow() });
}, false);


ipcRenderer.on('action', (event, action) => {
    switch (action) {
        case 'new':
            askSaveFile();
        break;
        case 'open':
            dialog.showOpenDialog({
                filters: [
                    { name: 'All Files', extensions: ['*'] },
                  ],
            }, (path) => {
                if (path) {
                    const con = fs.readFileSync(path[0]);
                    textDom.value = con;
                }
            });
        break;
        case 'save':
            askSaveFile();
        break;
        case 'exit':
            askSaveFile();
            ipcRenderer.send('app-exit');
        break;
        default:
            console.log('什么都没有选择...');
        break;
    }
});

function saveFile() {
    let textValue = textDom.value;
    const path = dialog.showSaveDialog({
        title: '保存文件',
    });
    if (!path) return;
    if (!currentFilePath) {
        // console.log(path);
        currentFilePath = path;
    }
    fs.writeFile(currentFilePath, textValue, (error) => {
        if (error) {
            console.log(error);
        }
    });
    isSave = false;
    document.title = currentFilePath;
    textValue = '';
}


function askSaveFile() {
    if (isSave) {
        dialog.showMessageBox({
            type: 'question',
            message: '是否保存新的更改？',
            buttons: ['Yes', 'No'],
        }, (index) => {
            if (index === 0) {
                saveFile();
            }
        });
    }
}
