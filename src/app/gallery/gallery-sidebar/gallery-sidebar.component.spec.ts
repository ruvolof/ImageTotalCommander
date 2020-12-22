import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GallerySidebarComponent } from './gallery-sidebar.component';

describe('GallerySidebarComponent', () => {
  let component: GallerySidebarComponent;
  let fixture: ComponentFixture<GallerySidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GallerySidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GallerySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
