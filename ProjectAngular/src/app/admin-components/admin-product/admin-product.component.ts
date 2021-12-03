import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from './../../services/product.service';
import { FormControl, Validators } from '@angular/forms';
import { Product } from './../../common/product';
import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.css']
})
export class AdminProductComponent implements OnInit {
  // product list
  productList: Product[] = [];
  sortProduct: Product[] = [];
  detailProduct!: Product;
  updateProduct!: Product;
  deleteProduct!: Product;

  // page
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;
  startElement: number = 0;
  endElement: number = 0;
  inputPage = new FormControl();

  // search
  search = new FormControl();
  searchName: string = '';

  productIdsDelete: number[] = [];


  constructor(private productService: ProductService,
              private toastr: ToastrService, 
              private router: Router) { }

  ngOnInit(): void {
    this.listProduct();
    this.inputPage.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe(
      value => {
        console.log('1')
        this.pageNumber = value;
      }
    )

    this.search.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(
      value => {
        console.log(value);
        this.searchName = value;
        this.handleProductByName(this.searchName);
      }
    )
  }

  isDeleteSelected(productId: number) {
    
    return this.productIdsDelete.find(x => x === productId) !== undefined;
  } 

  onDeleteCheckboxClicked(productId: number) {
    if(this.productIdsDelete.findIndex(x => x== productId) === -1) {
      this.productIdsDelete.push(productId);
      console.log(this.productIdsDelete);
      return;
    }
    
    this.productIdsDelete = this.productIdsDelete.filter(x => x !== productId);
    console.log(this.productIdsDelete);
  }

  // openDeleteMultipleProduct(product[]: Product[]) {
  //   this.productIdsDelete = product;
  //   Swal.fire({
  //     title: 'Delete Product',
  //     text: 'Do you want to delete product?!',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, keep it'
  //   }).then(
  //     result => {
  //       if (result.value) {
  //         this.deleteMultipleProduct();
  //       } 
  //     }
  //   )
  // }

  deleteMultipleProduct() {
    Swal.fire({
      title: 'Delete Product',
      text: 'Do you want to delete product?!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(
      result => {
        if (result.value) {
          this.productService.deleteMultiple(this.productIdsDelete).subscribe(
            data => {
      
                // product has been deleted
                Swal.fire({
                  title: 'Product has been deleted!',
                  text: 'Do you want to reload page?',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, reload page!',
                  cancelButtonText: 'No, keep it'
                }).then(
                  result => {
                    if (result.value) {
                      this.listProduct();
                    }
                  }
                )
              
            }
          )
        } 
      }
    )
    
  }

  listProduct() {
    this.handleProductByName(this.searchName);
  }

  handleListAllProduct() {
    this.productService.getProductListPaginateDesc(this.pageNumber - 1, this.pageSize, 'dateCreated').subscribe(this.processResult());
  }

  handleProductByName(name: string) {
    this.productService.searchProductsPaginate(name, this.pageNumber - 1, this.pageSize, 'dateCreated').subscribe(this.processResult());
  }

  processResult() {
    return data => {
        this.productList = data.content;
        this.pageNumber = data.number + 1;
        this.pageSize = data.size;
        this.totalElements = data.totalElements;
        this.startElement = (this.pageNumber - 1) * this.pageSize + 1;
        this.endElement = this.startElement + this.pageSize - 1;
        if (this.endElement > this.totalElements) {
          this.endElement = this.totalElements
        }
    };
  }

  openUpdateProduct(product: Product) {
    this.updateProduct = product;
    this.productService.getProductById(this.updateProduct.id).subscribe(
      data => {
        if (data === null) {
          // product has been deleted
          Swal.fire({
            title: 'Product has been deleted!',
            text: 'Do you want to reload page?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, reload page!',
            cancelButtonText: 'No, keep it'
          }).then(
            result => {
              if (result.value) {
                this.listProduct();
              }
            }
          )
        } else if (JSON.stringify(this.updateProduct) === JSON.stringify(data)) {
         
          this.router.navigateByUrl(`/admin-product/${this.updateProduct.id}`);
        } else {
          // product has been updated
          Swal.fire({
            title: 'Product has been updated!',
            text: 'Do you want to reload page?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, reload page!',
            cancelButtonText: 'No, keep it'
          }).then(
            result => {
              if (result.value) {
                this.listProduct();
              }
            }
          )
        }
      }
    )
  }

  openDeleteProduct(product: Product) {
    this.deleteProduct = product;
    Swal.fire({
      title: 'Delete Product',
      text: 'Do you want to delete product?!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(
      result => {
        if (result.value) {
          this.removeProduct();
        } 
      }
    )
  }

  removeProduct() {
    this.productService.getProductById(this.deleteProduct.id).subscribe(
      data => {
        if (data === null) {
          // product has been deleted
          Swal.fire({
            title: 'Product has been deleted!',
            text: 'Do you want to reload page?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, reload page!',
            cancelButtonText: 'No, keep it'
          }).then(
            result => {
              if (result.value) {
                this.listProduct();
              }
            }
          )
        } else if (JSON.stringify(this.deleteProduct) === JSON.stringify(data)) {
          // product can delete
          this.deleteProduct.isDeleted = 1;
          
          this.productService.updateProduct(this.deleteProduct).subscribe({
            next: response => {
              this.toastr.success('Product has been deleted', 'Delete product successfully!');
              this.listProduct();
            },
            error: err => {
              console.log(err);
              this.toastr.error("Error response");
              this.router.navigateByUrl('/error');
            }
          });
        } else {
          // product has been updated
          Swal.fire({
            title: 'Product has been updated!',
            text: 'Do you want to reload page?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, reload page!',
            cancelButtonText: 'No, keep it'
          }).then(
            result => {
              if (result.value) {
                this.listProduct();
              }
            }
          )
        }
      }
    )
  }


  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProduct();
  }


  goToPage() {
    console.log('hello')
    this.inputPage.setValidators([Validators.pattern('[0-9]{1,2}'), Validators.min(1), Validators.max(this.totalElements / this.pageSize + 1)]);
    
    if(this.inputPage.invalid) {
      this.inputPage.setValue(1);
      console.log(2)
      return;
    }

    
  }

  doSearch() {
    this.search.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(
      value => {
        console.log(value);
        this.searchName = value;
        this.handleProductByName(this.searchName);
      }
    )
  }

  reset() {
    this.search.setValue('');
  }

}
