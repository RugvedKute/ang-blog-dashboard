import { Component } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from './constants/constants';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'ang-blog-dashboard';

  app = initializeApp(firebaseConfig);
  db = getFirestore(this.app);

  constructor() {
    console.log(this.db);
  }


}


