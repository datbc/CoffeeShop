import { Category } from './../common/category';
import { Product } from './../common/product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:9999/api/products'

  private categoryUrl = 'http://localhost:9999/api/category'

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate(page: number, pageSize: number, sort: string): Observable<ResponseProducts> {
    // build URL paging
    const searchUrl = `${this.baseUrl}?isDeleted=0&page=${page}&size=${pageSize}&sort=${sort}`;
    return this.httpClient.get<ResponseProducts>(searchUrl);
}

  getProductListPaginateDesc(page: number, pageSize: number, sort: string): Observable<ResponseProducts> {
    // build URL paging
    const searchUrl = `${this.baseUrl}/findAllDesc?isDeleted=0&page=${page}&size=${pageSize}&sort=${sort}`;
    return this.httpClient.get<ResponseProducts>(searchUrl);
  }

  getProductListByCategoryPaginate(categoryId: number, page: number, pageSize: number, sort: string): Observable<ResponseProducts> {
    // build URL based on categoryId
    const searchUrl = `${this.baseUrl}/findByCategoryId?categoryId=${categoryId}&isDeleted=0&page=${page}&size=${pageSize}&sort=${sort}`;
    return this.httpClient.get<ResponseProducts>(searchUrl);
  }
    
  searchProductsPaginate(keyword: string, page: number, pageSize: number, sort: string): Observable<ResponseProducts> {
    // build URL based on keyword
    const searchUrl = `${this.baseUrl}/findByNameContaining?productName=${keyword}&isDeleted=0&page=${page}&size=${pageSize}&sort=${sort}`;
    return this.httpClient.get<ResponseProducts>(searchUrl);
  }

  getProductById(productId: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}/findById?id=${productId}&isDeleted=0`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(`${this.baseUrl}`, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.httpClient.put<Product>(`${this.baseUrl}/${product.id}`, product);
  }


  getCategories(page: number, pageSize: number): Observable<ResponseCategories> {
    return this.httpClient.get<ResponseCategories>(`${this.categoryUrl}?isDeleted=0&page=${page}&size=${pageSize}`);
  }

  deleteMultiple(ids:number[]):Observable<any>{

    const url = `${this.baseUrl}/removeMultiple`;
    
    return this.httpClient.post<any>(url,{ids});
  }


}

  

interface ResponseProducts {
  content: Product[];
  size: number,
  totalElements: number,
  totalPages: number,
  number: number
}

interface ResponseCategories {
  content: Category[];
  size: number,
  totalElements: number,
  totalPages: number,
  number: number
}


