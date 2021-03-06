/* eslint-disable @typescript-eslint/unbound-method */
import {DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {GalleryComponent, SelectedFolderInterface, TagSetInterface, WebkitFileInterface} from './gallery.component';
import {GalleryGridComponent} from './gallery-grid/gallery-grid.component';
import {GallerySidebarComponent} from './gallery-sidebar/gallery-sidebar.component';
import {GallerySliderComponent} from './gallery-slider/gallery-slider.component';
import {GalleryModule} from './gallery.module';

export function makeWebkitFileInterface(fileId: string) {
  return {
    name: `${fileId}.jpg`,
    path: `/abs/path/${fileId}.jpg`,
    type: 'image/jpg',
    webkitRelativePath: `path/${fileId}.jpg1`
  } as WebkitFileInterface;
}

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;
  let galleryGrid: DebugElement;
  let gallerySidebar: DebugElement;
  let gallerySlider: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryModule],
      declarations: [GalleryComponent]
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
    expect(component.selectedImageIndex).toEqual(-1);
    expect(component.imagesArray).toEqual([]);
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

  it('closes the slider when the sidebar emits closeSlide', () => {
    component.imagesArray = [makeWebkitFileInterface('1')];
    galleryGrid.triggerEventHandler('pictureSelected', 0);
    fixture.detectChanges();

    expect(component.isGridVisible).toBeFalse();
    expect(component.isSliderVisible).toBeTrue();
    expect(fixture.debugElement.query(
      By.directive(GalleryGridComponent))).toBeNull();
    expect(fixture.debugElement.query(
      By.directive(GallerySliderComponent))).toBeDefined();
    
    
    gallerySidebar.triggerEventHandler('closeSlider', null);
    fixture.detectChanges();

    expect(component.selectedImageIndex).toEqual(-1);
    expect(component.isGridVisible).toBeTrue();
    expect(component.isSliderVisible).toBeFalse();
    expect(fixture.debugElement.query(
      By.directive(GalleryGridComponent))).toBeDefined();
    expect(fixture.debugElement.query(
      By.directive(GallerySliderComponent))).toBeNull();
  });

  it('updates tag view when selected image index changes', () => {
    spyOn(component, 'updateTagView').and.callFake(() => {});
    component.selectedImageIndex = 5;

    expect(component.updateTagView).toHaveBeenCalledOnceWith();
  });

  describe('onAddTag', () => {
    beforeEach(() => {
      component.imagesArray = [
        makeWebkitFileInterface('1'),
        makeWebkitFileInterface('2'),
      ];

      spyOn(component, 'updateTagView').and.callThrough();
    });

    it('does nothing when no picture is selected', () => {
      spyOn(component, 'onAddTag');
      gallerySidebar.triggerEventHandler('addTag', 'new_tag');
      
      expect(component.tagsStatus).toEqual(new Map<string, TagSetInterface>());
    });

    it('adds a new set when the tag is new', () => {
      galleryGrid.triggerEventHandler('pictureSelected', 0);
      fixture.detectChanges();
      gallerySidebar.triggerEventHandler('addTag', 'new_tag');
      fixture.detectChanges();

      const expectedTagsStatus = 
        new Map<string,TagSetInterface>().set(
          'new_tag', {filenames: new Set<string>().add('1.jpg')});

      expect(component.updateTagView).toHaveBeenCalled();
      expect(component.tagsStatus).toEqual(expectedTagsStatus);
    });

    it('adds a filename to a pre existing tag set', () => {
      galleryGrid.triggerEventHandler('pictureSelected', 0);
      fixture.detectChanges();
      gallerySidebar.triggerEventHandler('addTag', 'new_tag');
      fixture.detectChanges();
      component.selectedImageIndex = 1;
      gallerySidebar.triggerEventHandler('addTag', 'new_tag');
      fixture.detectChanges();

      const expectedTagsStatus = 
        new Map<string,TagSetInterface>().set(
          'new_tag', {filenames: new Set<string>().add('1.jpg').add('2.jpg')});

      expect(component.updateTagView).toHaveBeenCalled();
      expect(component.tagsStatus).toEqual(expectedTagsStatus);
    });

    it('does not add the same filename twice to the same tag set', () => {
      galleryGrid.triggerEventHandler('pictureSelected', 0);
      fixture.detectChanges();
      gallerySidebar.triggerEventHandler('addTag', 'new_tag');
      fixture.detectChanges();
      gallerySidebar.triggerEventHandler('addTag', 'new_tag');
      fixture.detectChanges();

      const expectedTagsStatus = 
        new Map<string,TagSetInterface>().set(
          'new_tag', {filenames: new Set<string>().add('1.jpg')});

      expect(component.updateTagView).toHaveBeenCalled();
      expect(component.tagsStatus).toEqual(expectedTagsStatus);
    });
  });

  describe('onToggleTag', () => {
    beforeEach(() => {
      component.imagesArray = [
        makeWebkitFileInterface('1'),
        makeWebkitFileInterface('2'),
      ];
      component.tagsStatus.set(
        'test_tag', {filenames: new Set<string>().add('1.jpg')});

      spyOn(component, 'updateTagView').and.callThrough();
    });

    it('adds a tag to the currently selected image', () => {
      component.selectedImageIndex = 1;
      gallerySidebar.triggerEventHandler('toggleTag', 'test_tag');
      fixture.detectChanges();

      expect(component.updateTagView).toHaveBeenCalled();
      expect(component.tagsStatus.get('test_tag')).toEqual(
        {filenames: new Set<string>().add('1.jpg').add('2.jpg')});
    });

    it('removes a tag to the currently selected image', () => {
      component.selectedImageIndex = 0;
      gallerySidebar.triggerEventHandler('toggleTag', 'test_tag');
      fixture.detectChanges();

      expect(component.updateTagView).toHaveBeenCalled();
      expect(component.tagsStatus.get('test_tag')).toBeUndefined();
    });
  });
});
