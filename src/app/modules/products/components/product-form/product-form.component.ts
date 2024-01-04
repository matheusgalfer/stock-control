import { ProductsService } from './../../../../services/products/products.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { MessageService } from 'primeng/api';

import { CategoriesService } from './../../../../services/categories/categories.service';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { descriptors } from 'chart.js/dist/core/core.defaults';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy{
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{name: string; code: string}> = [];

  public addPrductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required]
  });

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoriesService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response;
          }
        },
      });
  }

  handleSubmitAddProduct(): void {
    if (this.addPrductForm?.value && this.addPrductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addPrductForm.value.name as string,
        price: this.addPrductForm.value.price as string,
        description: this.addPrductForm.value.description as string,
        category_id: this.addPrductForm.value.category_id as string,
        amount: Number(this.addPrductForm.value.amount),
      }
      this.productsService
        .createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: "Produto criado com sucesso!",
                life: 2500,
              });
            }
          }, error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar produto',
              life: 2500,
            });
          }
        });
    }
    this.addPrductForm.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
