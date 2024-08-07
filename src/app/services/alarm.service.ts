import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Alarm } from '../models/alarm';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AlarmService {

  alarms: any[] | null = null;

  constructor(
    private readonly toastSrv: ToastService
  ) {
    //this.getInitialAlarms();
  }

  async getInitialAlarms() {
    try {
      const array = (await Preferences.get({ key: 'alarms' })).value;
      console.log('From Preferences JSON is: ',array);
      if (!array) { this.alarms = []; return; }
      else {
        this.alarms = JSON.parse(array);
      }
    } catch (error: any) {
      this.toastSrv.presentToast('top', 'While getting initial alarms.', 'danger', 'Error', 5000);
    }
  }

  create() { }

  update() { }

  delete() { }

  deleteAll() { }

  getById() { }

  getList() {
    return this.alarms;
  }

  async addAlarm(alarm: Alarm) {
    if(!this.alarms){
      this.alarms = [];
    }
    for (let c = 0; c < this.alarms.length + 1; c++) {
      if (this.alarms.indexOf((a: any) => { return a.id === c }) === null) {
        alarm.id = c;
        c = this.alarms.length + 1;
      }
      if (c === this.alarms.length) {
        alarm.id = c;
      }
    }
    this.alarms.push(alarm);
    const arrayJson = JSON.stringify(this.alarms);
    await Preferences.set({ key: 'alarms', value: arrayJson });
  }

  async deleteAlarm(id: number) {
    if(!this.alarms){
      console.log('Error, should have alarms list.');
      return;
    }
    const filtered = this.alarms.filter((alarm: any) => {
      return alarm.id !== id;
    });
    this.alarms = filtered;
    const arrayJson = JSON.stringify(this.alarms);
    await Preferences.set({ key: 'alarms', value: arrayJson });
  }

}
