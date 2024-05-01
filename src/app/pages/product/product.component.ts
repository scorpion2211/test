import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap, take } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { EAlertType } from 'src/app/shared/utils/alert-type.enum';
import { IDataRecord } from 'src/app/shared/utils/records.interface';
import { ETypesButton } from 'src/app/shared/utils/type-button.enum';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  typeButton = ETypesButton;

  productData: IDataRecord | null = null;

  constructor(
    private productsService: ProductsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required, this.validateURLImage]],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    });

    const dateReleaseControl = this.productForm.get('date_release');
    const dateRevisionControl = this.productForm.get('date_revision');
    if (dateReleaseControl && dateRevisionControl) {
      dateReleaseControl.valueChanges.subscribe((value) => {
        if (value) {
          const releaseDate = new Date(value);
          const revisionDate = new Date(releaseDate);
          revisionDate.setFullYear(releaseDate.getFullYear() + 1);
          const dateRevisionISO = revisionDate.toISOString().split('T')[0];
          dateRevisionControl.setValue(dateRevisionISO);
        }
      });
    }
    this.loadParams();
  }

  loadParams() {
    const action = this.route.snapshot.paramMap.get('action');
    if (action === 'edit') {
      this.isEditMode = true;
      if (action) {
        this.productsService.editableProduct$.pipe(take(1)).subscribe((data) => {
          if (data) {
            this.productData = data;
            this.productForm.patchValue(this.productData);
            this.fixDate(this.productData.date_release, this.productData.date_revision);
          }
        });
      }
    }
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
    this.submitted = true;
    if (this.productForm.invalid) {
      return;
    }
    this.productData = this.productForm.value as IDataRecord;
    const name = this.productData?.name ?? '';
    const messageProduct = this.isEditMode
      ? {
          description: `El producto ${name} no existe`,
          type: EAlertType.WARNING,
        }
      : {
          description: `El producto ${name} ya existe`,
          type: EAlertType.WARNING,
        };
    this.productsService
      .verifyID(this.productData.id)
      .pipe(
        switchMap((exist) => {
          if (exist && this.isEditMode && this.productData) {
            return this.productsService.updateProduct(this.productData);
          }
          if (!exist && !this.isEditMode && this.productData) {
            return this.productsService.addProduct(this.productData);
          }
          this.alertService.message$.next(messageProduct);
          return of();
        }),
      )
      .subscribe({
        next: () => {
          const name = this.productData?.name ?? '';
          this.alertService.message$.next(
            this.isEditMode
              ? {
                  description: `Producto ${name} fue actualizado`,
                  type: EAlertType.SUCCESS,
                }
              : {
                  description: `Producto ${name} fue agregado`,
                  type: EAlertType.SUCCESS,
                },
          );
        },
        error: (error) => {
          const name = this.productData?.name ?? '';
          this.alertService.message$.next({
            description: `Ocurrió un error al eliminar el producto: ${name}`,
            type: EAlertType.ERROR,
          });
          console.error('Error', error);
        },
        complete: () => {
          this.resetForm();
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
    if (this.isEditMode && this.productData) {
      this.productForm.patchValue(this.productData);
      return;
    }
    this.productForm.reset();
  }
}
