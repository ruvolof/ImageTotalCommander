import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-gallery-slider',
  templateUrl: './gallery-slider.component.html',
  styleUrls: ['./gallery-slider.component.scss']
})
export class GallerySliderComponent implements OnInit {
  @Output() selectedImageIndexChange = new EventEmitter();
  
  @Input() selectedImageIndex!: number;
  @Input() imagesPaths!: string[];

  constructor() { }

  ngOnInit(): void { }

  public loadPreviousPicture(): void {
    const arrayLength = this.imagesPaths.length;
    const previousIndex = (
      (this.selectedImageIndex - 1) % arrayLength + arrayLength) % arrayLength;
    this.selectedImageIndex = previousIndex;
    this.selectedImageIndexChange.emit(this.selectedImageIndex);
  }

  public loadNextPicture(): void {
    const arrayLength = this.imagesPaths.length;
    const nextIndex = (
      (this.selectedImageIndex + 1) % arrayLength + arrayLength) % arrayLength;
    this.selectedImageIndex = nextIndex;
    this.selectedImageIndexChange.emit(this.selectedImageIndex);
  }
}
