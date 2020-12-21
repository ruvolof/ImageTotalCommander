import {Component, EventEmitter, Input, NgZone, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {ElectronService} from '../../core/services/electron/electron.service';

@Component({
  selector: 'app-gallery-grid',
  templateUrl: './gallery-grid.component.html',
  styleUrls: ['./gallery-grid.component.scss']
})
export class GalleryGridComponent implements OnInit {
  // Emits the string with the source directory.
  @Output() directoryInput = new EventEmitter();
  // Emits the index of the selected picture in the array.
  @Output() pictureSelected = new EventEmitter();

  @Input() imageSrcArray!: string[];

  constructor() { }

  ngOnInit(): void { }

  public onDirectoryInput(path: string): void {
    this.directoryInput.emit(path);
  }

  public selectPicture(index: number): void {
    this.pictureSelected.emit(index);
  }
}
