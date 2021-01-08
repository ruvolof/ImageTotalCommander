import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

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

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(component.closeSlider.emit).toHaveBeenCalledOnceWith();
  });

  it('emits imagesInFolder after processing images', () => {
    spyOn(component.imagesInFolder, 'emit');
    component.onDirectorySelected([] as unknown as FileList);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(component.imagesInFolder.emit).toHaveBeenCalledOnceWith([]);
  });

  // TODO(ruvolof): add actual tests for the processing of files in the 
  // selected folder
});
