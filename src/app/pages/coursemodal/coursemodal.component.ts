import { Component, OnInit, Inject, HostListener, InjectionToken, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from '../../../services/course.service';
import { MaterialModule } from '../../../material.module';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map, switchMap } from 'rxjs';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
declare var $: any;

export const TOAST_CONFIG = new InjectionToken('ToastConfig');

@Component({
  selector: 'app-coursemodal',
  templateUrl: './coursemodal.component.html',
  styleUrls: ['./coursemodal.component.scss'],
  standalone: true,
  providers: [CourseService],
  imports:[MaterialModule, ReactiveFormsModule]
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
  currencies: string[] = ['USD', 'EUR', 'GBP', 'AUD', 'CAD'];

  constructor(
    private fb: FormBuilder,
    private dialogref: MatDialogRef<CoursemodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private courseService: CourseService,
    private toastrService: ToastrService
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
    this.courseform = this.fb.group({idCourse: this.data.edit ? this.data.courseData.idCourse : '',
      // immaticulation: [this.data.edit ? this.data.busdata.immaticulation : '', [Validators.required]],
      courseName: [this.data.edit ? this.data.courseData.courseName : '', [Validators.required]],
      price: [this.data.edit ? this.data.courseData.price : '', [Validators.required]],
      university: [this.data.edit ? this.data.courseData.university : '', [Validators.required]],
      country: [this.data.edit ? this.data.courseData.country : '', [Validators.required]],
      city: [this.data.edit ? this.data.courseData.city : '', [Validators.required]],
      start: [this.data.edit ? this.data.courseData.start : '', Validators.required],
      end: [this.data.edit ? this.data.courseData.end : '', Validators.required],
      descriptionCourse: [this.data.edit ? this.data.courseData.courseDescription : '', [Validators.required]],
    });
  }

  ngAfterViewInit(): any {
    // Search country autocomplete
    fromEvent<any>(this.searchInputCountry.nativeElement, 'keyup')
      .pipe(
        map((event) => event.target.value),
        debounceTime(1000),
        distinctUntilChanged(),filter((query: string) =>  query?.length > 3),
        switchMap((searchParam) =>
            this.courseService.searchCountryByName(searchParam.trim())
        )
      )
      .subscribe((searchResults: any) => {
        // this.countryList = searchResults;
        this.countryList.push(searchResults);
        this.countryList.push('Cameroon');
        this.countryList.push('Ghana');
        this.countryList.push('Congo');
      });
    
    // Search city autocomplete
    fromEvent<any>(this.searchInputCity.nativeElement, 'keyup')
      .pipe(
        map((event) => event.target.value),
        debounceTime(1000),
        distinctUntilChanged(),filter((query: string) =>  query?.length > 3),
        switchMap((searchParam) =>
            this.courseService.searchCityByName(searchParam.trim())
        )
      )
      .subscribe((searchResults: any) => {
        // this.cityList = searchResults;
        this.cityList.push(searchResults);
        this.cityList.push('Cameroon');
        this.cityList.push('Ghana');
        this.cityList.push('Congo');
      });
    
    // Search university autocomplete
    fromEvent<any>(this.searchInputUniversity.nativeElement, 'keyup')
      .pipe(
        map((event) => event.target.value),
        debounceTime(1000),
        distinctUntilChanged(),filter((query: string) =>  query?.length > 3),
        switchMap((searchParam) =>
            this.courseService.searchUniveristyByName(searchParam.trim())
        )
      )
      .subscribe((searchResults: any) => {
        // this.universityList = searchResults;
        this.universityList.push(searchResults);
        this.universityList.push('Cameroon');
        this.universityList.push('Ghana');
        this.universityList.push('Congo');
      });
    }  

  close(): any{
    this.dialogref.close();
  }

  onsubmit(): any{
    // this.immatriculation.setValue(this.immatriculation.value.toUpperCase());
    this.courseName.setValue(this.courseName.value.toUpperCase());
    if (!this.data.edit){
      this.courseService.saveCourse(this.courseform.value).subscribe((response: any) => {
        // console.log(response);

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
      console.log(response);

      this.toastrService.success('Course updated successfully', 'Course', {
        timeOut: 5000, progressBar: true, positionClass: 'toast-bottom-right', enableHtml: true
      });
      this.close();
    },
    (error: any) => {
      this.toastrService.error('Erreur de mise a jour', 'Course', {
        timeOut: 5000, progressBar: true, positionClass: 'toast-bottom-right', enableHtml: true
      });
    });
    }
  }

  get courseName(): any{
    return this.courseform.get('courseName');
  }

  get university():any{
    return this.courseform.get('university');
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
    return this.courseform.get('start');
  }

  get end(): any{
    return this.courseform.get('end');
  }

  get description(): any{
    return this.courseform.get('descriptionCourse');
  }
}
