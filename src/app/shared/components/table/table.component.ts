import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { IDataRecord } from '../../utils/records.interface';
import { ESizeModal } from '../../utils/modal-size.enum';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnChanges {
  @Input() _totalData: IDataRecord[] = [];
  @Input() searchTerm = '';
  @Input() isLoadingTable = true;
  @Output() emitterItemSelected = new EventEmitter<IDataRecord>();
  @Output() editProduct = new EventEmitter<IDataRecord>();
  @Output() deleteProduct = new EventEmitter<IDataRecord>();

  public itemSelected: IDataRecord | null = null;
  public showModalDescription = false;
  public sizeModal = ESizeModal;
  public dropdownStates: { [key: string]: boolean } = {};
  public totalRecords = 0;
  public filterQuantityRecords = 5;
  public currentPage = 1;
  public totalPages = 1;
  public showData: IDataRecord[] = [];

  ngOnChanges(): void {
    this.totalRecords = this._totalData.length;
    this.changeQuantityRecords();
  }

  trackById(index: number, item: IDataRecord): string {
    return item.id;
  }

  toggleDropdown(itemId: string) {
    this.dropdownStates[itemId] = !this.dropdownStates[itemId];
  }

  closeDropdown(itemId: string) {
    this.dropdownStates[itemId] = false;
  }

  selectItem(item: IDataRecord) {
    this.itemSelected = item;
    this.emitterItemSelected.emit(item);
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
      ? this._totalData.filter((item) =>
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
        )
      : this._totalData;
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
}
