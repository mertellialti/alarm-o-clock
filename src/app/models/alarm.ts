import { LocalNotifications } from "@capacitor/local-notifications";
import { Notification } from "./notification";

export class Alarm {
    name: string = 'Alarm Name'
    notifications: Notification[] = [];
    id: number = -1;
    from: Date | null = new Date();
    to: Date | null = new Date();
    isRepetitive: boolean = false;
    repeatsEvery: any[] = []; 

    constructor(){}
}
