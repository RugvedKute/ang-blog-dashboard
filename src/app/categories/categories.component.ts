import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Category } from '../models/category';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent {
  editCategory: any;
  categoryArray: any;
  formStatus: string = 'Add';
  editIdCategory: string = '';

  constructor(private categoriesService: CategoriesService) {
    this.categoriesService.loadData().subscribe((data) => {
      this.categoryArray = data;
    });
  }

  onSubmitCategory(formData: any) {
    const categoryFormData: Category = {
      category: formData.value.category,
    };

    if (this.formStatus == 'Add') {
      this.categoriesService.saveData(categoryFormData);
    } else if (this.formStatus == 'Edit') {
      this.categoriesService.editData(this.editIdCategory, categoryFormData);
      this.formStatus = 'Add'
    }
  
    formData.reset();
  }

  onEdit(editData: string, editId: string) {
    this.formStatus = 'Edit'
    this.editIdCategory = editId;
    this.editCategory = editData;
  }

  onDelete(id: string) {
    this.categoriesService.deleteData(id);

  }
}
