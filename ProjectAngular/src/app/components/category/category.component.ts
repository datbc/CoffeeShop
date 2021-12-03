import { ProductService } from './../../services/product.service';
import { Category } from './../../common/category';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  // category list
  categories: Category[] = [];

  // storage from session
  storage: Storage = sessionStorage;

  isAdmin: number = 0;

  constructor(private productService: ProductService) {
    if (JSON.parse(this.storage.getItem('admin') as string) !== null) {
      this.isAdmin = JSON.parse(this.storage.getItem('admin') as string);
    }
  }

  ngOnInit(): void {
    this.listCategories();
  }

  listCategories() {
    let page = 0;
    let size = 10;
    this.productService.getCategories(page, size).subscribe(
      data => {
        this.categories = data.content;
      }
    )
  }
  

}
