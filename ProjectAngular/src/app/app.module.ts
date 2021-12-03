import { ProductService } from './services/product.service';
import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { Routes, RouterModule, Router } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartComponent } from './components/cart/cart.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminProductComponent } from './admin-components/admin-product/admin-product.component';
import { AddProductComponent } from './admin-components/add-product/add-product.component';
import { UpdateProductComponent } from './admin-components/update-product/update-product.component';
import { MatTooltipModule} from '@angular/material/tooltip';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import {
  OKTA_CONFIG,
  OktaAuthModule,
  OktaCallbackComponent,
  OktaAuthGuard,
} from '@okta/okta-angular';

import myappConfig from './config/myapp-config';
import { OktaAuth } from '@okta/okta-auth-js';

const oktaConfig = Object.assign({
  onAuthRequired: (oktaAuth, injector) => {
    const router = injector.get(Router);
    // Redirect the user to your custom login page
    router.navigate(['/login']);
  }
}, myappConfig.oidc);

const routes: Routes = [
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path: 'admin-product', component: AdminProductComponent},
  {path: 'admin-product/add', component: AddProductComponent},
  {path: 'admin-product/:id', component: UpdateProductComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword' ,component: ProductListComponent},
  {path: 'category/:id/:name', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  { path: '**', component: NotFoundPageComponent },
  { path: 'error', component: NotFoundPageComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    CategoryComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartComponent,
    CartDetailsComponent,
    CheckoutComponent,
    NotFoundPageComponent,
    AdminProductComponent,
    AddProductComponent,
    UpdateProductComponent,
    LoginComponent,
    LoginStatusComponent,
    
    
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatTooltipModule,
    OktaAuthModule,
  ],
  providers: [ProductService, {provide: OKTA_CONFIG, useValue: oktaConfig}],
  bootstrap: [AppComponent]
})
export class AppModule { }
