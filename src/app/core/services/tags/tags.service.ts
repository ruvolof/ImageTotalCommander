import {Injectable} from '@angular/core';

import {ElectronService} from '../electron/electron.service';

export interface TagSetInterface {
  filenames: Set<string>;
}

export interface StringifyInterface {
  dataType: string;
  value: Array<any>;
}

type TagsStatus = Map<string,TagSetInterface>;
type TagsStatusTypes = Map<string,TagSetInterface>|Set<string>|string;

export function mapAndSetReplacer(key: string, value: TagsStatusTypes): any {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    } as StringifyInterface;
  }
  if (value instanceof Set) {
    return {
      dataType: 'Set',
      value: Array.from(value)
    } as StringifyInterface;
  }
  return value;
}

export function mapAndSetReviver(key: string, value: unknown): any {
  if(typeof value === 'object' && value !== null) {
    const castedValue = value as StringifyInterface;
    if (castedValue.dataType === 'Map') {
      return new Map(castedValue.value);
    }
    if (castedValue.dataType === 'Set') {
      return new Set(castedValue.value);
    }
  }
  return value;
}

const localStorageFolderPath = '/.local/share/ImageTotalCommander';
const localTagsStatusFilePath = '/TagsStatus.json';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  tagsStatus: TagsStatus;
  absLocalStorageFolder: string;
  absTagsStatusStorageFile: string;

  constructor(private readonly electronService: ElectronService) {
    this.tagsStatus = new Map<string,TagSetInterface>();
    this.absLocalStorageFolder = 
      this.electronService.getOs().homedir() + localStorageFolderPath;
    this.absTagsStatusStorageFile = 
      this.absLocalStorageFolder + localTagsStatusFilePath;
    this.initializeTagsService();
  }

  private initializeTagsService() {
    this.electronService.getFs().mkdir(
      this.absLocalStorageFolder, { recursive: true }, (err) => {
        if (err) throw err;
        console.log('Initial storage folder created.');
      });
    if (this.electronService.getFs().existsSync(this.absTagsStatusStorageFile)) {
      const serializedString = this.electronService.getFs().readFileSync(
        this.absTagsStatusStorageFile, 'utf8');
      this.tagsStatus = 
        new Map(JSON.parse(serializedString, mapAndSetReviver));
    }
  }

  public addTag(tag: string, filename: string): void {
    let tagSetInterface = this.tagsStatus.get(tag);
    if (tagSetInterface === undefined) {
      tagSetInterface = {
        filenames: new Set<string>(),
      };
      this.tagsStatus.set(tag, tagSetInterface);
    }
    tagSetInterface.filenames.add(filename);
    this.saveTagsStatus();
  }

  public toggleTag(tag: string, filename: string): void {
    const tagSetInterface = this.tagsStatus.get(tag) as TagSetInterface;
    if (tagSetInterface.filenames.has(filename)) {
      tagSetInterface.filenames.delete(filename);
      if (tagSetInterface.filenames.size == 0) {
        this.tagsStatus.delete(tag);
      }
    } else {
      tagSetInterface.filenames.add(filename);
    }
    this.saveTagsStatus();
  }

  saveTagsStatus(): void {
    const serializedMap = JSON.stringify(
      Array.from(this.tagsStatus.entries()), mapAndSetReplacer, 2);
    this.electronService.getFs().writeFile(
      this.absTagsStatusStorageFile, serializedMap, null, (err) => {
        if (err) throw err;
        console.log('TagsStatus map saved.');
      });
  }
}
