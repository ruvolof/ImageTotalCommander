import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  public selectedImageIndex = -1;
  public imagesArray: File[] = [];

  constructor() { }

  ngOnInit(): void { }

  public onImagesInFolder(images: File[]): void {
    console.log(images);
    this.imagesArray = images;
  }

  public onPictureSelected(index: number): void {
    this.selectedImageIndex = index;
  }
}
