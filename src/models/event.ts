import { Restaurant } from "./restaurtant";

export class Event {
    title: string;
    description: string;
    post_date: string;
    meet_date: string;
    start_time: string;
    end_time: string;
    restaurant: Restaurant;
    coming_people_ids: number[];
    pending_people_ids: number[];
    host_id: number;
}

