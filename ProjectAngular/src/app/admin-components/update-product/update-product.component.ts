import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/common/category';
import { Product } from 'src/app/common/product';
import { ErrMessage } from 'src/app/common/validator/err-message';
import { FileService } from 'src/app/services/file.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  
  @ViewChild('input') input!: ElementRef;

  // product list
  categoryList: Category[] = [];
  product = new Product();

  // product form
  editProductFormGroup!: FormGroup;

  // file image name
  filename!: string;

  // error message
  errMessage = ErrMessage;

  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private fileService: FileService,            
              private toastr: ToastrService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });

    this.editProductFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2), 
                                Validators.maxLength(255)], ),
      category: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(2), 
                                Validators.maxLength(255)]),
      unitPrice: new FormControl('', [Validators.required, Validators.min(1), 
                                      Validators.pattern('[0-9]{1,4}'), Validators.max(1000)]),
      status: new FormControl('', Validators.required)
    });

    this.getCategory();
  }
  
  handleProductDetails() {
    // get Id param string. convert string to number.
    const productId: number = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(productId).subscribe(
      data => {
        this.product = data;
        this.editProductFormGroup.patchValue({
          name: this.product.name,
          category: this.product.category.name,
          description: this.product.description,
          unitPrice: this.product.unitPrice,
          status: this.product.active
        })
      }
    )
  }

  getCategory() {
    this.productService.getCategories(0, 100).subscribe(
      data => {
        this.categoryList = data.content;
      }
    );
  }

  // setter for product form
  get name() {
    return this.editProductFormGroup.get('name');
  }

  get category() {
    return this.editProductFormGroup.get('category');
  }

  get description() {
    return this.editProductFormGroup.get('description');
  }

  get unitPrice() {
    return this.editProductFormGroup.get('unitPrice');
  }

  get status() {
    return this.editProductFormGroup.get('status');
  }

  onSubmit() {
    if (this.editProductFormGroup.invalid) {
      this.editProductFormGroup.markAllAsTouched();
      return;
    }

    this.product.name = this.editProductFormGroup.get('name')?.value;
    this.product.category.name = this.editProductFormGroup.get('category')?.value;
    this.product.description = this.editProductFormGroup.get('description')?.value;
    this.product.unitPrice = this.editProductFormGroup.get('unitPrice')?.value;
    this.product.active = Number(this.editProductFormGroup.get('status')?.value);

    this.productService.updateProduct(this.product).subscribe({
      next: response => {
        this.toastr.success('Product has been updated', 'Notification!');
        this.router.navigateByUrl('/admin-product');
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    }); 
  }
  
  // change product image
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
    this.product.name = this.editProductFormGroup.get('name')?.value;
    this.productService.updateProduct(this.product).subscribe({
      next: response => {
        // this.toastr.success('Product image has been updated', 'Notification!');
      },
      error: err => {
        console.log(err);
        this.toastr.error("Error response");
        this.router.navigateByUrl('/error');
      }
    });
  }
    
  // tab loop circle
  onKey(event: any) {
    if (event.key === 'Tab') {
      this.input.nativeElement.focus();
    }
  }

}
