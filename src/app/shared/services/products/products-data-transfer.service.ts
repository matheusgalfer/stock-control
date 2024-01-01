import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {
  public productsDataEmitter$ =
    new BehaviorSubject<Array<GetAllProductsResponse> | null>(null);
  public productsDatas: Array<GetAllProductsResponse> = [];

  setProductsDatas(productsDatas: Array<GetAllProductsResponse>) : void {
    if (productsDatas) {
      this.productsDataEmitter$.next(productsDatas);
      this.getProductsDatas();
    }
  }

  getProductsDatas() {
    this.productsDataEmitter$.pipe(
      take(1),
      map((data) => data?.filter((product) => product.amount > 0))
    )
      .subscribe({
        next: (response) => {
          if (response) {
            this.productsDatas = response;
          }
        }
      });
      return this.productsDatas;
  }
}