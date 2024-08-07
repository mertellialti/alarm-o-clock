import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private readonly toastCtrl: ToastController
  ) { }


  async presentToast(position: 'top' | 'middle' | 'bottom', msg: string, color: string, header?: string, duration?: number) {
    const toast = await this.toastCtrl.create({
      header: header,
      message: msg,      
      duration: duration ? duration : 2000,
      position: position,
      color: color
    });

    await toast.present();
  }
}
