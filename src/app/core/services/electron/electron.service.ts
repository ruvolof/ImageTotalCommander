import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as fs from 'fs';
import * as os from 'os';

class ElectronError extends Error {
  constructor(msg: string) {
      super(msg);
      Object.setPrototypeOf(this, ElectronError.prototype);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer?: typeof ipcRenderer;
  webFrame?: typeof webFrame;
  fs?: typeof fs;
  os?: typeof os;

  get isElectron(): boolean {
    console.log('Checking if electron')
    //return !!(window && window.process && window.process.type);
    return true;
  }

  getFs(): typeof fs {
    if (this.fs) {
      return this.fs;
    }
    throw new ElectronError('fs is undefined.');
  }

  getOs(): typeof os {
    if (this.os) {
      return this.os;
    }
    throw new ElectronError('os is undefined.');
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;

      this.fs = window.require('fs');
      this.os = window.require('os');
    }
  }
}
