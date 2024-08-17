import { Routes } from '@angular/router';
import { FullComponent } from './components/full/full.component';
import { CourseComponent } from './pages/course/course.component';

export const routes: Routes = [
    {
        path: '', component: FullComponent, children:[
            {
                path: '',
                redirectTo: '/course',
                pathMatch: 'full',
            },
            {
                path:'course', component:CourseComponent
            }
        ]
    }
];
