import {Component} from '@angular/core';
import {ElectronService} from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
  ) {
    if (electronService.isElectron) {
      console.log('Running in electron');
    } else {
      console.log('Running in browser');
    }
  }
}
