import {Component, OnInit} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';

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
  imagesPaths: string[] = [];
  isSliderVisible = false;
  isGridVisible = true;

  private _imagesArray: WebkitFileInterface[] = [];
  private _selectedImageIndex = -1;

  constructor(private readonly tagsService: TagsService) { }

  get imagesArray(): WebkitFileInterface[] {return this._imagesArray;}
  set imagesArray(newImagesArray: WebkitFileInterface[]) {
    this._imagesArray = newImagesArray;
    this.imagesPaths = Array.from(
      new Set(this._imagesArray.map(file => file.path))).sort();
  }

  get selectedImageIndex(): number {return this._selectedImageIndex;}
  set selectedImageIndex(newValue: number) {
    this._selectedImageIndex = newValue;
    this.updateMainView();
  }

  ngOnInit(): void {
    this.tagsStatus = this.tagsService.tagsStatus;
    this.selectedTags = new Set<string>();
  }

  onPictureSelected(index: number): void {
    this.selectedImageIndex = index;
  }

  onSelectedFolder(selectedFolder: SelectedFolderInterface): void {
    this.imagesArray = selectedFolder.files;
    this.selectedFolderPath = selectedFolder.absolutePath;
  }

  onTagSelected(tagName: string): void {
    this.imagesPaths = 
      Array.from(this.tagsStatus.get(tagName).filenames).sort();
  }

  updateMainView(): void {
    this.isSliderVisible = this.selectedImageIndex !== -1;
    this.isGridVisible = !this.isSliderVisible;    
  }
}
