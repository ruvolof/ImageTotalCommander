import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {GalleryComponent} from './gallery.component';

const routes: Routes = [
  {path: 'gallery', component: GalleryComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'}),
  ],
  exports: [RouterModule]
})
export class GalleryRoutingModule { }
