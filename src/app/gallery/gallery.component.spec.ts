import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {GalleryComponent} from './gallery.component';
import {GalleryGridComponent} from './gallery-grid/gallery-grid.component';
import {GallerySidebarComponent} from './gallery-sidebar/gallery-sidebar.component';
import {GallerySliderComponent} from './gallery-slider/gallery-slider.component';
import {GalleryModule} from './gallery.module';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

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
    const galleryGrid = fixture.debugElement.query(
      By.directive(GalleryGridComponent));
    const gallerySidebar = fixture.debugElement.query(
      By.directive(GallerySidebarComponent));
    const gallerySlider = fixture.debugElement.query(
      By.directive(GallerySliderComponent));

    expect(galleryGrid).toBeDefined();
    expect(gallerySidebar).toBeDefined();
    expect(gallerySlider).toBeNull();
  });

  it('populates array when images are received from the sidebar', () => {
    const gallerySidebar = fixture.debugElement.query(
      By.directive(GallerySidebarComponent));
    gallerySidebar.triggerEventHandler(
      'imagesInFolder', [new File([''], '1.jpg', {type: 'image/jpg'})]);
    fixture.detectChanges();

    expect(component.imagesArray).toEqual(
      [new File([''], '1.jpg', {type: 'image/jpg'})]
    );
  });

  it('opens the slider when an image is selected on the grid', () => {
    component.imagesArray = [new File([''], '1.jpg', {type: 'image/jpg'})];
    const galleryGrid = fixture.debugElement.query(
      By.directive(GalleryGridComponent));
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
    component.imagesArray = [new File([''], '1.jpg', {type: 'image/jpg'})];
    const galleryGrid = fixture.debugElement.query(
      By.directive(GalleryGridComponent));
    galleryGrid.triggerEventHandler('pictureSelected', 0);
    fixture.detectChanges();

    expect(component.isGridVisible).toBeFalse();
    expect(component.isSliderVisible).toBeTrue();
    expect(fixture.debugElement.query(
      By.directive(GalleryGridComponent))).toBeNull();
    expect(fixture.debugElement.query(
      By.directive(GallerySliderComponent))).toBeDefined();
    
    
    const gallerySidebar = fixture.debugElement.query(
      By.directive(GallerySidebarComponent));
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
});
