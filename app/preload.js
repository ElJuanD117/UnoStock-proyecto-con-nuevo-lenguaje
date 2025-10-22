const {contextBridge,ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
        os:()=>require('os'),
        fs:()=>require('fs'),
        uid:()=>require('uuid').v1(),
        pdf:()=>require('html-pdf'),
        OpenWindow:(channel,data)=>{

            ipcRenderer.send(channel,data); 
        },
        send:(channel, data) => {
              
            ipcRenderer.send(channel, data); 
   
        },
        receive:(channel, data) => {
            
            ipcRenderer.on(channel,data);
        },
      minimizeWindow: () => ipcRenderer.send('minimize-window'),
      maximizeWindow: () => ipcRenderer.send('maximize-window'),
      closeWindow: () => ipcRenderer.send('close-window')
        
        
    }
);


  

