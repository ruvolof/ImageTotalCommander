import {Injectable} from '@angular/core';

import {ElectronService} from '../electron/electron.service';

export interface TagSetInterface {
  filenames: Set<string>;
}

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  readonly tagsMapCacheFilename = '.itc_tags_map';

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
