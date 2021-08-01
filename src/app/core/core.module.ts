import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TagsService} from './services/tags/tags.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [TagsService],
})
export class CoreModule { }
