import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductsService } from 'src/app/services/products/products.service';
import { AlertService } from '../../services/alert/alert.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { EAlertType } from 'src/app/shared/utils/alert-type.enum';
import { ETypesButton } from 'src/app/shared/utils/type-button.enum';
import { ESizeModal } from 'src/app/shared/utils/modal-size.enum';
import { IDataRecord } from 'src/app/shared/utils/records.interface';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let productsService: ProductsService;
  let alertService: AlertService;
  let loadingService: LoadingService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [ProductsService, AlertService, LoadingService],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService);
    alertService = TestBed.inject(AlertService);
    loadingService = TestBed.inject(LoadingService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.typeButton).toEqual(ETypesButton);
    expect(component.searchTerm).toEqual('');
    expect(component.itemSelected).toBeNull();
    expect(component.showModalConfirm).toBeFalsy();
    expect(component.showModalDescription).toBeFalsy();
    expect(component.sizeModal).toEqual(ESizeModal);
    expect(component.isLoadingTable).toBeFalsy();
    expect(component._totalData).toEqual([]);
  });

  it('should load products on ngOnInit', () => {
    const products: IDataRecord[] = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        logo: 'logo1.png',
        date_release: '2024-05-01',
        date_revision: '2024-05-02',
      },
    ];
    spyOn(productsService, 'getProducts').and.returnValue(of(products));

    component.ngOnInit();

    expect(component.isLoadingTable).toBeTruthy();
    expect(productsService.getProducts).toHaveBeenCalled();
    expect(component._totalData).toEqual(products);
    expect(component.isLoadingTable).toBeFalsy();
  });

  it('should handle error when loading products on ngOnInit', () => {
    spyOn(productsService, 'getProducts').and.returnValue(throwError('Error'));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(component.isLoadingTable).toBeTruthy();
    expect(productsService.getProducts).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(alertService.message$.next).toHaveBeenCalledWith({
      description: 'Ocurrió un error al cargar los productos',
      type: EAlertType.ERROR,
    });
    expect(component.isLoadingTable).toBeFalsy();
  });

  it('should select item to be deleted', () => {
    const item: IDataRecord = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: '2024-05-01',
      date_revision: '2024-05-02',
    };

    component.selectItemToBeDeleted(item);

    expect(component.itemSelected).toEqual(item);
    expect(component.showModalConfirm).toBeTruthy();
  });

  it('should delete product', () => {
    const item: IDataRecord = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: '2024-05-01',
      date_revision: '2024-05-02',
    };
    spyOn(productsService, 'verifyID').and.returnValue(of(true));
    spyOn(productsService, 'deleteProduct').and.returnValue(of(''));
    spyOn(alertService.message$, 'next');
    spyOn(loadingService.loading$, 'next');

    component.itemSelected = item;
    component.deleteProduct();

    expect(productsService.verifyID).toHaveBeenCalledWith(item.id);
    expect(productsService.deleteProduct).toHaveBeenCalledWith(item.id);
    expect(alertService.message$.next).toHaveBeenCalledWith({
      description: `Producto ${item.name} eliminado`,
      type: EAlertType.SUCCESS,
    });
    expect(component.searchTerm).toEqual('');
    expect(component.isLoadingTable).toBeTruthy();
  });

  it('should handle error when deleting product', () => {
    const item: IDataRecord = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: '2024-05-01',
      date_revision: '2024-05-02',
    };
    spyOn(productsService, 'verifyID').and.returnValue(of(true));
    spyOn(productsService, 'deleteProduct').and.returnValue(throwError('Error'));
    spyOn(alertService.message$, 'next');
    spyOn(loadingService.loading$, 'next');

    component.itemSelected = item;
    component.deleteProduct();

    expect(productsService.verifyID).toHaveBeenCalledWith(item.id);
    expect(productsService.deleteProduct).toHaveBeenCalledWith(item.id);
    expect(alertService.message$.next).toHaveBeenCalledWith({
      description: `Ocurrió un error al eliminar el producto: ${item.name}`,
      type: EAlertType.ERROR,
    });
    expect(component.showModalConfirm).toBeFalsy();
    expect(loadingService.loading$.next).toHaveBeenCalledWith(false);
  });

  it('should not delete product if it does not exist', () => {
    const item: IDataRecord = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: '2024-05-01',
      date_revision: '2024-05-02',
    };
    spyOn(productsService, 'verifyID').and.returnValue(of(false));
    spyOn(productsService, 'deleteProduct');
    spyOn(alertService.message$, 'next');

    component.itemSelected = item;
    component.deleteProduct();

    expect(productsService.verifyID).toHaveBeenCalledWith(item.id);
    expect(productsService.deleteProduct).not.toHaveBeenCalled();
    expect(alertService.message$.next).toHaveBeenCalledWith({
      description: `El producto ${item.name} no existe`,
      type: EAlertType.WARNING,
    });
  });

  it('should edit product', () => {
    const item: IDataRecord = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: '2024-05-01',
      date_revision: '2024-05-02',
    };
    spyOn(productsService.editableProduct$, 'next');
    spyOn(router, 'navigateByUrl');

    component.editProduct(item);

    expect(productsService.editableProduct$.next).toHaveBeenCalledWith(item);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/product/edit');
  });
});
