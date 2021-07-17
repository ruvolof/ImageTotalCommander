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
      declarations: [ GallerySidebarComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GallerySidebarComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.isSliderVisible = true;
    component.availableTags = new Set<string>().add('existing_tag');
    component.selectedTags = new Set<string>();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the Close Slider button', () => {
    expect(fixture.nativeElement.textContent).toContain('Close Slider');
  });

  it('emits closeSlider when button is clicked', async () => {
    spyOn(component.closeSlider, 'emit');
    const closeSliderButton = await loader.getHarness(
      MatButtonHarness.with({selector: '#close-slider-button'}));
    await closeSliderButton.click();

    expect(component.closeSlider.emit).toHaveBeenCalledOnceWith();
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

  it('emits addTag when the add button is clicked', async () => {
    spyOn(component.addTag, 'emit');
    const newTagInput = await loader.getHarness(
      MatInputHarness.with({selector: '#new-tag-input'}));
    const addNewTagButton = await loader.getHarness(
      MatButtonHarness.with({selector: '#add-new-tag-button'}));
    await newTagInput.setValue('new_tag');
    await addNewTagButton.click();

    expect(component.newTag).toEqual('new_tag');
    expect(component.addTag.emit).toHaveBeenCalledOnceWith('new_tag');
  });

  it('emits toggleTag when a checkbox is selected', async () => {
    spyOn(component.toggleTag, 'emit');
    const tagCheckbox = await loader.getHarness(MatCheckboxHarness);
    await tagCheckbox.toggle();

    expect(component.toggleTag.emit).toHaveBeenCalledOnceWith('existing_tag');
  });
});
