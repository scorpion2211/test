import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { environment } from 'src/environments/environment';
import { IDataRecord } from 'src/app/shared/utils/records.interface';
import { MOCK_RECORDS } from 'src/app/shared/utils/mocks';
import { of } from 'rxjs';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products from API', () => {
    const mockProducts: IDataRecord[] = [MOCK_RECORDS[2], MOCK_RECORDS[1]];

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const request = httpMock.expectOne(`${environment.urlApi}/bp/products`);
    expect(request.request.method).toBe('GET');
    request.flush(mockProducts);
  });

  it('should verify ID', () => {
    const id = '123';
    const mockResponse = true;

    service.verifyID(id).subscribe((exist) => {
      expect(exist).toBe(mockResponse);
    });

    const request = httpMock.expectOne(`${environment.urlApi}/bp/products/verification?id=${id}`);
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });

  it('should delete product by ID', () => {
    const id = '123';
    service.deleteProduct(id).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const request = httpMock.expectOne(`${environment.urlApi}/bp/products?id=${id}`);
    expect(request.request.method).toBe('DELETE');
    request.flush('test');
  });

  it('should update product', () => {
    const mockProduct: IDataRecord = MOCK_RECORDS[0];

    service.updateProduct(mockProduct).subscribe((updatedProduct) => {
      expect(updatedProduct).toEqual(mockProduct);
    });

    const request = httpMock.expectOne(`${environment.urlApi}/bp/products`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(mockProduct);
    request.flush(mockProduct);
  });

  it('should add product', () => {
    const mockProduct: IDataRecord = MOCK_RECORDS[0];

    service.addProduct(mockProduct).subscribe((addedProduct) => {
      expect(addedProduct).toEqual(mockProduct);
    });

    const request = httpMock.expectOne(`${environment.urlApi}/bp/products`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(mockProduct);
    request.flush(mockProduct);
  });

  it('should push random products', () => {
    const spyVerifyID = spyOn(service, 'verifyID').and.returnValue(of(false));
    const spyAddProduct = spyOn(service, 'addProduct').and.returnValue(of({} as IDataRecord));

    service.pushRandomProducts();

    expect(spyVerifyID).toHaveBeenCalledTimes(MOCK_RECORDS.length);
    expect(spyAddProduct).toHaveBeenCalledTimes(MOCK_RECORDS.length);
    MOCK_RECORDS.forEach((item) => {
      expect(spyVerifyID).toHaveBeenCalledWith(item.id);
      expect(spyAddProduct).toHaveBeenCalledWith(item);
    });
  });
  it('should remove all products', () => {
    const products: IDataRecord[] = [...MOCK_RECORDS];
    const deleteProductSpy = spyOn(service, 'deleteProduct').and.returnValue(of(''));

    service.removeAllProducts(products);

    expect(deleteProductSpy).toHaveBeenCalledTimes(products.length);
    products.forEach((product) => {
      expect(deleteProductSpy).toHaveBeenCalledWith(product.id);
    });
  });
  it('should push random products when product exists', () => {
    const spyVerifyID = spyOn(service, 'verifyID').and.returnValue(of(true));
    const spyAddProduct = spyOn(service, 'addProduct').and.returnValue(of({} as IDataRecord));

    service.pushRandomProducts();

    expect(spyVerifyID).toHaveBeenCalledTimes(MOCK_RECORDS.length);
    expect(spyAddProduct).toHaveBeenCalledTimes(0);
    MOCK_RECORDS.forEach((item, index) => {
      expect(spyVerifyID).toHaveBeenCalledWith(item.id);
    });
  });
});
