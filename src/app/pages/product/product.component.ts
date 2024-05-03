import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, of, switchMap, take } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { EAlertType } from 'src/app/shared/utils/alert-type.enum';
import { IDataRecord } from 'src/app/shared/utils/records.interface';
import { ESizeButton, ETypesButton } from 'src/app/shared/utils/type-button.enum';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, OnDestroy {
  public productForm!: FormGroup;
  public isEditMode = false;
  public submitted = false;
  public typeButton = ETypesButton;
  public sizeButton = ESizeButton;

  _productData: IDataRecord | null = null;
  subscription = new Subscription();
  constructor(
    private productsService: ProductsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private loadingService: LoadingService,
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.loadingService.loading$.next(true);
    this.initializeForm();
    this.loadParams();
  }

  initializeForm() {
    this.productForm = this.formBuilder.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
          Validators.pattern(/^[^\s]+$/),
        ],
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required, this.validateURLImage],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    });

    const dateReleaseControl = this.productForm.get('date_release');
    const dateRevisionControl = this.productForm.get('date_revision');
    if (dateReleaseControl && dateRevisionControl) {
      this.subscription = dateReleaseControl.valueChanges.subscribe((value) => {
        if (value) {
          const releaseDate = new Date(value);
          const revisionDate = new Date(releaseDate);
          revisionDate.setFullYear(releaseDate.getFullYear() + 1);
          const dateRevisionISO = revisionDate.toISOString().split('T')[0];
          dateRevisionControl.setValue(dateRevisionISO);
        }
      });
    }
  }

  loadParams() {
    const action = this.route.snapshot.paramMap.get('action');
    if (action === 'edit') {
      this.isEditMode = true;
      if (action) {
        this.loadEditableProduct();
      }
      return;
    }
    this.loadingService.loading$.next(false);
  }

  loadEditableProduct() {
    this.productsService.editableProduct$.pipe(take(1)).subscribe((data) => {
      if (data) {
        this._productData = data;
        this.populateFormWithData(data);
        this.fixDate(this._productData.date_release, this._productData.date_revision);
      }
      this.loadingService.loading$.next(false);
    });
  }

  populateFormWithData(data: IDataRecord) {
    this.productForm.patchValue(data);
  }

  fixDate(date_release: string, date_revision: string) {
    const dateReleaseControl = this.productForm.get('date_release');
    const dateRevisionControl = this.productForm.get('date_revision');
    if (dateReleaseControl && dateRevisionControl) {
      const date_release_ISO = new Date(date_release).toISOString().split('T')[0];
      const date_revision_ISO = new Date(date_revision).toISOString().split('T')[0];
      dateReleaseControl.setValue(date_release_ISO);
      dateRevisionControl.setValue(date_revision_ISO);
    }
  }

  get formControls() {
    return this.productForm.controls;
  }

  onSubmit() {
    if (this.isEditMode && this.productForm.get('id')?.value !== this._productData?.id) {
      this.alertService.message$.next({
        description: `No se permite editar el ID de un producto existente`,
        type: EAlertType.INFO,
      });
      this.productForm.get('id')?.setValue(this._productData?.id);
      return;
    }
    this.submitted = true;
    if (this.productForm.invalid) {
      return;
    }
    this._productData = this.productForm.value as IDataRecord;
    if (this._productData) {
      this.loadingService.loading$.next(true);
      if (this.isEditMode) {
        this.editProcut(this._productData);
        return;
      }
      this.addProcut(this._productData);
      return;
    }
    this.alertService.message$.next({
      description: `Ocurrió un error inesperado`,
      type: EAlertType.ERROR,
    });
  }

  editProcut(data: IDataRecord) {
    this.productsService
      .verifyID(data.id)
      .pipe(
        take(1),
        switchMap((exist) => {
          if (exist) {
            return this.productsService.updateProduct(data).pipe(take(1));
          }
          this.alertService.message$.next({
            description: `El producto ${data.name} no existe`,
            type: EAlertType.WARNING,
          });
          return of();
        }),
      )
      .subscribe({
        next: () => {
          this.alertService.message$.next({
            description: `Producto ${data.name} fue actualizado`,
            type: EAlertType.SUCCESS,
          });
        },
        error: (error) => {
          this.loadingService.loading$.next(false);
          this.alertService.message$.next({
            description: `Ocurrió un error al actualizar el producto ${data.name}`,
            type: EAlertType.ERROR,
          });
          console.error('Error', error);
        },
        complete: () => {
          this.resetForm();
          this.loadingService.loading$.next(false);
        },
      });
  }
  addProcut(data: IDataRecord) {
    this.productsService
      .verifyID(data.id)
      .pipe(
        take(1),
        switchMap((exist) => {
          if (!exist) {
            return this.productsService.addProduct(data).pipe(take(1));
          }
          this.alertService.message$.next({
            description: `El producto "${data.name}" ya existe con el ID "${data.id}"`,
            type: EAlertType.WARNING,
          });
          return of();
        }),
      )
      .subscribe({
        next: () => {
          this.alertService.message$.next({
            description: `Producto ${data.name} fue agregado`,
            type: EAlertType.SUCCESS,
          });
          this.resetForm();
        },
        error: (error) => {
          this.loadingService.loading$.next(false);
          this.alertService.message$.next({
            description: `Ocurrió un error al agregar el producto ${data.name}`,
            type: EAlertType.ERROR,
          });
          console.error('Error', error);
        },
        complete: () => {
          this.loadingService.loading$.next(false);
        },
      });
  }

  validateURLImage(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const value = control.value;
        if (value && !/^https?:\/\/.*\.(png|jpg|jpeg|gif|svg)$/i.test(value)) {
          resolve({ urlInvalidImage: true });
        } else {
          resolve(null);
        }
      }, 0);
    });
  }

  resetForm() {
    this.submitted = false;
    if (this.isEditMode && this._productData) {
      this.populateFormWithData(this._productData);
      this.fixDate(this._productData.date_release, this._productData.date_revision);
      return;
    }
    this.productForm.reset();
  }

  getProductData(): IDataRecord | null {
    return this._productData;
  }
}
