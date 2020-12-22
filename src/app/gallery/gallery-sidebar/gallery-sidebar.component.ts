import {Component, EventEmitter, OnInit, Output} from '@angular/core';

interface WebkitFileInterface extends File {
  webkitRelativePath: string;
}


@Component({
  selector: 'app-gallery-sidebar',
  templateUrl: './gallery-sidebar.component.html',
  styleUrls: ['./gallery-sidebar.component.scss']
})
export class GallerySidebarComponent implements OnInit {
  // Emits a File[] with images in the selected folder.
  @Output() imagesInFolder = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public onDirectorySelected(fileList: FileList): void {
    const imagesInSelectedFolder = Array.from(fileList).filter(
      (file: WebkitFileInterface) => {
        if (file.type.startsWith('image/') 
            && file.webkitRelativePath.split('/').length == 2) {
          return file;
        }
        return;
      });
    this.imagesInFolder.emit(imagesInSelectedFolder);
  }
}
