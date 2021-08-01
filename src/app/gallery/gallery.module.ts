import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input'; 
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {CoreModule} from '../core/core.module';

import {GalleryGridComponent} from './gallery-grid/gallery-grid.component';
import {GallerySliderComponent} from './gallery-slider/gallery-slider.component';
import {GalleryRoutingModule} from './gallery-routing.module';
import {GalleryComponent} from './gallery.component';
import {GallerySidebarComponent} from './gallery-sidebar/gallery-sidebar.component';


@NgModule({
  declarations: [
    GalleryGridComponent,
    GallerySliderComponent,
    GalleryComponent,
    GallerySidebarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    CoreModule,
    GalleryRoutingModule,
  ],
})
export class GalleryModule { }
