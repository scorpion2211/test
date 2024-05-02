import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { EAlertType } from 'src/app/shared/utils/alert-type.enum';
import { IDataRecord } from 'src/app/shared/utils/records.interface';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { MOCK_RECORDS } from 'src/app/shared/utils/mocks';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productsService: ProductsService;
  let alertService: AlertService;
  let loadingService: LoadingService;
  let productServiceSpy: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    const editableProductSubject = new BehaviorSubject<IDataRecord | null>(null);
    const productServiceSpyObj = jasmine.createSpyObj('ProductsService', {
      addProduct: jasmine.createSpy(),
      verifyID: jasmine.createSpy(),
      updateProduct: jasmine.createSpy(),
      editableProduct$: new BehaviorSubject<IDataRecord | null>(null),
    });
    alertService = jasmine.createSpyObj('AlertService', ['message$']);

    productServiceSpyObj.editableProduct$ = editableProductSubject.asObservable();

    productServiceSpyObj.verifyID.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      declarations: [ProductComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, ButtonModule],
      providers: [
        AlertService,
        LoadingService,
        FormBuilder,
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'edit' } } } },
        { provide: ProductsService, useValue: productServiceSpyObj },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService);
    alertService = TestBed.inject(AlertService);
    loadingService = TestBed.inject(LoadingService);
    productServiceSpy = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and load params on ngOnInit', () => {
    spyOn(component, 'initializeForm').and.callThrough();
    spyOn(component, 'loadParams').and.callThrough();

    component.ngOnInit();

    expect(component.initializeForm).toHaveBeenCalled();
    expect(component.loadParams).toHaveBeenCalled();
    expect(component.isEditMode).toBeTrue();
    expect(loadingService.loading$.value).toBeFalse();
  });

  it('should initialize form', () => {
    component.initializeForm();

    expect(component.productForm).toBeDefined();
  });

  it('should load editable product', () => {
    const productData: IDataRecord | null = null;
    const editableProductSubject = new BehaviorSubject<IDataRecord | null>(null);
    const productServiceSpyObj = {
      addProduct: jasmine.createSpy(),
      verifyID: jasmine.createSpy(),
      updateProduct: jasmine.createSpy(),
      editableProduct$: editableProductSubject,
    };

    productServiceSpyObj.editableProduct$.next(productData);

    component.loadEditableProduct();

    expect(component.getProductData()).toEqual(productData);
  });

  it('should populate form with data', () => {
    const productData: IDataRecord = MOCK_RECORDS[0];
    component.populateFormWithData(productData);

    expect(component.productForm.value).toEqual(productData);
  });

  it('should fix date', () => {
    const date_release = '2024-05-01';
    const date_revision = '2025-05-01';
    component.fixDate(date_release, date_revision);
  });

  it('should submit form', () => {
    spyOn(component, 'resetForm').and.callThrough();

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

    expect(component.resetForm).not.toHaveBeenCalled();

    setTimeout(() => {
      expect(component.resetForm).toHaveBeenCalled();
    }, 1000);
  });
});
