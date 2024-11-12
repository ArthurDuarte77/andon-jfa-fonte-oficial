// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { ActivatedRoute, convertToParamMap } from '@angular/router';
// import { CounterComponent } from './counter.component';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
// import { Observable, of } from 'rxjs';
// import { OperationService } from 'src/app/service/operation.service';
// import { Operation } from 'src/app/model/operation/operation';

// describe('CounterComponent', () => {
//   let component: CounterComponent;
//   let fixture: ComponentFixture<CounterComponent>;
//   let operationService: OperationService;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ CounterComponent ],
//       imports: [
//         HttpClientTestingModule,
//         RouterTestingModule.withRoutes([]),
//         MatSnackBarModule,
//         MatDialogModule
//       ],
//       providers: [
//         { provide: MatDialogRef, useValue: {} },
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             snapshot: {
//               paramMap: convertToParamMap({ name: '030' }) // Adjust parameter value as needed
//             }
//           }
//         },
//         OperationService // Provide the actual service instance
//       ]
//     })
//     .compileComponents();

//     operationService = TestBed.inject(OperationService); // Inject OperationService for use in tests

//     fixture = TestBed.createComponent(CounterComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should fetch operation data based on route parameter', () => {
//     const operationMock: Operation = {
//       id: 0,
//       name: '',
//       limitedTime: 0,
//       ocupado: false,
//       pausa: false,
//       analise: false
//     };
//     spyOn(operationService, 'get').and.returnValue(of(operationMock)); // Mock the get method of OperationService

//     // Trigger ngOnInit() or any method that uses ActivatedRoute to fetch data
//     component.ngOnInit();

//     expect(operationService.get).toHaveBeenCalledWith('030'); // Verify that the service method was called with the expected parameter
//     // Add more expectations as needed based on your component behavior
//   });
// });
