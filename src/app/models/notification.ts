export class Notification {
    title: string = 'Let`s Go!';
    body: string = 'Time to jump out of your bed';
    id: number = 0;
    schedule: {
      at: Date
    } = {at: new Date()};

    // sound: this.alarmSoundUrl,
    // attachments: null,
    // actionTypeId: '',
    // extra: null
}
