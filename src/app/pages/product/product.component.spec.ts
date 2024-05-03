import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { BehaviorSubject, of } from 'rxjs';
import { IDataRecord } from 'src/app/shared/utils/records.interface';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { MOCK_RECORDS } from 'src/app/shared/utils/mocks';
import { EAlertType } from 'src/app/shared/utils/alert-type.enum';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let loadingService: LoadingService;
  let alertService: AlertService;

  beforeEach(async () => {
    const editableProductSubject = new BehaviorSubject<IDataRecord | null>(null);
    const productServiceSpyObj = jasmine.createSpyObj('ProductsService', {
      addProduct: jasmine.createSpy(),
      verifyID: jasmine.createSpy(),
      updateProduct: jasmine.createSpy(),
      editableProduct$: new BehaviorSubject<IDataRecord | null>(null),
    });

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
    loadingService = TestBed.inject(LoadingService);
    alertService = TestBed.inject(AlertService);
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

    component.isEditMode = false;
    component.productForm.setValue(MOCK_RECORDS[0]);

    component.onSubmit();
    expect(component.submitted).toBeTrue();

    expect(component.resetForm).not.toHaveBeenCalled();

    setTimeout(() => {
      expect(component.resetForm).toHaveBeenCalled();
    }, 1000);
  });

  it('should show alert when trying to edit existing product ID', () => {
    const alertServiceSpy = spyOn(alertService.message$, 'next');

    component.isEditMode = true;
    component._productData = MOCK_RECORDS[0];
    const data = { ...MOCK_RECORDS[0], id: 'test1' };
    component.productForm.setValue(data);

    component.onSubmit();

    expect(alertServiceSpy).toHaveBeenCalledWith({
      description: `No se permite editar el ID de un producto existente`,
      type: EAlertType.INFO,
    });

    expect(component.productForm.get('id')?.value).toBe('esMuuS');
  });

  it('should return form controls', () => {
    const formBuilder = new FormBuilder();
    component.productForm = formBuilder.group({
      id: ['1'],
      name: ['Product 1'],
      description: ['Description 1'],
    });
    const controls = component.formControls;
    expect(controls['id']).toBeDefined();
    expect(controls['name']).toBeDefined();
    expect(controls['description']).toBeDefined();
  });
});
