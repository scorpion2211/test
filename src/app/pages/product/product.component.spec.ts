import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { of, throwError } from 'rxjs';
import { EAlertType } from 'src/app/shared/utils/alert-type.enum';
import { IDataRecord } from 'src/app/shared/utils/records.interface';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'src/app/shared/components/button/button.module';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productsService: ProductsService;
  let alertService: AlertService;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductComponent],
      imports: [HttpClientTestingModule,ReactiveFormsModule, ButtonModule],
      providers: [
        ProductsService,
        AlertService,
        LoadingService,
        FormBuilder,
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'edit' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService);
    alertService = TestBed.inject(AlertService);
    loadingService = TestBed.inject(LoadingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and load params on ngOnInit', () => {
    const initializeFormSpy = spyOn(component, 'initializeForm').and.callThrough();
    const loadParamsSpy = spyOn(component, 'loadParams').and.callThrough();

    component.ngOnInit();

    expect(initializeFormSpy).toHaveBeenCalled();
    expect(loadParamsSpy).toHaveBeenCalled();
    expect(component.isEditMode).toBeTrue();
    expect(loadingService.loading$.value).toBeFalse();
  });

  it('should initialize form', () => {
    component.initializeForm();

    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('id')).toBeDefined();
    expect(component.productForm.get('name')).toBeDefined();
    expect(component.productForm.get('description')).toBeDefined();
    expect(component.productForm.get('logo')).toBeDefined();
    expect(component.productForm.get('date_release')).toBeDefined();
    expect(component.productForm.get('date_revision')).toBeDefined();
  });

  it('should load editable product', () => {
    const productData: IDataRecord = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: '2024-05-01',
      date_revision: '2025-05-01',
    };
    spyOn(productsService.editableProduct$, 'pipe').and.returnValue(of(productData));

    component.loadEditableProduct();

    expect(component.getProductData()).toEqual(productData);
    expect(component.populateFormWithData).toHaveBeenCalledWith(productData);
    expect(component.fixDate).toHaveBeenCalledWith('2024-05-01', '2025-05-01');
    expect(loadingService.loading$.value).toBeFalse();
  });

  it('should handle error when loading editable product', () => {
    spyOn(productsService.editableProduct$, 'pipe').and.returnValue(throwError('Error'));
    const consoleErrorSpy = spyOn(console, 'error');

    component.loadEditableProduct();

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(loadingService.loading$.value).toBeFalse();
    expect(alertService.message$.next).toHaveBeenCalledWith({
      description: 'Ocurrió un error inesperado',
      type: EAlertType.ERROR,
    });
  });

  it('should populate form with data', () => {
    const productData: IDataRecord = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: '2024-05-01',
      date_revision: '2025-05-01',
    };
    component.populateFormWithData(productData);

    expect(component.productForm.value).toEqual(productData);
  });

  it('should fix date', () => {
    const date_release = '2024-05-01';
    const date_revision = '2025-05-01';
    component.fixDate(date_release, date_revision);

    expect(component.productForm.get('date_release')?.value).toBe('2024-05-01');
    expect(component.productForm.get('date_revision')?.value).toBe('2025-05-01');
  });

  it('should submit form', () => {
    spyOn(component, 'resetForm');
    spyOn(component, 'addProcut');
    component.productForm.setValue({
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: '2024-05-01',
      date_revision: '2025-05-01',
    });

    component.onSubmit();

    expect(component.submitted).toBeTrue();
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.addProcut).toHaveBeenCalled();
  });
});
