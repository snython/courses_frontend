import { Component, OnInit, Inject, HostListener, InjectionToken, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from '../../../services/course.service';
import { MaterialModule } from '../../../material.module';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map, switchMap } from 'rxjs';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { CurrencySymbolPipe } from '../../pipes/currency-symbol.pipe';
import { CurrencyPipe } from '@angular/common';
import { AdressService } from '../../../services/address.service';
declare var $: any;

export const TOAST_CONFIG = new InjectionToken('ToastConfig');

@Component({
  selector: 'app-coursemodal',
  templateUrl: './coursemodal.component.html',
  styleUrls: ['./coursemodal.component.scss'],
  standalone: true,
  providers: [CourseService,AdressService, CurrencyPipe],
  imports:[MaterialModule, ReactiveFormsModule, CurrencySymbolPipe]
})
export class CoursemodalComponent implements OnInit {

  @ViewChild('searchUniversity') searchInputUniversity: ElementRef;
  @ViewChild('searchCountry') searchInputCountry: ElementRef;
  @ViewChild('searchCity') searchInputCity: ElementRef;

  public courseform: any;
  Status = true;
  loading$: any;
  universityList:any;
  countryList: any;
  cityList: any;
  currencies: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogref: MatDialogRef<CoursemodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private courseService: CourseService,
    private toastrService: ToastrService,
    private adresseService: AdressService
  )
  {
    this.searchInputUniversity = {} as ElementRef;
    this.searchInputCountry = {} as ElementRef;
    this.searchInputCity = {} as ElementRef;

    this.universityList = [];
    this.countryList = [];
    this.cityList = [];
  }

  ngOnInit(): void {
    this.getCurrenciesList();
    console.log('update ', this.data);
    this.courseform = this.fb.group({
      id: [this.data.edit ? this.data.courseData.id : ''],
      name: [{ value: this.data.edit ? this.data.courseData.name : '', disabled: this.data.edit }, [Validators.required]],
      price: [this.data.edit ? this.data.courseData.price : '', [Validators.required]],
      university_id: [{ value: this.data.edit ? this.data.courseData.university.id : '', disabled: this.data.edit }, [Validators.required]],
      university: [{ value: this.data.edit ? this.data.courseData.university.name : '', disabled: this.data.edit }, [Validators.required]],
      country: [{ value: this.data.edit ? this.data.courseData.location.country : '', disabled: this.data.edit }, [Validators.required]],
      city: [{ value: this.data.edit ? this.data.courseData.location.city : '', disabled: this.data.edit }, [Validators.required]],
      start_date: [this.data.edit ? this.data.courseData.start_date : '', Validators.required],
      end_date: [this.data.edit ? this.data.courseData.end_date : '', Validators.required],
      description: [this.data.edit ? this.data.courseData.description : '', [Validators.required]],
      currency: [this.data.edit ? this.data.courseData.currency : 'USD', [Validators.required]],
    });

    this.validateEndDateInput();
  }


  validateEndDateInput() {
  let isHandlingProgrammatically = false;

  this.end.valueChanges.subscribe((val: any) => {
    if (!isHandlingProgrammatically && this.start.value > this.end.value) {
      isHandlingProgrammatically = true;
      this.end.setValue('');
      this.toastrService.info('Please check start and end date. Start date cannot be greater than end date.', 'Date validation', {
        timeOut: 5000,
        progressBar: true,
        enableHtml: true
      });
    } else {
      isHandlingProgrammatically = false;
    }
  });

  this.start.valueChanges.subscribe((val: any) => {
    if (!isHandlingProgrammatically && this.start.value > this.end.value) {
      isHandlingProgrammatically = true;
      this.end.setValue('');
      this.toastrService.info('Please check start and end date. Start date cannot be greater than end date.', 'Date validation', {
        timeOut: 5000,
        progressBar: true,
        enableHtml: true
      });
    } else {
      isHandlingProgrammatically = false;
    }
  });
}


  ngAfterViewInit(): any {
    // Search country autocomplete
    fromEvent<any>(this.searchInputCountry.nativeElement, 'keyup')
      .pipe(
        map((event) => event.target.value),
        debounceTime(1000),
        distinctUntilChanged(),filter((query: string) =>  query?.length > 1),
        switchMap((searchParam) =>
            this.adresseService.searchCountryByName(searchParam.trim().toLowerCase())
        )
      )
      .subscribe((searchResults: any) => {
        this.countryList = searchResults.items;
      });
    
    // Search city autocomplete
    fromEvent<any>(this.searchInputCity.nativeElement, 'keyup')
      .pipe(
        map((event) => event.target.value),
        debounceTime(1000),
        distinctUntilChanged(),filter((query: string) =>  query?.length > 0),
        switchMap((searchParam) => {
          if (this.country.value == null || this.country.value == '') {
            this.city.setValue('');
            this.toastrService.info('Please first fill the country input!', 'Course', {
              timeOut: 5000, progressBar: true, positionClass: 'toast-bottom-right', enableHtml: true
            });
            return;
          }
          return this.adresseService.searchCityByName(this.country.value,searchParam.trim())
        })
      )
      .subscribe((searchResults: any) => {
        this.cityList = searchResults.items;
      });
    
    // Search university autocomplete
    fromEvent<any>(this.searchInputUniversity.nativeElement, 'keyup')
      .pipe(
        map((event) => event.target.value),
        debounceTime(1000),
        distinctUntilChanged(),filter((query: string) =>  query?.length > 2),
        switchMap((searchParam) =>
            this.courseService.searchUniveristyByName(searchParam.trim())
        )
      )
      .subscribe((searchResults: any) => {
        this.universityList = searchResults.items;
      });
    }  

  close(): any{
    this.dialogref.close();
  }

  onsubmit(): any{
    this.courseName.setValue(this.courseName.value.toUpperCase());
    if (!this.data.edit){
      this.courseService.saveCourse(this.courseform.value).subscribe((response: any) => {

        this.toastrService.success('New course created sucessfully', 'Course', {
          timeOut: 5000, progressBar: true, positionClass: 'toast-bottom-right', enableHtml: true
        });
        this.close();
      },
      (error: any) => {

        this.toastrService.error('Error during registration of the new course', 'Course', {
          timeOut: 5000, progressBar: true, positionClass: 'toast-bottom-right', enableHtml: true
        });
      });
    }else{
    this.courseService.updateCourse(this.courseform.value).subscribe((response: any) => {

      this.toastrService.success('Course updated successfully', 'Course', {
        timeOut: 5000, progressBar: true, positionClass: 'toast-bottom-right', enableHtml: true
      });
      this.close();
    },
    (error: any) => {
      this.toastrService.error('Error updating the course', 'Course', {
        timeOut: 5000, progressBar: true, positionClass: 'toast-bottom-right', enableHtml: true
      });
    });
    }
  }

  getCurrenciesList(): any{
    this.courseService.getCurrencyList().subscribe((response: any) => {
      this.currencies = response;
    },
      (error: any) => {
        this.toastrService.error('Error getting the list of currencies', 'Course', {
          timeOut: 5000, progressBar: true, positionClass: 'toast-bottom-right', enableHtml: true
        });
      });
  }

  numbersonly(val: any): any {
    let input = this.courseform.controls['price'];
    let value = input.value;

    // Replace any character that is not a digit or a decimal point
    value = value.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point is allowed
    if (value.split('.').length > 2) {
      value = value.substring(0, value.length - 1);
    }

    input.patchValue(value);
  }

  get courseName(): any{
    return this.courseform.get('name');
  }

  get university():any{
    return this.courseform.get('university');
  }

  get universityId():any{
    return this.courseform.get('university_id');
  }

  get country(): any{
    return this.courseform.get('country');
  }

  get city(): any{
    return this.courseform.get('city');
  }

  get price(): any{
    return this.courseform.get('price');
  }

  get start(): any{
    return this.courseform.get('start_date');
  }

  get end(): any{
    return this.courseform.get('end_date');
  }

  get description(): any{
    return this.courseform.get('description');
  }

  setUniversityId(data: any): void{
    this.universityId.setValue(data.id);
  }
}
