import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
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
  ) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      logo: ['', Validators.required, this.validateURLImage],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    });
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
          }
        });
      }
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
    this.resetForm();
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
