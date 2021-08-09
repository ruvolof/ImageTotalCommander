import {Component, OnInit} from '@angular/core';

import {TagSetInterface, TagsService} from '../core/services/tags/tags.service';

export interface SelectedFolderInterface {
  absolutePath: string;
  files: WebkitFileInterface[];
}

export interface WebkitFileInterface {
  name: string;
  path: string;
  type: string;
  webkitRelativePath: string;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  tagsStatus: Map<string,TagSetInterface>;
  availableTags: Set<string>;
  selectedTags: Set<string>;
  selectedFolderPath = '';
  imagesPaths = new Set<string>();
  isSliderVisible = false;
  isGridVisible = true;

  private _imagesArray: WebkitFileInterface[] = [];
  get imagesArray(): WebkitFileInterface[] {return this._imagesArray;}
  set imagesArray(newImagesArray: WebkitFileInterface[]) {
    this._imagesArray = newImagesArray;
    this.imagesPaths = new Set(this.imagesArray.map(file => file.path));
  }

  private _selectedImageIndex = -1;
  get selectedImageIndex(): number {return this._selectedImageIndex;}
  set selectedImageIndex(newValue: number) {
    this._selectedImageIndex = newValue;
    this.updateTagView();
  }

  constructor(private readonly tagsService: TagsService) { }

  ngOnInit(): void {
    this.tagsStatus = this.tagsService.tagsStatus;
    this.selectedTags = new Set<string>();
    this.updateTagView();
  }

  isImageSelected(): boolean {
    return this.selectedImageIndex !== -1;
  }

  onAddTag(tag: string): void {
    if (this.isImageSelected()) {
      this.tagsService.addTag(
        tag, this.imagesArray[this.selectedImageIndex].path);
    }
    this.updateTagView();
  }

  onCloseSlider(): void {
    this.selectedImageIndex = -1;
    this.updateMainView();
    this.updateTagView();
  }

  onPictureSelected(index: number): void {
    this.selectedImageIndex = index;
    this.updateMainView();
    this.updateTagView();
  }

  onSelectedFolder(selectedFolder: SelectedFolderInterface): void {
    this.imagesArray = selectedFolder.files;
    this.selectedFolderPath = selectedFolder.absolutePath;
  }

  onToggleTag(tag: string): void {
    if (this.isImageSelected()) {
      this.tagsService.toggleTag(
        tag, this.imagesArray[this.selectedImageIndex].path);
    } else {
      this.imagesPaths = this.tagsStatus.get(tag).filenames;
    }
    this.updateTagView();
  }

  updateMainView(): void {
    this.isSliderVisible = this.selectedImageIndex !== -1;
    this.isGridVisible = !this.isSliderVisible;    
  }

  updateTagView(): void {
    this.availableTags = new Set(this.tagsStatus.keys());
    if (this.isImageSelected()) {
      this.selectedTags = new Set(
        Array.from(this.tagsStatus).map(([key, value]) => {
          if(value.filenames.has(
            this.imagesPaths[this.selectedImageIndex])) {
            return  key;
          } else {
            return;
          }
        })
      );
    }
    else {
      this.selectedTags.clear();
    }
  }
}
