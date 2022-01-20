import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputWebkitdirectoryComponent } from './input-webkitdirectory.component';

describe('InputWebkitdirectoryComponent', () => {
  let component: InputWebkitdirectoryComponent;
  let fixture: ComponentFixture<InputWebkitdirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputWebkitdirectoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputWebkitdirectoryComponent);
    component = fixture.componentInstance;
    component.label = 'Label';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the label', () => {
    expect(fixture.nativeElement.textContent).toContain('Label');
  });

  it('replays the event back', () => {
    spyOn(component.directorySelected, 'emit');
    component.onDirectorySelected(new Event('test'));
    expect(component.directorySelected.emit).toHaveBeenCalledOnceWith(
      new Event('test'));
  });
});
