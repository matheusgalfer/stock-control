import { MessageService } from 'primeng/api';
import { ProductsService } from './../../../../services/products/products.service';
import { Component, OnInit } from '@angular/core';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit{
  public productList: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private  productsDTService: ProductsDataTransferService
  ) {}

  ngOnInit(): void {
    this.getProductDatas();
  }

  getProductDatas() {
    this.productsService
      .GetAllProducts()
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productList = response;
            this.productsDTService.setProductsDatas(this.productList);
          }
        }, error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos',
            life: 2500,
          });
        },
      });
  }
}
