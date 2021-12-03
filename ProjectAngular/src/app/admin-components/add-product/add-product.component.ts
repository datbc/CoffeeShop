import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/common/category';
import { Product } from 'src/app/common/product';
import { ErrMessage } from 'src/app/common/validator/err-message';
import { FileService } from 'src/app/services/file.service';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  @ViewChild('input') input!: ElementRef;

  filename!: string;
  product = new Product();

  // category list
  categoryList: Category[] = [];
  categoryProduct = new Category();

  // category form
  addProductFormGroup!: FormGroup;

  // error message
  errMessage = ErrMessage;

  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private fileService: FileService,
              private toastr: ToastrService,
              private router: Router) { }

  ngOnInit(): void {
    this.addProductFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255)], ),
      category: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255),]),
      unitPrice: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('[0-9]{1,4}'), Validators.max(1000)]),
    });
    this.getCategory();
  }

 // getter for form
  get name() {
    return this.addProductFormGroup.get('name');
  }

  get category() {
    return this.addProductFormGroup.get('category');
  }

  get description() {
    return this.addProductFormGroup.get('description');
  }

  get unitPrice() {
    return this.addProductFormGroup.get('unitPrice');
  }


  onSubmit() {
    if (this.addProductFormGroup.invalid) {
      this.addProductFormGroup.markAllAsTouched();
      return;
    }
    
    let categoryProduct = new Category();
    categoryProduct.id = this.addProductFormGroup.get('category')?.value;

    // set up product
    let product = new Product();
    product.id = 0;
    product.name = this.addProductFormGroup.get('name')?.value;
    product.category = categoryProduct;
    product.description = this.addProductFormGroup.get('description')?.value;
    product.unitPrice = this.addProductFormGroup.get('unitPrice')?.value;
    product.active = 1;
    product.isDeleted = 0;
    product.imageUrl = '';
    

    this.productService.addProduct(product).subscribe({
      next: response => {
        this.toastr.success('Product has been added', 'Notification!');
        this.confirmContinute();
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    }); 
  }

  onUploadFiles(file: File): void {
    const formData = new FormData();
    formData.append('file', file, file.name); 
    
    this.filename = file.name;
    console.log('file' +this.filename);
    
    this.product.imageUrl = `assets/images/products/${this.filename}`;
    
    this.updateImage();
    
    this.fileService.upload(formData).subscribe(
      data => {}
      );
    }

  updateImage() {
    // set up category
    this.product.name = this.addProductFormGroup.get('name')?.value;
    this.productService.updateProduct(this.product).subscribe({
      next: response => {
        this.toastr.success('Product image has been updated', 'Notification!');
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    });
  }

  getCategory() {
    this.productService.getCategories(0, 100).subscribe(
      data => {
        this.categoryList = data.content;
      }
    );
  }

  confirmContinute() {
    Swal.fire({
      title: 'Continute',
      text: 'Do you want to continute add product?!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(
      result => {
        if (result.value) {
          this.resetForm();
        } else {
          this.router.navigateByUrl('/admin-product');
        }
      }
    )
  }

  resetForm() {
    this.addProductFormGroup.reset();
  }
  
  // tab loop circle
  onKey(event: any) {
    if (event.key === 'Tab') {
      this.input.nativeElement.focus();
    }
  }
}
