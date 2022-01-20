import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'input-webkitdirectory',
  templateUrl: './input-webkitdirectory.component.html',
  styleUrls: ['./input-webkitdirectory.component.scss']
})
export class InputWebkitdirectoryComponent implements OnInit {
  @Input() label!: string;
  @Output() directorySelected = new EventEmitter<Event>();

  constructor() { }

  ngOnInit(): void {
  }

  onDirectorySelected(event: Event): void {
    this.directorySelected.emit(event);
  }
}
