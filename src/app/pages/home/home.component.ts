import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { ESizeModal } from 'src/app/shared/utils/modal-size.enum';
import { IDataRecord } from 'src/app/shared/utils/records.interface';
import { ETypesButton } from 'src/app/shared/utils/type-button.enum';
import { AlertService } from '../../services/alert/alert.service';
import { EAlertType } from 'src/app/shared/utils/alert-type.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  totalRecords = 0;
  filterQuantityRecords = 5;
  currentPage = 1;
  totalPages = 1;
  totalData: IDataRecord[] = [];
  typeButton = ETypesButton;
  showData: IDataRecord[] = [];
  searchTerm = '';
  itemSelected: IDataRecord | null = null;
  showModalConfirm = false;
  sizeModal = ESizeModal;

  constructor(
    private productsService: ProductsService,
    private alertService: AlertService,
    private router: Router,
  ) {}

  ngOnInit() {
    /**
     * If the ID is empty or has few products, uncomment this line to load products
     */
    //this.productsService.pushRandomProducts();
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.totalData = data;
        this.totalRecords = this.totalData.length;
        this.changeQuantityRecords();

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
        console.log('Complete');
      },
    });
  }

  calculateTotal() {
    const value = Math.ceil(this.totalRecords / this.filterQuantityRecords);
    this.totalPages = value === 0 ? 1 : value;
  }

  changePage(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.changeQuantityRecords();
    }
  }

  changeQuantityRecords() {
    const filteredData = this.searchTerm
      ? this.totalData.filter((item) =>
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
        )
      : this.totalData;
    this.totalRecords = filteredData.length;
    if (this.totalRecords === 0) {
      this.currentPage = 1;
      this.totalPages = 1;
    }
    this.calculateTotal();
    let initalIndex = (this.currentPage - 1) * this.filterQuantityRecords;
    let finalIndex = this.currentPage * this.filterQuantityRecords;
    if (initalIndex >= this.totalRecords) {
      initalIndex = (this.totalPages - 1) * this.filterQuantityRecords;
      finalIndex = this.totalPages * this.filterQuantityRecords;
      this.currentPage = this.totalPages;
    }
    this.showData = filteredData.slice(initalIndex, finalIndex);
  }

  selectItem(item: IDataRecord) {
    this.itemSelected = item;
    this.showModalConfirm = true;
  }

  deleteProduct() {
    if (this.itemSelected) {
      const item = { ...this.itemSelected };
      this.productsService.deleteProduct(item.id).subscribe({
        next: () => {
          this.alertService.message$.next({
            description: `Producto: ${item.name} eliminado`,
            type: EAlertType.SUCCESS,
          });
          this.loadProducts();
        },
        error: (error) => {
          this.alertService.message$.next({
            description: `Ocurrió un error al eliminar el producto: ${item.name}`,
            type: EAlertType.ERROR,
          });
          console.error('Error', error);
        },
        complete: () => {
          this.itemSelected = null;
          this.showModalConfirm = false;
        },
      });
    }
  }

  editProduct(item: IDataRecord) {
    this.productsService.editableProduct$.next(item);
    this.router.navigateByUrl('/product/edit');
  }

  trackById(index: number, item: IDataRecord): string {
    return item.id;
  }
}
