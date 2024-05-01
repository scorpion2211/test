import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { MOCK_RECORDS } from 'src/app/shared/utils/mocks';
import { IDataRecord } from 'src/app/shared/utils/records.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private url = environment.urlApi;
  private path = '/bp/products';
  public editableProduct$ = new BehaviorSubject<IDataRecord | null>(null);
  constructor(private http: HttpClient) {}

  getProducts(): Observable<IDataRecord[]> {
    return this.http.get<IDataRecord[]>(`${this.url}${this.path}`);
  }

  verifyID(id: string): Observable<boolean> {
    const params = `/verification?id=${id}`;
    return this.http.get<boolean>(`${this.url}${this.path}${params}`);
  }

  deleteProduct(id: string) {
    const params = { id };
    return this.http.delete(`${this.url}${this.path}`, { params, responseType: 'text' });
  }

  updateProduct(data: IDataRecord): Observable<IDataRecord> {
    return this.http.put<IDataRecord>(`${this.url}${this.path}`, data);
  }

  addProduct(data: IDataRecord): Observable<IDataRecord> {
    return this.http.post<IDataRecord>(`${this.url}${this.path}`, data);
  }

  pushRandomProducts() {
    MOCK_RECORDS.forEach((item) => {
      this.verifyID(item.id)
        .pipe(
          switchMap((exist) => {
            if (!exist) {
              return this.addProduct(item);
            }
            return of();
          }),
        )
        .subscribe((products) => {
          console.log(products);
        });
    });
  }

  removeAllProducts(products: IDataRecord[]) {
    products.forEach((item) => {
      this.deleteProduct(item.id).subscribe((products) => {
        console.log(products);
      });
    });
  }
}
