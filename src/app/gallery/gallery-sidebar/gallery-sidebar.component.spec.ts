/* eslint-disable @typescript-eslint/unbound-method */
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatCheckboxHarness} from '@angular/material/checkbox/testing';
import {MatInputHarness} from '@angular/material/input/testing';
import {MatRadioButtonHarness} from '@angular/material/radio/testing';

import {GalleryModule} from '../gallery.module';
import {GallerySidebarComponent} from './gallery-sidebar.component';
import {TagSetInterface, TagsService, TagsStatus} from '../../core/services/tags/tags.service';
import {SelectedFolderInterface} from '../gallery.component';
import { splitAtColon } from '@angular/compiler/src/util';
import { makeWebkitFileInterface } from '../gallery.component.spec';

describe('GallerySidebarComponent', () => {
  let component: GallerySidebarComponent;
  let fixture: ComponentFixture<GallerySidebarComponent>;
  let loader: HarnessLoader;
  let fakeTagsService: TagsService;
  let fakeTagsStatus: TagsStatus;

  beforeEach(async () => {
    fakeTagsStatus = 
      new Map<string,TagSetInterface>()
        .set('tag1', {filenames: new Set<string>().add('/path/to/file1.jpg')})
        .set('tag2', {filenames: new Set<string>().add('/path/to/file2.jpg')})
    fakeTagsService = jasmine.createSpyObj(
      'TagsService', ['tagsStatus', 'addTag', 'toggleTag']);
    fakeTagsService.tagsStatus = fakeTagsStatus;
    fakeTagsService.addTag = jasmine.createSpy();
    fakeTagsService.toggleTag = jasmine.createSpy();
    
    await TestBed.configureTestingModule({
      imports: [GalleryModule],
      declarations: [GallerySidebarComponent],
      providers: [
        {provide: TagsService, useValue: fakeTagsService},
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GallerySidebarComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.imagesPaths = ['/path/to/file1.jpg', '/path/to/file2.jpg'];
    component.selectedImageIndex = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the Close Slider button', () => {
    expect(fixture.nativeElement.textContent).toContain('Close Slider');
  });

  it('sets the selectedImageIndex to -1 when closing slider', async () => {
    spyOn(component.selectedImageIndexChange, 'emit');
    const closeSliderButton = await loader.getHarness(
      MatButtonHarness.with({selector: '#close-slider-button'}));
    await closeSliderButton.click();

    expect(component.selectedImageIndex).toEqual(-1);
    expect(component.selectedImageIndexChange.emit)
      .toHaveBeenCalledOnceWith(-1);
  });

  describe('Folder Selection', () => {
    beforeEach(() => {
      spyOn(component.selectedFolder, 'emit');
    });

    it('emits imagesInFolder after processing images', () => {
      component.onDirectorySelected({files: []} as unknown as EventTarget);
  
      expect(component.selectedFolder.emit).toHaveBeenCalledOnceWith({
        absolutePath: '',
        files: []
      } as SelectedFolderInterface);
    });

    it('processes the file list', () => {
      const file1 = makeWebkitFileInterface('1');
      const file2 = makeWebkitFileInterface('2');
      const file3 = makeWebkitFileInterface('3', 'text/plain');
      component.onDirectorySelected(
        {files: [file1, file2, file3]} as unknown as EventTarget);

      expect(component.selectedFolder.emit).toHaveBeenCalledOnceWith({
        absolutePath: '/abs/path',
        files: [file1, file2],
      } as SelectedFolderInterface);
    });

    it('handles unexpected inputs', () => {
      expect(() => component.onDirectorySelected(null)).toThrowError(
        'Unexpected null value from directory select.')
    });
  });

  describe('Tag Interface', () => {
    it('shows available tags', () => {
      expect(fixture.nativeElement.textContent).toContain('tag1');
      expect(fixture.nativeElement.textContent).toContain('tag2');
    });

    it('checks proper checkboxes by file', async () => {
      const tagCheckboxes = await loader.getAllHarnesses(
        MatCheckboxHarness.with({selector: '.tag_checkbox'}));
      
        expect(tagCheckboxes.length).toEqual(2);
        expect(await tagCheckboxes[0].isChecked()).toBeTrue();
        expect(await tagCheckboxes[1].isChecked()).toBeFalse();
    });

    it('properly adds a tag', async () => {
      const tagInput = await loader.getHarness(
        MatInputHarness.with({selector: '#new-tag-input'}));
      const newTagButton = await loader.getHarness(
        MatButtonHarness.with({selector: '#add-new-tag-button'}));
      await tagInput.setValue('new_tag');
      expect(component.newTag).toEqual('new_tag');
      console.log(component.imagesPaths);
      await newTagButton.click();

      expect(fakeTagsService.addTag).toHaveBeenCalledOnceWith(
        'new_tag', '/path/to/file1.jpg');
    });

    it('properly handles click on tag checkboxes', async () => {
      const tagCheckbox = await loader.getHarness(
        MatCheckboxHarness.with({selector: '.tag_checkbox'}));
      await tagCheckbox.uncheck();

      expect(fakeTagsService.toggleTag).toHaveBeenCalledOnceWith(
        'tag1', '/path/to/file1.jpg');
    });

    it('emits selected tag when selecting radio button', async () => {
      spyOn(component.tagSelected, 'emit');
      const closeSliderButton = await loader.getHarness(
        MatButtonHarness.with({selector: '#close-slider-button'}));
      await closeSliderButton.click();
      const tagRadio = await loader.getHarness(
        MatRadioButtonHarness.with({selector: '.tag_radio'}));
      await tagRadio.check();

      expect(component.tagSelected.emit).toHaveBeenCalledOnceWith('tag1');
    });
  });
});
