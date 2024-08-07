import { Component, OnInit } from '@angular/core';
import { LocalNotifications, ScheduleOptions, Weekday } from '@capacitor/local-notifications';
import { AlertController, isPlatform, ToastController } from '@ionic/angular';
import { every, timeout } from 'rxjs';
import { Alarm } from 'src/app/models/alarm';
import { Notification } from 'src/app/models/notification';
import { AlarmService } from 'src/app/services/alarm.service';
import { ToastService } from 'src/app/services/toast.service';


LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
  console.log('Notification action performed', notification);
});

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  // private alarmSoundUrl: string = 'src/assets/sounds/alarm-sound-001-[perc].wav';  

  private MINUTE: number = 1000;
  protected timeLeft: number = 5;
  protected interval: any;
  protected isScheduled: boolean = false;

  protected weekDays: { label: string; value: string }[] = [];

  protected alarmOptions: { time: Date }[] = [];

  protected hours: { text: string, value: number }[] = [];
  protected minutes: { text: string, value: number }[] = [];

  protected isCreatingAlarm: boolean = false;

  protected selectedTimeFrom: { hour: number, minute: number, text: string, date: Date } = { hour: 0, minute: 0, text: '00:00', date: new Date(2024, 1, 1, 0, 0) };
  protected selectedTimeTo: { hour: number, minute: number, text: string, date: Date } = { hour: 0, minute: 0, text: '00:00', date: new Date(2024, 1, 1, 0, 0) };
  protected selectedPeriod: { value: number, text: string } | null = null;
  protected selectedWeekdays: any[] = [];
  protected alarms: any[] | null = null;
  protected alarmFocused: Alarm | null = null;

  protected currentValue: any = null;
  protected isTimePickerOpen: boolean = false;

  protected pendingList: any[] = [];

  protected targets: { value: number, text: string }[] = [];
  protected isCapacitorPlatform: boolean = isPlatform('capacitor'); 

  constructor(
    private readonly toastSrv: ToastService,
    private readonly alarmSrv: AlarmService,
    private readonly alertCtrl: AlertController
  ) {
    this.prepareHoursAndMinutes();
    this.prepareTargets();
    this.prepareWeekDays();        
    const d = new Date(2024, 1, 1, 23, 59 + 11, 10);
    console.log('Date is added hour? lets see', d);
  }

  async ngOnInit() {
    await this.alarmSrv.getInitialAlarms();
    this.alarms = this.alarmSrv.getList();

    if (isPlatform('capacitor')) {
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display === 'granted') {
        console.log('Notification permissions granted');
        await this.presentAlert('Success', '', 'Access granted.', 'Ok');
      } else {
        console.log('Notification permissions denied');
        await this.presentAlert('Error', '', 'Access denied.', 'Ok');
      }
    } else {
      console.log('Running in a web browser, skipping notification permission request');
      await this.presentAlert('Info', '', 'Running in a web browser, notifications not available.', 'Ok');
    }
  }

  private onConfirm(value: any) {
    console.log(`Time Scheduled Between: ${value.HOURS_FROM.value}:${value.MINUTES_FROM.value} - ${value.HOURS_TO.value}:${value.MINUTES_TO.value}`);
    this.selectedTimeFrom = { hour: value.HOURS_FROM.value, minute: value.MINUTES_FROM.value, text: `${value.HOURS_FROM.text}:${value.MINUTES_FROM.text}`, date: new Date(2024, 1, 1, value.HOURS_FROM.value, value.MINUTES_FROM.value) };
    // this.selectedTimeTo = { hour: value.HOURS_TO.value, minute: value.MINUTES_TO.value, text: `${value.HOURS_TO.text}:${value.MINUTES_TO.text}` };
  }

  protected async scheduleNotification(alarm: Alarm) {
    let options: ScheduleOptions = {
      notifications: alarm.notifications
    };
    console.log(`Notification Options is`, options)
    try {
      const notification = await LocalNotifications.schedule(options);
      let ids: number[] = [];
      this.pendingList = (await LocalNotifications.getPending()).notifications;
      for (let i = 0; i < notification.notifications.length; i++) {
        ids.push(notification.notifications[i].id);
      }
      console.log(`Scheduled is ${notification}.`, notification.notifications);
      this.toastSrv.presentToast('top', `Ids are ${ids.toString()}`, 'success', 'Scheduled');
    }
    catch (err: any) {
      console.log(`Error is ${err.message}`)
      this.toastSrv.presentToast('top', 'Error Ocurred', 'danger', 'Error');
    }
  }

  protected async exampleNotification() {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Alarm!',
          body: 'Tap here to end up alarm',
          id: 1,
          schedule: {
            at: new Date(Date.now() + 1000 * 5) // 5 seconds from now
          },
          // sound: this.alarmSoundUrl,
          // attachments: null,
          // actionTypeId: '',
          // extra: null
        }
      ]
    });
    this.isScheduled = true;
    const pendingList = await LocalNotifications.getPending();
    console.log('Pending List', pendingList);
    this.startTimer();
  }

  private async checkPermission() {
    await LocalNotifications.checkPermissions();
  }

  private async requestPermission() {
    await LocalNotifications.requestPermissions();
  }

  private async presentAlert(header: string, subHeader: string, message: string, button: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [button],
    });

    await alert.present();
  }

  private startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  get formattedTime() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  private prepareTargets() {
    this.targets = [
      { value: 0, text: 'On Time' },
      { value: this.MINUTE, text: 'In a minute' },
      { value: this.MINUTE * 3, text: 'In 3 minutes.' },
      { value: this.MINUTE * 5, text: 'In 5 minutes.' },
      { value: this.MINUTE * 10, text: 'In 10 minutes' },
      { value: this.MINUTE * 15, text: 'In 15 minutes.' },
    ];
    this.selectedPeriod = this.targets[0];
  }

  private prepareWeekDays() {
    for (const key in Weekday) {
      console.log('Key: ', key);
      if (Weekday.hasOwnProperty(key) && key.length > 1) {
        this.weekDays.push({ label: key, value: Weekday[key] });
        console.log('Weekdays array: ', this.weekDays);
      }
    }
  }

  private prepareHoursAndMinutes() {
    for (let h = 0; h < 24; h++) {
      if (h < 10) {
        this.hours.push({ text: `0${h}`, value: h });
      } else {
        this.hours.push({ text: `${h}`, value: h });
      }
    }
    for (let m = 0; m < 59; m++) {
      if (m % 5 === 0) {
        if (m < 10) {
          this.minutes.push({ text: `0${m}`, value: m });
        } else {
          this.minutes.push({ text: `${m}`, value: m });
        }
      }
    }
  }

  protected deleteAlarm() {
    this.isCreatingAlarm = false;
    this.alarmFocused = null;
  }

  protected async setAlarm() {
    try {
      const notification = new Notification();
      notification.title = this.alarmFocused?.name!;
      notification.id = 1;
      notification.body = 'Time to waaaake up!';
      const today = new Date();
      const tomorrow = new Date(Date.now() + this.MINUTE * 60 * 24);

      if (this.alarmFocused?.isRepetitive === false) {       
        // Alarm time want to be set is already passed.
        if (today > this.selectedTimeFrom.date) {
          const alarmDate = tomorrow;
          alarmDate.setHours(this.selectedTimeFrom.hour);
          alarmDate.setMinutes(this.selectedTimeFrom.minute);
          notification.schedule = { at: alarmDate };
        } else {
          const alarmDate = today;
          alarmDate.setHours(this.selectedTimeFrom.hour);
          alarmDate.setMinutes(this.selectedTimeFrom.minute);
          notification.schedule = { at: alarmDate };
        }
        this.alarmFocused.notifications.push(notification);
      } else {

      }

      let options: ScheduleOptions = {
        notifications: this.alarmFocused!.notifications
      };

      const response = await LocalNotifications.schedule(
        options
      );
      if (this.alarmFocused)
        this.alarmSrv.addAlarm(this.alarmFocused);

      this.isCreatingAlarm = false;
      console.log('This alarm: ', this.alarmFocused);
      this.alarmFocused = null;
    } catch (error: any) {
      this.toastSrv.presentToast('top', `${error.message}`, 'danger', 'Error Ocurred', 3000);
    }
  }

  protected createAlarm() {
    const alarm = new Alarm;
    this.alarmFocused = alarm;
    this.isCreatingAlarm = true;
  }

  onIonChangeHour(event: CustomEvent) {
    const hour = event.detail.value;
    this.selectedTimeFrom.hour = (hour);
    this.selectedTimeFrom.date.setHours(hour);
    console.log('Now date from is', this.selectedTimeFrom.date.getHours());
    this.updateSelectedTimeTo();
  }

  onIonChangeMinute(event: CustomEvent) {
    const minute = event.detail.value;
    this.selectedTimeFrom.minute = (minute);
    this.selectedTimeFrom.date.setMinutes(minute);
    this.updateSelectedTimeTo();
  }

  onIonChangeTarget(event: CustomEvent) {
    console.log('Selected period', event.detail);
    const target = event.detail;
    this.selectedPeriod = target;
    this.updateSelectedTimeTo();
  }

  updateSelectedTimeTo() {
    console.log('Selected period', this.selectedPeriod);
    const currentMin = this.selectedTimeFrom.date.getMinutes();
    const currentHour = this.selectedTimeFrom.date.getHours();
    const dFrom = new Date(2024, 1, 1, currentHour, currentMin);
    const d = new Date(2024, 1, 1, currentHour, currentMin + (this.selectedPeriod?.value! / 1000));
    this.selectedTimeFrom.date = dFrom;
    this.selectedTimeTo.date = d;
    console.log(`Day: ${this.selectedTimeFrom.date.getDay()} Hour: ${this.selectedTimeFrom.date.getHours()}:${this.selectedTimeFrom.date.getMinutes()} | in ${this.selectedPeriod?.value! / 1000} min | 
    Day: ${this.selectedTimeTo.date.getDay()} Hour: ${this.selectedTimeTo.date.getHours()}:${this.selectedTimeTo.date.getMinutes()} `);
  }


  onDidDismiss(event: CustomEvent) {
    console.log('didDismiss', JSON.stringify(event.detail));
  }

  protected checkCanCreate() {
    if (this.alarmFocused === null) { return false; }
    else if (this.alarmFocused.isRepetitive && this.selectedWeekdays.length < 1) { return false; }
    else if (this.alarmFocused.name.length < 3 || this.alarmFocused.name.length > 150) { return false; }
    else { return true; }
  }
}
