import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductGuard } from './product.guard';
import { ProductsService } from 'src/app/services/products/products.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IDataRecord } from 'src/app/shared/utils/records.interface';

describe('ProductGuard', () => {
  let guard: ProductGuard;
  let productService: ProductsService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [ProductGuard, ProductsService],
    });
    guard = TestBed.inject(ProductGuard);
    productService = TestBed.inject(ProductsService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if action is "add"', () => {
    const snapshot = {
      paramMap: {
        get: () => 'add',
      },
    } as unknown as ActivatedRouteSnapshot;
    expect(guard.canActivate(snapshot)).toBeTrue();
  });

  it('should navigate to "/product/add" and return false if action is not "add"', () => {
    const snapshot = {
      paramMap: {
        get: () => 'add',
      },
    } as unknown as ActivatedRouteSnapshot;
    spyOn(router, 'navigate');
    expect(guard.canActivate(snapshot)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/product/add']);
  });

  it('should navigate to "/product/add" and return false if editable product is null', (done) => {
    const snapshot = {
      paramMap: {
        get: () => 'edit',
      },
    } as unknown as ActivatedRouteSnapshot;
    spyOn(router, 'navigate');
    spyOn(productService.editableProduct$, 'pipe').and.returnValue(of(null));
    const canActivateResult = guard.canActivate(snapshot);

    if (canActivateResult instanceof Observable) {
      canActivateResult.subscribe((result: boolean) => {
        expect(result).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/product/add']);
        done();
      });
    } else if (canActivateResult instanceof Promise) {
      canActivateResult.then((result: boolean) => {
        expect(result).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/product/add']);
        done();
      });
    } else {
      expect(canActivateResult).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/product/add']);
      done();
    }
  });

  it('should return true if editable product is not null', (done) => {
    const product: IDataRecord = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: '2024-05-01',
      date_revision: '2025-05-01',
    };
    const snapshot = {
      paramMap: {
        get: () => 'edit',
      },
    } as unknown as ActivatedRouteSnapshot;
    spyOn(productService.editableProduct$, 'pipe').and.returnValue(of(product));
    const canActivateResult = guard.canActivate(snapshot);

    if (canActivateResult instanceof Observable) {
      canActivateResult.subscribe((result: boolean) => {
        expect(result).toBeTrue();
        done();
      });
    } else if (canActivateResult instanceof Promise) {
      canActivateResult.then((result: boolean) => {
        expect(result).toBeTrue();
        done();
      });
    } else {
      expect(canActivateResult).toBeTrue();
      done();
    }
  });
});
