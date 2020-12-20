import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {skip, tap} from 'rxjs/operators';

import {ElectronService} from '../core/services/electron/electron.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  public inputDir = '.';
  public filesList: string[] = [];

  filesSubject = new BehaviorSubject<string[]>([]);

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly electronService: ElectronService) { }

  ngOnInit(): void {
    this.filesSubject.subscribe(files => {
      this.filesList = files;
      this.changeDetectorRef.detectChanges();
    });
  }

  public getFilesList(): void {
    this.electronService.fs.readdir(this.inputDir, (error, files) => {
      if (!error) {
        this.filesSubject.next(files);
      }
      else {
        this.filesSubject.next([]);
      }
    });
  }
}
