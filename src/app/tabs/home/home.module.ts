import { forwardRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { ThemeToggleComponent } from 'src/app/components/theme-toggle/theme-toggle.component';
import { IonPickerValueAccessorDirective } from 'src/app/directives/ionic/ion-picker-value-accessor-directive';

@NgModule({  
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ThemeToggleComponent
  ],
  declarations: [HomePage, IonPickerValueAccessorDirective],  
  exports :[IonPickerValueAccessorDirective]
})
export class HomePageModule {}
