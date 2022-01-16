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

export interface FileSystemInterface {
  copyFile(src: string,
           dest: string,
           mode: number,
           callback: (err: Error | null) => void): void;
  existsSync(path: string): boolean;
  mkdir(path: string, 
        options: object, 
        callback: (err: Error | null) => void): void;
  readFileSync(path: string, encoding: string): string;
  writeFile(path: string, 
            data: string, 
            options: object | null, 
            callback: (err: Error | null) => void): void;
}

export interface OperativeSystemInterface {
  homedir(): string;
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
    return !!(window && window.process && window.process.type);
  }

  getFs(): FileSystemInterface {
    if (this.fs) {
      return this.fs as unknown as FileSystemInterface;
    }
    throw new ElectronError('fs is undefined.');
  }

  getOs(): OperativeSystemInterface {
    if (this.os) {
      return this.os as unknown as OperativeSystemInterface;
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
