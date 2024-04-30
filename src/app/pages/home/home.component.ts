import { Component, OnInit } from '@angular/core';
import { MOCK_RECORDS } from 'src/app/shared/utils/mocks';
import { IDataRecords } from 'src/app/shared/utils/records.interface';

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
  totalData: IDataRecords[] = [];

  showData: IDataRecords[] = [];

  ngOnInit() {
    this.totalData = MOCK_RECORDS;
    this.totalRecords = this.totalData.length;
    this.showData = this.totalData.slice(0, this.filterQuantityRecords);
    this.calculateTotal();
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
}
