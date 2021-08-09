import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GalleryGridComponent} from './gallery-grid.component';
import {GalleryModule} from '../gallery.module';
import {By} from '@angular/platform-browser';

describe('GalleryGridComponent', () => {
  let component: GalleryGridComponent;
  let fixture: ComponentFixture<GalleryGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryModule],
      declarations: [GalleryGridComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryGridComponent);
    component = fixture.componentInstance;
    component.imagesPaths = ['file_1.jpg', 'file_2.jpg'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows pictures in the grid', () => {
    const pictures = fixture.debugElement.queryAll(By.css('.grid-image'));
    
    expect(pictures.length).toEqual(2);
  });

  it('emits the picture index on click', () => {
    spyOn(component.pictureSelected, 'emit');
    const picture = fixture.debugElement.query(By.css('.grid-image'));
    picture.nativeElement.click();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(component.pictureSelected.emit).toHaveBeenCalledOnceWith(0);
  });
});
