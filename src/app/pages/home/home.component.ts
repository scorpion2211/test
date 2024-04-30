import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { IDataRecord } from 'src/app/shared/utils/records.interface';
import { ETypesButton } from 'src/app/shared/utils/type-button.enum';

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

  constructor(private productsService: ProductsService) {}

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
      },
      error: (error) => {
        console.error('Error', error);
      },
      complete: () => {
        console.log('Complete');
      },
    });
  }

  calculateTotal() {
    this.totalPages = Math.ceil(this.totalRecords / this.filterQuantityRecords);
  }

  changePage(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPages) {
      this.currentPage = pagina;
      this.changeQuantityRecords();
    }
  }

  changeQuantityRecords() {
    this.calculateTotal();
    let initalIndex = (this.currentPage - 1) * this.filterQuantityRecords;
    let finalIndex = this.currentPage * this.filterQuantityRecords;
    if (initalIndex >= this.totalRecords) {
      initalIndex = (this.totalPages - 1) * this.filterQuantityRecords;
      finalIndex = this.totalPages * this.filterQuantityRecords;
      this.currentPage = this.totalPages;
    }
    this.showData = this.totalData.slice(initalIndex, finalIndex);
  }

  deleteProduct(item: IDataRecord) {
    console.clear();
    this.productsService.deleteProduct(item.id).subscribe({
      next: (data) => {
        console.log('aca', data);
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error', error);
      },
      complete: () => {
        console.log('Complete');
      },
    });
  }

  editProduct(item: IDataRecord) {
    this.productsService.editableProduct$.next(item);
  }
}
