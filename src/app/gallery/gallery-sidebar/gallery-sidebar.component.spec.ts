/* eslint-disable @typescript-eslint/unbound-method */
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatButtonHarness} from '@angular/material/button/testing';
import {MatCheckboxHarness} from '@angular/material/checkbox/testing';
import {MatInputHarness} from '@angular/material/input/testing';
import { SelectedFolderInterface } from '../gallery.component';

import {GalleryModule} from '../gallery.module';
import {GallerySidebarComponent} from './gallery-sidebar.component';


describe('GallerySidebarComponent', () => {
  let component: GallerySidebarComponent;
  let fixture: ComponentFixture<GallerySidebarComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryModule],
      declarations: [GallerySidebarComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GallerySidebarComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.isSliderVisible = true;
    spyOnProperty(component, 'availableTags').and.returnValue(
      new Set<string>().add('existing_tag'));
    spyOnProperty(component, 'selectedTags').and.returnValue(
      new Set<string>());
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

  it('emits imagesInFolder after processing images', () => {
    spyOn(component.selectedFolder, 'emit');
    component.onDirectorySelected([] as unknown as FileList);

    expect(component.selectedFolder.emit).toHaveBeenCalledOnceWith({
      absolutePath: '',
      files: []
    } as SelectedFolderInterface);
  });

  // TODO(ruvolof): add actual tests for the processing of files in the 
  // selected folder
});
