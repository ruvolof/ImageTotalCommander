import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatRadioChange} from '@angular/material/radio';

import {TagsService} from '../../core/services/tags/tags.service';
import {WebkitFileInterface, SelectedFolderInterface} from '../gallery.component';

@Component({
  selector: 'app-gallery-sidebar',
  templateUrl: './gallery-sidebar.component.html',
  styleUrls: ['./gallery-sidebar.component.scss']
})
export class GallerySidebarComponent {
  @Input() selectedImageIndex!: number;
  @Input() imagesPaths!: string[];
  @Output() selectedFolder = new EventEmitter<SelectedFolderInterface>();
  @Output() tagSelected = new EventEmitter<string>();
  @Output() selectedImageIndexChange = new EventEmitter<number>();

  newTag = '';
  selectedFolderPath = '';

  constructor(private readonly tagsService: TagsService) { }

  get availableTags(): string[] {
    return Array.from(this.tagsService.tagsStatus.keys());
  }

  get selectedTags(): Set<string> {
    return new Set(
      Array.from(this.tagsService.tagsStatus).filter(([key, value]) => {
        if(value.filenames.has(
          this.imagesPaths[this.selectedImageIndex])) {
          return  true;
        }
        return false;
      }).map(([key, value]) => key));
  }

  get isSliderVisible(): boolean {
    return this.selectedImageIndex !== -1;
  }

  public onAddTagClick(): void {
    if (this.newTag) {
      this.tagsService.addTag(
        this.newTag, this.imagesPaths[this.selectedImageIndex]);
    }
  }

  public onCloseSliderClick(): void {
    this.selectedImageIndex = -1;
    this.selectedImageIndexChange.emit(this.selectedImageIndex);
  }

  public assertEventTarget(eventTarget?: EventTarget | null): EventTarget {
    if (!eventTarget) {
      throw new Error("Unexpected event from directory select.");
    }
    return eventTarget as EventTarget;
  }

  public onDirectorySelected(eventTarget: EventTarget): void {
    const fileList = (eventTarget as HTMLInputElement).files as FileList;
    const imagesInSelectedFolder: WebkitFileInterface[] = 
        Array.from(fileList)
          .map(file => file as unknown as WebkitFileInterface)
          .filter(fileInterface => {
            if (fileInterface.type.startsWith('image/') 
                && fileInterface.webkitRelativePath.split('/').length === 2) {
              return fileInterface;
            }
            return;
          }).sort((a: WebkitFileInterface, b: WebkitFileInterface) => {
            const textA = a.path.toUpperCase();
            const textB = b.path.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
    if (imagesInSelectedFolder.length > 0) {
      const sampleFile = imagesInSelectedFolder[0];
      this.selectedFolderPath = 
          sampleFile.path.replace('/' + sampleFile.name, '');
      this.selectedFolder.emit({
        absolutePath: this.selectedFolderPath,
        files: imagesInSelectedFolder
      } as SelectedFolderInterface);
    } else {
      this.selectedFolder.emit({
        absolutePath: '',
        files: []
      } as SelectedFolderInterface);
    }
  }

  public onTagCheckboxChange(event: MatCheckboxChange): void {
    this.tagsService.toggleTag(
      event.source.value, this.imagesPaths[this.selectedImageIndex]);
  }

  public onTagRadioChange(event: MatRadioChange): void {
    this.tagSelected.emit(event.value);
  }
}
