import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { IDataRecord } from '../../utils/records.interface';
import { ESizeModal } from '../../utils/modal-size.enum';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track by ID', () => {
    const item: IDataRecord = {
      id: '1',
      name: 'Test Product',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    };
    const index = 0;
    expect(component.trackById(index, item)).toBe('1');
  });

  it('should toggle dropdown', () => {
    const itemId = '1';
    component.toggleDropdown(itemId);
    expect(component.dropdownStates[itemId]).toBeTrue();
  });

  it('should close dropdown', () => {
    const itemId = '1';
    component.dropdownStates[itemId] = true;
    component.closeDropdown(itemId);
    expect(component.dropdownStates[itemId]).toBeFalse();
  });

  it('should select item', () => {
    const item: IDataRecord = {
      id: '1',
      name: 'Test Product',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    };
    spyOn(component.emitterItemSelected, 'emit');
    component.selectItem(item);
    expect(component.itemSelected).toEqual(item);
    expect(component.emitterItemSelected.emit).toHaveBeenCalledWith(item);
  });

  it('should calculate total pages', () => {
    component.totalRecords = 10;
    component.filterQuantityRecords = 3;
    component.calculateTotal();
    expect(component.totalPages).toBe(4);
  });

  it('should change page', () => {
    component.totalPages = 5;
    component.changePage(3);
    expect(component.currentPage).toBe(3);
  });

  it('should change quantity of records', () => {
    const searchTerm = 'test';
    const totalData: IDataRecord[] = [
      {
        id: '1',
        name: 'Test Product 1',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      },
      {
        id: '2',
        name: 'Test Product 2',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      },
    ];
    component.searchTerm = searchTerm;
    component._totalData = totalData;
    component.totalRecords = 2;
    component.currentPage = 2;
    component.totalPages = 1;
    component.filterQuantityRecords = 1;
    component.changeQuantityRecords();
    expect(component.showData.length).toBe(1);
    expect(component.showData[0].name).toBe('Test Product 2');
  });
});
