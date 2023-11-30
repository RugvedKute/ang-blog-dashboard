import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { StorageModule } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toaster: ToastrService,
    private router: Router
  ) {}

  uploadImage(
    selectedImg: any,
    postData: Post,
    formStatus: string,
    postID: string = ''
  ) {
    const filePath = `postIMG/${Date.now()}`;
    console.log(filePath);


    this.storage.upload(filePath, selectedImg).then(() => {
      console.log('Image has been uploaded successfully');

      this.storage
        .ref(filePath)
        .getDownloadURL()
        .subscribe((URL) => {
          postData.postImgPath = URL;

          if (formStatus === 'Edit') {
            
            this.updateData(postData, postID);
          } else {
            this.saveData(postData);
          }
        });
    });
  }

  saveData(postData: Post) {
    this.afs
      .collection('posts')
      .add(postData)
      .then((docRef) => {
        this.toaster.success('The post Data uploaded successfully');
        this.router.navigate(['/posts']);
      });
  }

  loadData() {
    return this.afs
      .collection('posts')
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

  loadOneData(id: string) {
    return this.afs.collection('posts').doc(id).valueChanges();
  }

  updateData(postData: Post, id: string) {
    this.afs.collection('posts').doc(id).update(postData).then((docRef) => {
      this.toaster.success('The Data has been updated successfully!')
      this.router.navigate(['/posts'])
    }).catch((err) => {
      this.toaster.error(err);
    });
  }

  deleteImage(postImagePath: string, id:string) {
    this.storage.storage.refFromURL(postImagePath).delete().then(() => {
      this.deleteData(id);
    })
    
  }

  deleteData(id: string) {
    this.afs.collection('posts').doc(id).delete().then((docRef) => {
      this.toaster.warning('Post Deleted..!')
    });
  }

  markFeatured(id: string, featuredData: any) {
    this.afs.collection('posts').doc(id).update(featuredData).then((docRef) => {
      this.toaster.success('Mark successfully..')

    })
  }
 
}
