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
    return this.http.put(`${this.API_URL}/courses/${course.id}`, course, {
      observe: 'response',
    });
  }

  getAllCourses(page= 1, size= 10): any {
    return this.http.get(`${this.API_URL}/courses?page=${page}&limit=${size}`);
  }

  deleteCourse(id: any): any {
    return this.http.delete(`${this.API_URL}/courses/${id}`);
  }

  searchUniveristyByName(param: string, page=1,size=10): any {
    return this.http.get(`${this.API_URL}/universities?search=${param}&page=${page}&limit=${size}`);
  }

  searchAllCourses(param: any,page=1, size=10): any{
    return this.http.get(`${this.API_URL}/courses?search=${param}&page=${page}&limit=${size}`);
  }

  getCurrencyList(): any{
    return this.http.get(`${this.API_URL}/currencies`);
  }
}
