/* eslint-disable @typescript-eslint/unbound-method */
import {DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {GalleryComponent, SelectedFolderInterface, WebkitFileInterface} from './gallery.component';
import {GalleryGridComponent} from './gallery-grid/gallery-grid.component';
import {GallerySidebarComponent} from './gallery-sidebar/gallery-sidebar.component';
import {GallerySliderComponent} from './gallery-slider/gallery-slider.component';
import {GalleryModule} from './gallery.module';
import {TagsService, TagSetInterface} from '../core/services/tags/tags.service';

export function makeWebkitFileInterface(
    fileId: string, type='image/jpg'): WebkitFileInterface {
  return {
    name: `${fileId}.jpg`,
    path: `/abs/path/${fileId}.jpg`,
    type: type,
    webkitRelativePath: `path/${fileId}.jpg`
  } as WebkitFileInterface;
}

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;
  let galleryGrid: DebugElement;
  let gallerySidebar: DebugElement;
  let gallerySlider: DebugElement;
  let fakeTagsService: TagsService;

  beforeEach(async () => {
    fakeTagsService = jasmine.createSpyObj('TagsService', ['tagsStatus']);
    fakeTagsService.tagsStatus = new Map<string,TagSetInterface>();
    
    await TestBed.configureTestingModule({
      imports: [GalleryModule],
      declarations: [GalleryComponent],
      providers: [
        {provide: TagsService, useValue: fakeTagsService},
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    galleryGrid = fixture.debugElement.query(
      By.directive(GalleryGridComponent));
    gallerySidebar = fixture.debugElement.query(
      By.directive(GallerySidebarComponent));
    gallerySlider = fixture.debugElement.query(
      By.directive(GallerySliderComponent));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes the component', () => {
    component.ngOnInit();
    
    expect(component.selectedImageIndex).toEqual(-1);
    expect(component.imagesArray).toEqual([]);
    expect(component.imagesPaths).toEqual([]);
    expect(component.isSliderVisible).toBeFalse();
    expect(component.isGridVisible).toBeTrue();
  });

  it('initializes the view', () => {
    expect(galleryGrid).toBeDefined();
    expect(gallerySidebar).toBeDefined();
    expect(gallerySlider).toBeNull();
  });

  it('populates array when images are received from the sidebar', () => {
    gallerySidebar.triggerEventHandler(
      'selectedFolder', {
        absolutePath: '/abs/path', 
        files: [makeWebkitFileInterface('1')]
      } as SelectedFolderInterface);
    fixture.detectChanges();

    expect(component.imagesArray).toEqual([makeWebkitFileInterface('1')]);
    expect(component.selectedFolderPath).toEqual('/abs/path');
    expect(component.imagesPaths).toEqual(['/abs/path/1.jpg']);
  });

  it('opens the slider when an image is selected on the grid', () => {
    component.imagesArray = [makeWebkitFileInterface('1')];
    galleryGrid.triggerEventHandler('pictureSelected', 0);
    fixture.detectChanges();

    expect(component.selectedImageIndex).toEqual(0);
    expect(component.isGridVisible).toBeFalse();
    expect(fixture.debugElement.query(
      By.directive(GalleryGridComponent))).toBeNull();
    expect(component.isSliderVisible).toBeTrue();
    expect(fixture.debugElement.query(
      By.directive(GallerySliderComponent))).toBeDefined();
  });
});
