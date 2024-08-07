import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class ThemeToggleComponent  implements OnInit {

  protected isDarkTheme: boolean;

  constructor(
    private readonly themeSrv: ThemeService
  ) { 
    this.isDarkTheme = themeSrv.getInitialTheme();  
  }

  ngOnInit() {}

  protected async toggleTheme(){
    const theme = await this.themeSrv.toggleTheme();
    this.isDarkTheme = theme;
  }


}
