import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
import { IDataRecord } from 'src/app/shared/utils/records.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductGuard implements CanActivate {
  constructor(
    private productService: ProductsService,
    private router: Router,
  ) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const action = next.paramMap.get('action');
    if (action === 'edit') {
      return this.productService.editableProduct$.pipe(
        map((product: IDataRecord | null) => {
          if (!product) {
            this.router.navigate(['/product/add']);
            return false;
          }
          return true;
        }),
      );
    }
    if (action !== 'add') {
      this.router.navigate(['/product/add']);
      return false;
    }
    return true;
  }
}
