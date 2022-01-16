import {TestBed} from '@angular/core/testing';

import {ElectronService, FileSystemInterface, OperativeSystemInterface} from '../electron/electron.service';
import {TagsService, TagSetInterface, mapAndSetReplacer, mapAndSetReviver} from './tags.service';

describe('TagsService', () => {
  let fakeElectronService: ElectronService;
  let service: TagsService;

  beforeEach(() => {
    const fakeOs: OperativeSystemInterface = {
      homedir: () => '/home/user',
    }
    const fakeFs: FileSystemInterface = {
      existsSync: (path) => true,
      mkdir: (part, options, callback) => null,
      readFileSync: (path, encoding) => '[]',
      writeFile: (path, data, options, callback) => null,
    }
    fakeElectronService = jasmine.createSpyObj('ElectronService', ['getOs', 'getFs']);
    fakeElectronService.getOs = () => fakeOs;
    fakeElectronService.getFs = () => fakeFs;
    TestBed.configureTestingModule({
      providers: [
        {provide: ElectronService, useValue: fakeElectronService},
      ],
    });
    service = TestBed.inject(TagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('adds filename to new tag', () => {
    service.addTag('new_tag', 'file_name');

    const expectedTagsStatus = 
        new Map<string,TagSetInterface>().set(
          'new_tag', {filenames: new Set<string>().add('file_name')});
    expect(service.tagsStatus).toEqual(expectedTagsStatus);
  });

  it('adds filename to existing tag', () => {
    service.addTag('new_tag', 'file_1');
    service.addTag('new_tag', 'file_2');

    const expectedTagsStatus = 
        new Map<string,TagSetInterface>().set(
          'new_tag', 
          {filenames: new Set<string>().add('file_1').add('file_2')});
    expect(service.tagsStatus).toEqual(expectedTagsStatus);
  });

  it('toogles tag status', () => {
    service.addTag('tag', 'file_1');
    service.toggleTag('tag', 'file_2');

    expect(service.tagsStatus.get('tag')?.filenames.has('file_2')).toBeTrue();
    
    service.toggleTag('tag', 'file_2');

    expect(service.tagsStatus.get('tag')?.filenames.has('file_2')).toBeFalse();
  });

  it('removes tag when removing last filename entry', () => {
    service.addTag('tag', 'file_1');
    service.toggleTag('tag', 'file_1');

    expect(service.tagsStatus.size).toEqual(0);
  });

  describe('TagsStatus serialization', () => {
    it('works', () => {
      const controlTagsStatus = new Map<string, TagSetInterface>().set(
        'tag_name', {
          filenames: new Set<string>().add('file_name'),
        }
      );
      const serialized = JSON.stringify(controlTagsStatus, mapAndSetReplacer);
      const resultTagsStatus = JSON.parse(serialized, mapAndSetReviver);
      
      expect(controlTagsStatus).toEqual(resultTagsStatus);
      expect(resultTagsStatus.size).toEqual(1);
      expect(Array.from(resultTagsStatus.keys())).toEqual(['tag_name']);
      expect(resultTagsStatus.get('tag_name').filenames.size).toEqual(1);
      expect(Array.from(resultTagsStatus.get('tag_name').filenames))
        .toEqual(['file_name']);
    });
  });
});
