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
  public selectedFolderPath = '';
  public imagesArray: WebkitFileInterface[] = [];
  public isSliderVisible = false;
  public isGridVisible = true;

  private _selectedImageIndex = -1;
  get selectedImageIndex(): number {return this._selectedImageIndex;}
  set selectedImageIndex(newValue: number) {
    this._selectedImageIndex = newValue;
    this.updateTagView();
  }

  tagsStatus: Map<string,TagSetInterface>;
  availableTags: Set<string>;
  selectedTags: Set<string>;

  constructor(private readonly tagsService: TagsService) { }

  ngOnInit(): void {
    this.tagsStatus = this.tagsService.tagsStatus;
    this.availableTags = new Set<string>();
    this.selectedTags = new Set<string>();
  }

  isImageSelected(): boolean {
    return this.selectedImageIndex !== -1;
  }

  public onAddTag(tag: string): void {
    if (this.isImageSelected()) {
      this.tagsService.addTag(
        tag, this.imagesArray[this.selectedImageIndex].name);
    }
    this.updateTagView();
  }

  public onCloseSlider(): void {
    this.selectedImageIndex = -1;
    this.updateMainView();
    this.updateTagView();
  }

  public onPictureSelected(index: number): void {
    this.selectedImageIndex = index;
    this.updateMainView();
    this.updateTagView();
  }

  public onSelectedFolder(selectedFolder: SelectedFolderInterface): void {
    this.imagesArray = selectedFolder.files;
    this.selectedFolderPath = selectedFolder.absolutePath;
  }

  public onToggleTag(tag: string): void {
    if (this.isImageSelected()) {
      this.toggleTagForSelected(tag);
    }
    this.updateTagView();
  }

  toggleTagForSelected(tag: string): void {
    const tagSetInterface = this.tagsStatus.get(tag);
    const selectedFilename = this.imagesArray[this.selectedImageIndex].name;
    if (tagSetInterface.filenames.has(selectedFilename)) {
      tagSetInterface.filenames.delete(selectedFilename);
      if (tagSetInterface.filenames.size < 1) {
        this.tagsStatus.delete(tag);
      }
    } else {
      tagSetInterface.filenames.add(selectedFilename);
    }
    this.tagsService.saveTagsStatus(this.tagsStatus, this.selectedFolderPath);
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
            this.imagesArray[this.selectedImageIndex].name)) {
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
