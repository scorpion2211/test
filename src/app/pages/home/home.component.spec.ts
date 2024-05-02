import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductsService } from 'src/app/services/products/products.service';
import { AlertService } from '../../services/alert/alert.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { ETypesButton } from 'src/app/shared/utils/type-button.enum';
import { ESizeModal } from 'src/app/shared/utils/modal-size.enum';
import { AppModule } from 'src/app/app.module';
import { TableModule } from 'src/app/shared/components/table/table.module';
import { ModalModule } from 'src/app/shared/components/modal/modal.module';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'src/app/shared/components/button/button.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        AppModule,
        TableModule,
        ModalModule,
        FormsModule,
        ButtonModule,
      ],
      providers: [ProductsService, AlertService, LoadingService],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.typeButton).toEqual(ETypesButton);
    expect(component.searchTerm).toEqual('');
    expect(component.itemSelected).toBeNull();
    expect(component.showModalConfirm).toBeFalsy();
    expect(component.showModalDescription).toBeFalsy();
    expect(component.sizeModal).toEqual(ESizeModal);
    expect(component.isLoadingTable).toBeTruthy();
    expect(component._totalData).toEqual([]);
  });
});
