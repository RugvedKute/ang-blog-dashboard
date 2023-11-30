import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css'],
})
export class AllPostsComponent implements OnInit {
  postArray!: Array<any>;

  constructor(private postService: PostService,
  
    ) {}

  ngOnInit(): void {
    this.postService.loadData().subscribe((data) => (this.postArray = data));
  }


  onDelete(imgPath: string, id: string) {
    this.postService.deleteImage(imgPath, id);
  }

  onFeatured(id: string, value: boolean) {
    const featuredData = {
      isFeatured: value,
    }

    this.postService.markFeatured(id, featuredData);


  }
}
