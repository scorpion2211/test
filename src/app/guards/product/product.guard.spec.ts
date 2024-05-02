import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductGuard } from './product.guard';
import { ProductsService } from 'src/app/services/products/products.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { IDataRecord } from 'src/app/shared/utils/records.interface';

describe('ProductGuard', () => {
  let guard: ProductGuard;
  let router: Router;
  let productsService: ProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [ProductGuard, ProductsService],
    });
    guard = TestBed.inject(ProductGuard);
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
    productsService = TestBed.inject(ProductsService);
  });

  /*  it('should navigate to "/product/add" and return false if editable product is null', (done) => {
    const snapshot = {
      paramMap: {
        get: () => 'edit',
      },
    } as unknown as ActivatedRouteSnapshot;
    spyOn(router, 'navigate');
    productsService.editableProduct$ = new BehaviorSubject<IDataRecord | null>(null);
    spyOn(productsService.editableProduct$, 'pipe').and.returnValue(of(null));

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
  }); */
});
