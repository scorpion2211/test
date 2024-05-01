import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDataRecord } from '../../utils/records.interface';
import { ESizeModal } from '../../utils/modal-size.enum';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() data: IDataRecord[] = [];
  @Output() emitterItemSelected = new EventEmitter<IDataRecord>();
  @Output() editProduct = new EventEmitter<IDataRecord>();
  @Output() deleteProduct = new EventEmitter<IDataRecord>();

  public itemSelected: IDataRecord | null = null;
  public showModalDescription = false;
  public sizeModal = ESizeModal;
  public dropdownStates: { [key: string]: boolean } = {};

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
}
