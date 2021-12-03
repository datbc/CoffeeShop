import { CartService } from './../../services/cart.service';
import { ProductService } from './../../services/product.service';
import { Product } from './../../common/product';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();
  constructor(private ProductService: ProductService,
              private cartService: CartService,
              private router: ActivatedRoute,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(() =>{
      this.handleProductDetails();
    })
  }

  handleProductDetails(){
    //get the "id" param string.
    const theProductId : number = +this.router.snapshot.paramMap.get('id')!;
    
    this.ProductService.getProductById(theProductId).subscribe(
      data =>{
        this.product = data;
      }
    )

  }

  addToCart(){
    this.toastr.success("Add Success", "Nottification", {
      progressBar: true,
      timeOut: 1000
    })  
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
    
  }

}
