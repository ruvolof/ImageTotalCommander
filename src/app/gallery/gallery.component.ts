import {Component, OnInit} from '@angular/core';


export interface TagSetInterface {
  filenames: Set<string>;
}


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

  tagsStatus: Map<string,TagSetInterface>;

  constructor() { }

  ngOnInit(): void {
    this.tagsStatus = new Map<string,TagSetInterface>();
  }

  public onAddTag(tag: string): void {
    if (this.selectedImageIndex !== -1) {
      let tagSetInterface = this.tagsStatus.get(tag);
      if (tagSetInterface === undefined) {
        tagSetInterface = {
          filenames: new Set<string>(),
        };
        this.tagsStatus.set(tag, tagSetInterface);
      }
      tagSetInterface.filenames.add(
        this.imagesArray[this.selectedImageIndex].name);
    }
  }

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
