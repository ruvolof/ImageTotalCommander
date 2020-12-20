import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {GalleryGridComponent} from './gallery-grid/gallery-grid.component';

const routes: Routes = [
  {path: 'gallery', component: GalleryGridComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  exports: [RouterModule]
})
export class GalleryRoutingModule { }
