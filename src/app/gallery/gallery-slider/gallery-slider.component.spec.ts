import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatButtonHarness} from '@angular/material/button/testing';

import {GalleryModule} from '../gallery.module';
import {GallerySliderComponent} from './gallery-slider.component';

describe('GallerySliderComponent', () => {
  let component: GallerySliderComponent;
  let fixture: ComponentFixture<GallerySliderComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryModule],
      declarations: [GallerySliderComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GallerySliderComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.imagesArray = [
      new File([""], "1.jpg", {type: 'image/jpg'}),
      new File([""], "2.jpg", {type: 'image/jpg'}),
    ];
    component.selectedImageIndex = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to next picture', async () => {
    const nextButton = await loader.getHarness(
      MatButtonHarness.with({selector: '#slider-next-button'}));
    await nextButton.click();

    expect(component.selectedImageIndex).toEqual(1);
  });

  it('navigates to previous picture', async () => {
    const previousButton = await loader.getHarness(
      MatButtonHarness.with({selector: '#slider-previous-button'}));
    await previousButton.click();

    expect(component.selectedImageIndex).toEqual(1);
  });
});
