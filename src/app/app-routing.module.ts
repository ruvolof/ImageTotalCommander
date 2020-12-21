import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {GalleryRoutingModule} from './gallery/gallery-routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/gallery',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    GalleryRoutingModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
