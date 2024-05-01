import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { IDataRecord } from 'src/app/shared/utils/records.interface';
import { AlertService } from '../../services/alert/alert.service';
import { EAlertType } from 'src/app/shared/utils/alert-type.enum';
import { ETypesButton } from 'src/app/shared/utils/type-button.enum';
import { ESizeModal } from 'src/app/shared/utils/modal-size.enum';
import { Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public typeButton = ETypesButton;
  public searchTerm = '';
  public itemSelected: IDataRecord | null = null;
  public showModalConfirm = false;
  public showModalDescription = false;
  public sizeModal = ESizeModal;
  public isLoadingTable = false;
  public _totalData: IDataRecord[] = [];

  constructor(
    private productsService: ProductsService,
    private alertService: AlertService,
    private router: Router,
    private loadingService: LoadingService,
  ) {}

  ngOnInit() {
    /**
     * If the ID is empty or has few products, uncomment this line to load products
     */
    //this.productsService.pushRandomProducts();
    this.loadProducts();
  }

  private loadProducts() {
    this.isLoadingTable = true;
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this._totalData = data;

        /**
         * If you want to clear the list for some reason, uncomment the following line
         */
        //this.productsService.removeAllProducts(data);
      },
      error: (error) => {
        this.alertService.message$.next({
          description: 'Ocurrió un error al cargar los productos',
          type: EAlertType.ERROR,
        });
        console.error('Error', error);
      },
      complete: () => {
        /**
         * A timer is set so that the skeleton for the exercise can be appreciated
         */
        setTimeout(() => {
          this.isLoadingTable = false;
        }, 2000);
      },
    });
  }

  selectItemToBeDeleted(item: IDataRecord) {
    this.itemSelected = item;
    this.showModalConfirm = true;
  }

  deleteProduct() {
    if (this.itemSelected) {
      this.loadingService.loading$.next(true);
      const item = { ...this.itemSelected };
      this.productsService
        .verifyID(item.id)
        .pipe(
          switchMap((exist) => {
            if (exist) {
              return this.productsService.deleteProduct(item.id);
            }
            this.alertService.message$.next({
              description: `El producto ${item.name} no existe`,
              type: EAlertType.WARNING,
            });
            return of();
          }),
        )
        .subscribe({
          next: () => {
            this.alertService.message$.next({
              description: `Producto ${item.name} eliminado`,
              type: EAlertType.SUCCESS,
            });
            this.searchTerm = '';
            this.loadProducts();
          },
          error: (error) => {
            this.showModalConfirm = false;
            this.loadingService.loading$.next(false);
            this.alertService.message$.next({
              description: `Ocurrió un error al eliminar el producto: ${item.name}`,
              type: EAlertType.ERROR,
            });
            console.error('Error', error);
          },
          complete: () => {
            this.itemSelected = null;
            this.showModalConfirm = false;
            this.loadingService.loading$.next(false);
          },
        });
    }
  }

  editProduct(item: IDataRecord) {
    this.productsService.editableProduct$.next(item);
    this.router.navigateByUrl('/product/edit');
  }
}
