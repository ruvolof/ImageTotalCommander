import {TestBed} from '@angular/core/testing';

import {TagsService, TagSetInterface} from './tags.service';

describe('TagsService', () => {
  let service: TagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
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

    expect(service.tagsStatus.get('tag').filenames.has('file_2')).toBeTrue();
    
    service.toggleTag('tag', 'file_2');

    expect(service.tagsStatus.get('tag').filenames.has('file_2')).toBeFalse();
  });

  it('removes tag when removing last filename entry', () => {
    service.addTag('tag', 'file_1');
    service.toggleTag('tag', 'file_1');

    expect(service.tagsStatus.size).toEqual(0);
  });
});
