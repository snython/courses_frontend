import { ChangeDetectorRef, Component, ElementRef, InjectionToken, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CourseService } from '../../../services/course.service';
import { MaterialModule } from '../../../material.module';
import { CoursemodalComponent } from '../coursemodal/coursemodal.component';
import { HttpClientModule } from '@angular/common/http';
import { DateDifferencePipe } from '../../pipes/date-difference.pipe';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map, switchMap } from 'rxjs';

export const TOAST_CONFIG = new InjectionToken('ToastConfig');


@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  standalone:true,
  providers: [CourseService],
  imports:[ToastrModule, SweetAlert2Module,MaterialModule , HttpClientModule, DateDifferencePipe]
})
export class CourseComponent implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef;

  ispopup: boolean;

  displayedColumns = ['id', 'name', 'location', 'start', 'length', 'price', 'action'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  page: any;
  size: any;
  courses: any;
  filterValue: any;

  constructor(private dialog: MatDialog, private courseService:CourseService, private changedetect: ChangeDetectorRef, 
    private toastrService: ToastrService
  ) {
    this.searchInput = {} as ElementRef;
    this.ispopup = false;
    this.sort = new MatSort();

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.courses);
  }

  ngOnInit(): void {
    this.getCourses();
  }
  
  ngAfterViewInit(): any {
    // Search country autocomplete
    fromEvent<any>(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map((event) => event.target.value),
        debounceTime(1000),
        distinctUntilChanged(), filter((query: string) => query?.length > 3),
        switchMap((searchParam) => {
          this.filterValue = searchParam.trim().toLowerCase();
          return this.courseService.searchAllCourses(this.filterValue,this.page??1,this.size??10)
        })
      )
      .subscribe((searchResults: any) => {
        this.courses = searchResults;
        this.dataSource = new MatTableDataSource(searchResults["items"]);
      });
  }

  addCourse(): any {

    this.ispopup = true;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.position={
    //   right:'110px',
    // };
    dialogConfig.data = {};
    const dialogref = this.dialog.open(CoursemodalComponent, {
      width: '700px', height: 'auto', autoFocus: true, disableClose: dialogConfig.disableClose, data: {}
    });

    dialogref.afterClosed().subscribe((result: any) => {
      this.ispopup = false;
      this.getCourses();
    });
  }

  editCourse(element: any): any {

    this.ispopup = true;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};
    const dialogref = this.dialog.open(CoursemodalComponent, {
      width: '700px', height: 'auto', autoFocus: true, disableClose: dialogConfig.disableClose, data: {
        courseData: element,
        edit: true
      }
    });

    dialogref.afterClosed().subscribe((result: any) => {
      this.ispopup = false;
      this.getCourses();
    });
  }

  applyFilter(event:Event): any {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = this.filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    
    const page = this.page??1;
    const size = this.size?? 10;
    this.courseService.searchAllCourses(this.filterValue,page, size).subscribe((response: any) => {
      this.courses = response;
      this.dataSource = new MatTableDataSource(response["items"]);
      this.dataSource.filter = this.filterValue;
      this.changedetect.detectChanges();
    });
  }

  nextPage(event: PageEvent): any {
    this.page = event.pageIndex+1;
    this.size = event.pageSize;
    console.log('filter ', this.filterValue);
    if (this.filterValue && this.filterValue != '') {
      this.courseService.searchAllCourses(this.filterValue,this.page, this.size).subscribe((newPageData: any) => {
        this.courses = newPageData;
        this.dataSource = new MatTableDataSource(this.courses?.items);
      });
    } else {
      this.courseService.getAllCourses(this.page, this.size).subscribe((newPageData: any) => {
        this.courses = newPageData;
        this.dataSource = new MatTableDataSource(this.courses?.items);
      });
    }
  }

  getCourses(): any {
    const page = this.page != null || this.page != undefined ? this.page : 1;
    const size = this.size != null || this.size != undefined ? this.size : 10;
    
    if (this.filterValue && this.filterValue != '') { 
      this.courseService.searchAllCourses(this.filterValue,this.page, this.size).subscribe((newPageData: any) => {
        this.courses = newPageData;
        this.dataSource = new MatTableDataSource(this.courses?.items);
      });
    } else {
      this.courseService.getAllCourses(page, size).subscribe((response: any) => {
        this.courses = response;
        this.dataSource = new MatTableDataSource(response["items"]);
        this.changedetect.detectChanges();
        console.log(response);
      });
    }
  }

  delete(element: any): any{
    this.courseService.deleteCourse(element.id).subscribe((data: any) => {
      this.getCourses();
      this.toastrService.success('Course successfully deleted', 'Course', {
        timeOut: 5000, progressBar: true, positionClass: 'toast-bottom-right', enableHtml: true
      });
    },
    (error: any) => {
      this.toastrService.error('Error deleting course '+element.name, 'Course', {
        timeOut: 5000, progressBar: true, positionClass: 'toast-bottom-right', enableHtml: true
      });
    });
  }

  confirmBox(data: any){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will delete the course! '+ data.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.delete(data);
        Swal.fire(
          'Course deleted!',
          'Course '+data?.name+' deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancel',
          'Operation cancel :)',
          'error'
        );
      }
    });
  }


}
