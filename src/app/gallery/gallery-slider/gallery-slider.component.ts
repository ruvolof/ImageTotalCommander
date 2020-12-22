import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-gallery-slider',
  templateUrl: './gallery-slider.component.html',
  styleUrls: ['./gallery-slider.component.scss']
})
export class GallerySliderComponent implements OnInit {
  @Input() selectedImageIndex!: number;
  @Input() imagesArray!: File[];

  constructor() { }

  ngOnInit(): void { }

}
