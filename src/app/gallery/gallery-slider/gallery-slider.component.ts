import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-gallery-slider',
  templateUrl: './gallery-slider.component.html',
  styleUrls: ['./gallery-slider.component.scss']
})
export class GallerySliderComponent implements OnInit {
  @Input() imageIndex!: number;
  @Input() imageSrcArray!: string[];

  constructor() { }

  ngOnInit(): void { }

}
