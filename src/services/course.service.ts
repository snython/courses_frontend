import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  saveCourse(course: any): any {
    return this.http.post(`${this.API_URL}/courses`, course, {
      observe: 'response',
    });
  }

  updateCourse(course: any): any {
    return this.http.put(`${this.API_URL}/courses`, course, {
      observe: 'response',
    });
  }

  getAllCourses(page= 1, size= 10): any {
    return this.http.get(`${this.API_URL}/courses?page=${page}&limit=${size}`);
  }

  deleteCourse(id: any): any {
    return this.http.delete(`${this.API_URL}/courses/${id}`);
  }

  searchCountryByName(arg0: string): any {
    console.log(arg0);
    return arg0;
  }

  searchUniveristyByName(arg0: string): any {
    console.log(arg0);
  }
  searchCityByName(arg0: string): any {
    console.log(arg0);
  }

  searchAllCourses(param: any,page=1, size=10): any{
    return this.http.get(`${this.API_URL}/courses?search=${param}&page=${page}&limit=${size}`);
  }
}
