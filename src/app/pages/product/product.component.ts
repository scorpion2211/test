import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean = false;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      logo: ['', Validators.required, this.validateURLImage],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    });

    const mode = this.route.snapshot.paramMap.get('mode');
    if (mode === 'edit') {
      this.isEditMode = true;
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
    console.log(this.productForm.value);
  }

  validateURLImage(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {
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
}
