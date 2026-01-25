import {Routes} from '@angular/router';
import {Home} from './home/home';
import {HelloWorld} from './hello-world/hello-world';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: Home
  },
  {
    path: 'hello-world',
    title: 'Hello World',
    component: HelloWorld
  }
];
