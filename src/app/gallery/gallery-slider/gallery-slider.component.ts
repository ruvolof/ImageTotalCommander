import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-gallery-slider',
  templateUrl: './gallery-slider.component.html',
  styleUrls: ['./gallery-slider.component.scss']
})
export class GallerySliderComponent implements OnInit {
  @Input() selectedImageIndex!: number;
  @Input() imagesArray!: File[];

  constructor() { }

  ngOnInit(): void { }

  public loadPreviousPicture(): void {
    const arrayLength = this.imagesArray.length;
    const previousIndex = (
      (this.selectedImageIndex - 1) % arrayLength + arrayLength) % arrayLength;
    this.selectedImageIndex = previousIndex;
  }

  public loadNextPicture(): void {
    const arrayLength = this.imagesArray.length;
    const nextIndex = (
      (this.selectedImageIndex + 1) % arrayLength + arrayLength) % arrayLength;
    this.selectedImageIndex = nextIndex;
  }

}
