import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {skip, tap} from 'rxjs/operators';

import {ElectronService} from '../../core/services/electron/electron.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery-grid.component.html',
  styleUrls: ['./gallery-grid.component.scss']
})
export class GalleryGridComponent implements OnInit {
  public inputDir = '';
  public imagesList: string[] = [];
  allowedFileExtensions = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];

  imagesSubject = new BehaviorSubject<string[]>([]);

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly electronService: ElectronService) { }

  ngOnInit(): void {
    this.imagesSubject.subscribe(images => {
      this.imagesList = images;
      this.changeDetectorRef.detectChanges();
    });
  }

  public getFilesList(): void {
    this.electronService.fs.readdir(this.inputDir, (error, files) => {
      if (!error) {
        const imageFiles = [];
        for (const file of files) {
          const extension = file.split('.')[file.split('.').length - 1];
          if (this.allowedFileExtensions.includes(extension)) {
            imageFiles.push(file);
          }
        }
        this.imagesSubject.next(imageFiles);
      }
      else {
        this.imagesSubject.next([]);
      }
    });
  }
}
