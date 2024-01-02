import { DeleteProductAction } from './../../../../models/interfaces/products/event/DeleteProductAction';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { MessageService, ConfirmationService } from 'primeng/api';

import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { ProductsService } from './../../../../services/products/products.service';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public productsDatas: Array<GetAllProductsResponse> = [];

  constructor (
    private productsService: ProductsService,
    private productsDTService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getServiceProductsDatas();
  }

  getServiceProductsDatas() {
    const productsLoaded = this.productsDTService.getProductsDatas();
    // se o usuario for pela url direto para /produtos sem passar pelo /dashboard
    // acontecerá de nao ter dados para carregar no loaded, por isso a condição
    // else traz os dados direto da API ja que não tem dados armazenados em memoria
    if (productsLoaded.length > 0) {
      this.productsDatas= productsLoaded;
    } else {
      this.getAPIProductsDatas();
    }
    // console.log('DADOS DE PRODUTOS', this.productsDatas);
  }

  getAPIProductsDatas() {
    this.productsService
      .GetAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
          }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar produtos',
          life: 2500,
        })
        this.router.navigate(['/dashboard']);
      },
    });
  }

  handleProductAction(event: EventAction): void {
    if (event) {
      console.log('DADOS DO EVENTO RECEBIDO', event)
    }
  }

  handleDeleteProductAction(event: {
    product_id:string,
     productName: string
  }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Confirmar a exclusão do produto: ${event?.productName}?`,
        header: 'Corfirmação de exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event?.product_id),
      })
      // console.log('DADOS RECEBIDOS DE DELETAR PRODUTO', event);
    }
  }

  deleteProduct(product_id: string): void {
    if (product_id) {
      // alert(product_id);
      this.productsService
        .deleteProduct(product_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto removido com sucesso!',
                life: 2500,
              });
              this.getAPIProductsDatas();
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Erro ao remover produto!',
              life: 2500,
            });
          }
        });

    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
