import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/internal/operators/map';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private afs: AngularFirestore, private toastr: ToastrService) {}

  saveData(categoryData: any) {
    this.afs
      .collection('categories')
      .add(categoryData)
      .then((docRef) => {
        console.log(docRef);
        this.toastr.success('The New Category Added SucessFully');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  loadData() {
    return this.afs
      .collection('categories')
      .snapshotChanges()
      .pipe(
        map((data) => {
          return data.map((mainData) => {
            const data = mainData.payload.doc.data();
            const id = mainData.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  editData(id: string, categoryData: Category) {
    this.afs
      .collection('categories')
      .doc(id)
      .update(categoryData)
      .then((docRef) => {
        console.log(docRef);
        this.toastr.success('The Category is Updated SuccesFully.');
      })
      .catch((err) => {
        this.toastr.error(err);
      });
  }

  deleteData(id: string) {
    this.afs
      .collection('categories')
      .doc(id)
      .delete()
      .then((docRef) => {
        console.log(docRef);
        this.toastr.error('The category is SuccesFully Deleted..!');
      });
  }
}
