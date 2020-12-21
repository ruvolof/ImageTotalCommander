import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list'; 
import {MatInputModule} from '@angular/material/input'; 
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {GalleryGridComponent} from './gallery-grid/gallery-grid.component';
import {GallerySliderComponent} from './gallery-slider/gallery-slider.component';
import {GalleryRoutingModule} from './gallery-routing.module';
import { GalleryComponent } from './gallery.component';


@NgModule({
  declarations: [
    GalleryGridComponent,
    GallerySliderComponent,
    GalleryComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    GalleryRoutingModule,
  ],
})
export class GalleryModule { }
