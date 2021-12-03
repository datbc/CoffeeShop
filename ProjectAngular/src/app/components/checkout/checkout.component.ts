import { Purchase } from './../../common/purchase';
import { OrderItem } from './../../common/orderitem';
import { Order } from './../../common/order';
import { CheckoutService } from './../../services/checkout.service';
import { CartService } from './../../services/cart.service';
import { District } from './../../common/district';
import { City } from './../../common/city';
import { FormService } from './../../services/form.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;


  cities: City[] = [];
  districts: District[] = [];


  constructor(private formBuilder: FormBuilder,
              private formService: FormService,
              private cartService: CartService,
              private checkoutService : CheckoutService,
              private router : Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',[Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('',[Validators.required, Validators.minLength(2)]),
        email: new FormControl('',
        [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
        
      }),
      shippingAddress: this.formBuilder.group({
        street:  new FormControl('',[Validators.required, Validators.minLength(2)]),
        district: new FormControl('',[Validators.required]),
        city: new FormControl('',[Validators.required]),
        zipCode:  new FormControl('',[Validators.required, Validators.minLength(2)])
      })     
    });


    //populate cities

    this.formService.getCities().subscribe(
      data => {
        this.cities = data;
      }
    )
  }

  reviewCartDetails() {
    //subscribe to cartService.totalQuantity

    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    //subscribe to cartService.totalQuantity
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }


  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email(){
    return this.checkoutFormGroup.get('customer.email');
  }

  get shippingAddressCity(){
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressDistrict(){
    return this.checkoutFormGroup.get('shippingAddress.district');
  }

  get shippingAddressStreet(){
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressZipCode(){
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }


  onSubmit(){

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    
    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items
    const cartItems = this.cartService.cartItems;

    //create orderItem from cartItem
    let orderItems: OrderItem[] = [];
    for(let i=0; i < cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    // set up purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;


    //populate purchase - shippingAddress
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingCity: City = JSON.parse(JSON.stringify(purchase.shippingAddress.city));
    const shippingDistrict : District = JSON.parse(JSON.stringify(purchase.shippingAddress.district));
    purchase.shippingAddress.city = shippingCity.name;
    purchase.shippingAddress.district = shippingDistrict.name;

    //populate purchase - oder and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    //call Rest API via the checkoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response =>{
          this.toastr.success("Purchase Successfully", "Nottification", {
            progressBar: true,
            timeOut: 1000
          })
          //reset cart
          this.resetCart();
          
        },
        error: err =>{
          alert(`There was an error: ${err.message}`);
        }
      }
    )
  }
  resetCart() {
     // reset cart data
     this.cartService.cartItems = [];
     this.cartService.totalPrice.next(0);
     this.cartService.totalQuantity.next(0);
 
     // reset form
     this.checkoutFormGroup.reset();
 
     // back to products list
     this.router.navigateByUrl('/products');
  }

  // get districts by city code
  getDistricts(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const cityCode = formGroup?.value.city.code;
    const cityName = formGroup?.value.city.name;
    this.formService.getDistricts(cityCode).subscribe(
      data=>{
        if(formGroupName === 'shippingAddress'){
          this.districts = data;
        }
        
        //select first item by default
        formGroup?.get('district')?.setValue(data[0]);
      }     
    );    
  }

}
