import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductGuard } from './product.guard';
import { ProductsService } from 'src/app/services/products/products.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductGuard', () => {
  let guard: ProductGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [ProductGuard, ProductsService],
    });
    guard = TestBed.inject(ProductGuard);
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
  /* 
  it('should navigate to "/product/add" and return false if action is not "add"', () => {
    const snapshot = {
      paramMap: {
        get: () => 'edit',
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
        expect(router.navigate).toHaveBeenCalledWith(['/product/add']); // Navegar si el producto editable es nulo
        done();
      });
    } else if (canActivateResult instanceof Promise) {
      canActivateResult.then((result: boolean) => {
        expect(result).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/product/add']); // Navegar si el producto editable es nulo
        done();
      });
    } else {
      expect(canActivateResult).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/product/add']); // Navegar si el producto editable es nulo
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
  }); */
});
