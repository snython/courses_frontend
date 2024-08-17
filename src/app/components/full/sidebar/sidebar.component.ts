import { Component, OnInit } from '@angular/core';
import { navItems } from './sidebar-data';
import { NavService } from '../../../../services/nav.service';
import { MaterialModule } from '../../../../material.module';
import { AppNavItemComponent } from './nav-item/nav-item.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports:[MaterialModule, AppNavItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrl:'./sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  navItems = navItems;

  constructor(public navService: NavService) {}

  ngOnInit(): void {}
}
