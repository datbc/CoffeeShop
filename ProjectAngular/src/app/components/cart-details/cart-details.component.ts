import { CartService } from './../../services/cart.service';
import { CartItem } from './../../common/cart-item';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems : CartItem[] = [];
  totalPrice : number = 0;
  totalQuantity : number = 0;

  // delete cartItem
  deleteCartItem: CartItem = null!;

  constructor(private cartService: CartService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    // get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    //subscribe to the cart total price
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //subscribe to the cart total quantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    //compute cart total price and quantity
    this.cartService.computeCartTotals();

  }

  incrementQuantity(theCartItem : CartItem){
    this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem){
    this.cartService.decreamentQuantity(theCartItem);
  }

  // delete cart item
  removeItem(cartItem: CartItem) {
    this.deleteCartItem = cartItem;
    Swal.fire({
      title: 'Delete product',
      text: `Do you want to delete ${this.deleteCartItem.name}?!`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(
      result => {
        if (result.value) {
          this.toastr.success("Deleted Success", "Notification", {
            progressBar: true,
            timeOut: 1000
          })
          this.remove();
        } 
      }
      )
  }

  remove() {
    this.cartService.remove(this.deleteCartItem);
  }

}
