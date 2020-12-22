import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-gallery-grid',
  templateUrl: './gallery-grid.component.html',
  styleUrls: ['./gallery-grid.component.scss']
})
export class GalleryGridComponent implements OnInit {
  // Emits the index of the selected picture in the array.
  @Output() pictureSelected = new EventEmitter();

  @Input() imagesArray!: File[];

  constructor() { }

  ngOnInit(): void { }

  public selectPicture(index: number): void {
    this.pictureSelected.emit(index);
  }
}
