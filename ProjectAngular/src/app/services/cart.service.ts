import { CartItem } from './../common/cart-item';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice : Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity : Subject<number> = new BehaviorSubject<number>(0);

  storage : Storage = sessionStorage;

  constructor() {
    //read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if(data != null){
      this.cartItems = data;
    }

    //compute totals based on the data that is read from storage
    this.computeCartTotals();

   }

  addToCart(theCartItem: CartItem){
    // check if we already have the item in our cart

    let alreadyExistsInCart : boolean = false;
    let existingCartItem : CartItem = undefined!;
    existingCartItem = this.cartItems.find(CartItem => CartItem.id === theCartItem.id)!;
  

    if(existingCartItem){
      // increament the quantity
      existingCartItem.quantity++;

    }else{
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }

    //compute cart total price and total quantity
    this.computeCartTotals();

  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
   
    this.logCartData(totalPriceValue, totalQuantityValue);

    // new cart data 
    this.newCartItems();
  }

  newCartItems(){
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems));
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    for(let cartItem of this.cartItems){
      const subTotalPrice = cartItem.quantity * cartItem.unitPrice; 
    }
  }

  decreamentQuantity(theCartItem: CartItem) {

    theCartItem.quantity--;
    if(!theCartItem.quantity){
      this.remove(theCartItem);
      return;
    }

    this.computeCartTotals();
  }

  remove(theCartItem: CartItem) {
    //get index of item in the array

    const itemIndex = this.cartItems.findIndex(cartItem => cartItem.id === theCartItem.id);
    
    //if found, remove the item from the array at the given index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }

}
