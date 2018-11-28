import { Restaurant } from "./restaurtant";

export class Event {
    Title: string;
    Description: string;
    Date: Date;
    startTime: Date;
    endTime: Date;
    Restaurant: Restaurant;
    coming: number[];
    pending: number[];
    hostId: number;
}