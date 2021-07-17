import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WebkitFileInterface, SelectedFolderInterface} from '../gallery.component';

@Component({
  selector: 'app-gallery-sidebar',
  templateUrl: './gallery-sidebar.component.html',
  styleUrls: ['./gallery-sidebar.component.scss']
})
export class GallerySidebarComponent implements OnInit {
  // Emits a SelectedFolderInterface.
  @Output() selectedFolder = new EventEmitter();
  // Emits when the button to close the slider is clicked.
  @Output() closeSlider = new EventEmitter();
  // Emits when the add tag button is clicked
  @Output() addTag = new EventEmitter();
  // Emits when a checkbox with a tag is clicked
  @Output() toggleTag = new EventEmitter();

  @Input() isSliderVisible!: boolean;
  @Input() availableTags!: Set<string>;
  @Input() selectedTags!: Set<string>;

  newTag = '';

  constructor() { }

  ngOnInit(): void { }

  public onCloseSliderClick(): void {
    this.closeSlider.emit();
  }

  public onDirectorySelected(fileList: FileList): void {
    const imagesInSelectedFolder: WebkitFileInterface[] = 
        Array.from(fileList).filter(
          (file: WebkitFileInterface) => {
            if (file.type.startsWith('image/') 
                && file.webkitRelativePath.split('/').length === 2) {
              return file;
            }
            return;
          });
    if (imagesInSelectedFolder.length > 0) {
      const sampleFile = imagesInSelectedFolder[0];
      const directoryAbsolutePath = 
          sampleFile.path.replace('/' + sampleFile.name, '');
      this.selectedFolder.emit({
        absolutePath: directoryAbsolutePath,
        files: imagesInSelectedFolder
      } as SelectedFolderInterface);
    }
  }

  public onAddTagClick(): void {
    if (this.newTag) {
      this.addTag.emit(this.newTag);
    }
  }

  public onTagCheckboxChange(tag: string): void {
    this.toggleTag.emit(tag);
  }
}
