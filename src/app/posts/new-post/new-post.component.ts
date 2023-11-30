import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  permaLinkString: string = '';
  imgSrc: any =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHUAkgMBIgACEQEDEQH/xAAbAAEBAQEBAAMAAAAAAAAAAAAAAQUEAwIGB//EADkQAAIBAgMEBggDCQAAAAAAAAABAgMEBREhEhMxQRVRU3GRkiJCVGKhwdHhgcLxFCQmMjU2YYKy/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AP0IgKBAgUAAAIAUACFAAAAQBgEUgAoAAgAAoAAhSBAUAAQpORQAB6UaFWu8qNOUu7ggPIp13GHVbe33tSUeOTiuRyAACMAUnIAUAAQAAUAAQIBAUHrb21a5k40YbWXF56I0qWEU6cdu7raLknkvEDISbeyk23wSO6hhdxVSc0qUff4+Bs2kLeNNStYxUXzS4nnXt7utorpU49UIfPMDmVnYWSzuJqUvefyPOtjCUdm1pJLk5r5IPBJN5u4zfW4fcdCS9oXk+4HtYVnf2talXlnPhnlyfAxJRcJOMuMW0+9G7Y4bK0r7xVtpNZNbP3Pjd4Vv68qsauxtcVs56gYZGaV1hbt7edXfKWzy2fuZwE5AFAAACAACggABAAdmFV9zewTfoz9F/I9MahKN3m5ScJrOKb0XXkZ+qejyfWbV7++YXCuv54LaeXgwJCTjgGcW00nqn7xn28bq5nsUp1JPn6bSR3x/t99z/wCjmwm8p2spxqpqM8tUuGQHhcRuraexVqVE+K9N5M899W7ap52dWK3cLqpDdp7MM9Xpnn+hy21GVxWjShxfPqXWA39btqnnY31btqnnZs3uGKpRpQt9mMqemb5r9TGuaMrevKlPVx59YGq5OWA5ybby4t+8Yxspfw//AK/mMYAEABQQAAABQABAgEBTVwOsmqtvPVP0kvgzKPW0rOhc06nJPXu5ga1ei6GDVKT9XNLu2tDESbeSWbfJH2TEU6lhVUE5NpZJa56oxrPe2tTeOzqVJernFrL4AdUcHlK2zc9ms9cnw7mdmGWX7LSbmlvZcf8AC6jn6TufYanhL6DpO59hqeEvoBqmLjtLZq06qWklsv8AA9ek7n2Gp4S+h4XtzcXdHduzqRyeaey9PgB7L+gfh+YxnwNqUZQwJxmnFpaprL1jFAAACgACAACgACBFAEAKBoUMWq0qUKe7jLZWWbZ8+mq3Yw8WZZQNPpqr2MPFjpqt2MPMzL1KBp9NVexh4sdNVuxh4sywB33OKVLihKlKlFKXNNnAwAAAAoAAgAAFIOQAAAAAAAAAAAAAAAAAAAAAAAADkAAAAAAAAAAAAAAAAAAAAAAAAAAP/9k=';
  selectedImg: any;
  categoryList: any;
  postForm!: FormGroup;
  postData: any;
  formStatus: string = 'Add New';
  docId: string = '';

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((data) => {
      this.docId = data.id;

      if (this.docId) {
        this.postService.loadOneData(data.id).subscribe((postData) => {
          this.postData = postData;
          this.imgSrc = this.postData.postImgPath
          this.postForm = this.fb.group({
            title: [
              this.postData.title,
              [Validators.required, Validators.minLength(10)],
            ],
            permaLink: [
              { value: this.postData.permaLink, disabled: true },
              Validators.required,
            ],
            excerpt: [
              this.postData.excerpt,
              [Validators.required, Validators.minLength(50)],
            ],
            category: [
              `${this.postData.category.categoryId}-${this.postData.category.category}`,
              Validators.required,
            ],
            imgName: [''],
            context: [this.postData.content, Validators.required],
          });
          this.permaLinkString = this.postData.permaLink;
          this.formStatus = 'Edit';
        });
      } else {
        this.postForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permaLink: [{ value: '', disabled: true }, Validators.required],
          excerpt: ['', [Validators.required, Validators.minLength(50)]],
          category: ['', Validators.required],
          imgName: ['', Validators.required],
          context: ['', Validators.required],
        });
      }
    });
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe((data) => {
      this.categoryList = data;
      console.log(this.categoryList);
    });
  }

  onKeyUp(event: any) {
    const title = event.target.value;
    this.permaLinkString = title.replaceAll(' ', '-');
  }

  showPreview(event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
      console.log(e.target?.result);
    };

    reader.readAsDataURL(event.target.files[0]);
    this.selectedImg = event.target.files[0];
  }

  get f() {
    return this.postForm?.controls;
  }

  onSubmit(formData: any) {
    let splitted = formData.value.category.split('-');
    console.log(formData, 'formData');
    const postData: Post = {
      title: formData.value.title,
      permaLink: this.permaLinkString,
      category: {
        categoryId: splitted[0],
        category: splitted[1],
      },
      postImgPath: '',
      excerpt: formData.value.excerpt,
      content: formData.value.context,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date(),
    };

    console.log('selectedImg', this.selectedImg);

    this.postService.uploadImage(
      this.selectedImg,
      postData,
      this.formStatus,
      this.docId
    );
    this.postForm.reset();
    this.imgSrc =
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHUAkgMBIgACEQEDEQH/xAAbAAEBAQEBAAMAAAAAAAAAAAAAAQUEAwIGB//EADkQAAIBAgMEBggDCQAAAAAAAAABAgMEBREhEhMxQRVRU3GRkiJCVGKhwdHhgcLxFCQmMjU2YYKy/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AP0IgKBAgUAAAIAUACFAAAAQBgEUgAoAAgAAoAAhSBAUAAQpORQAB6UaFWu8qNOUu7ggPIp13GHVbe33tSUeOTiuRyAACMAUnIAUAAQAAUAAQIBAUHrb21a5k40YbWXF56I0qWEU6cdu7raLknkvEDISbeyk23wSO6hhdxVSc0qUff4+Bs2kLeNNStYxUXzS4nnXt7utorpU49UIfPMDmVnYWSzuJqUvefyPOtjCUdm1pJLk5r5IPBJN5u4zfW4fcdCS9oXk+4HtYVnf2talXlnPhnlyfAxJRcJOMuMW0+9G7Y4bK0r7xVtpNZNbP3Pjd4Vv68qsauxtcVs56gYZGaV1hbt7edXfKWzy2fuZwE5AFAAACAACggABAAdmFV9zewTfoz9F/I9MahKN3m5ScJrOKb0XXkZ+qejyfWbV7++YXCuv54LaeXgwJCTjgGcW00nqn7xn28bq5nsUp1JPn6bSR3x/t99z/wCjmwm8p2spxqpqM8tUuGQHhcRuraexVqVE+K9N5M899W7ap52dWK3cLqpDdp7MM9Xpnn+hy21GVxWjShxfPqXWA39btqnnY31btqnnZs3uGKpRpQt9mMqemb5r9TGuaMrevKlPVx59YGq5OWA5ybby4t+8Yxspfw//AK/mMYAEABQQAAABQABAgEBTVwOsmqtvPVP0kvgzKPW0rOhc06nJPXu5ga1ei6GDVKT9XNLu2tDESbeSWbfJH2TEU6lhVUE5NpZJa56oxrPe2tTeOzqVJernFrL4AdUcHlK2zc9ms9cnw7mdmGWX7LSbmlvZcf8AC6jn6TufYanhL6DpO59hqeEvoBqmLjtLZq06qWklsv8AA9ek7n2Gp4S+h4XtzcXdHduzqRyeaey9PgB7L+gfh+YxnwNqUZQwJxmnFpaprL1jFAAACgACAACgACBFAEAKBoUMWq0qUKe7jLZWWbZ8+mq3Yw8WZZQNPpqr2MPFjpqt2MPMzL1KBp9NVexh4sdNVuxh4sywB33OKVLihKlKlFKXNNnAwAAAAoAAgAAFIOQAAAAAAAAAAAAAAAAAAAAAAAADkAAAAAAAAAAAAAAAAAAAAAAAAAAP/9k=';
    this.formStatus = 'Add New';
  }
}
