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

  constructor(private readonly electronService: ElectronService) {}

  saveTagsStatus(tagsStatus: Map<string, TagSetInterface>, 
                 destinationFolder: string): void {
    const serializedMap = JSON.stringify(Array.from(tagsStatus.entries()), null, 2);
    const targetFile = destinationFolder + '/' + this.tagsMapCacheFilename;
    this.electronService.fs.writeFile(targetFile, serializedMap, null, () => {
      console.log('TagsStatus map saved.');
    });
  }
}
