import {Injectable} from '@angular/core';

import {ElectronService} from '../electron/electron.service';

export interface TagSetInterface {
  filenames: Set<string>;
}

export interface StringifyInterface {
  dataType: string;
  value: Array<any>;
}

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

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  readonly tagsMapCacheFilename = '';

  tagsStatus: Map<string,TagSetInterface>;

  constructor(private readonly electronService: ElectronService) {
    this.tagsStatus = new Map<string,TagSetInterface>();
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
  }

  public toggleTag(tag: string, filename: string): void {
    const tagSetInterface = this.tagsStatus.get(tag);
    if (tagSetInterface.filenames.has(filename)) {
      tagSetInterface.filenames.delete(filename);
      if (tagSetInterface.filenames.size == 0) {
        this.tagsStatus.delete(tag);
      }
    } else {
      tagSetInterface.filenames.add(filename);
    }
    //TODO: Add call to save the tags status.
  }

  saveTagsStatus(tagsStatus: Map<string, TagSetInterface>, 
                 destinationFolder: string): void {
    const serializedMap = JSON.stringify(Array.from(tagsStatus.entries()), null, 2);
    const targetFile = destinationFolder + '/' + this.tagsMapCacheFilename;
    this.electronService.fs.writeFile(targetFile, serializedMap, null, () => {
      console.log('TagsStatus map saved.');
    });
  }
}
