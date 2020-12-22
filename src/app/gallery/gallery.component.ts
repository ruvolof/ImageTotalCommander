import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  public selectedImageIndex = -1;
  public imagesArray: File[] = [];
  public isSliderVisible = false;
  public isGridVisible = true;

  constructor() { }

  ngOnInit(): void { }

  public onCloseSlider(): void {
    this.selectedImageIndex = -1;
    this.updateMainView();
  }

  public onImagesInFolder(images: File[]): void {
    this.imagesArray = images;
  }

  public onPictureSelected(index: number): void {
    this.selectedImageIndex = index;
    this.updateMainView();
  }

  updateMainView(): void {
    this.isSliderVisible = this.selectedImageIndex !== -1;
    this.isGridVisible = !this.isSliderVisible;
  }
}
