import {Component, NgZone, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {ElectronService} from '../core/services/electron/electron.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  public selectedPictureIndex = -1;
  public pictureSrcArray: string[] = [];
  allowedFileExtensions = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];

  imagesSubject = new BehaviorSubject<string[]>([]);

  constructor(
    private readonly ngZone: NgZone,
    private readonly electronService: ElectronService) { }

  ngOnInit(): void {
    this.imagesSubject.subscribe(imagesSrc => {
      // This observable is emitted outside of the angular zone.
      this.ngZone.run(() => {
        this.pictureSrcArray = imagesSrc;
      });
    });
  }

  public getFilesList(directory: string): void {
    this.electronService.fs.readdir(directory, (error, files) => {
      if (!error) {
        if (!directory.endsWith('/')) {
          directory = directory + '/';
        }
        const imageFiles = [];
        for (const file of files) {
          const extension = file.split('.')[file.split('.').length - 1];
          if (this.allowedFileExtensions.includes(extension)) {
            imageFiles.push('file://' + directory + file);
          }
        }
        this.imagesSubject.next(imageFiles);
      }
      else {
        this.imagesSubject.next([]);
      }
    });
  }

  public onDirectoryInput(path: string): void {
    this.getFilesList(path);
  }

  public onPictureSelected(index: number): void {
    this.selectedPictureIndex = index;
  }
}
