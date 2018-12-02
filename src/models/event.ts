import { Restaurant } from "./restaurtant";

export class Event {
    key: number;
    title: string;
    description: string;
    post_date: string;
    meet_date: any;
    start_time: string;
    end_time: string;
    restaurant: Restaurant;
    coming_people_ids: number[];
    pending_people_ids: number[];
    host_id: number;
    image_url: string;
    saved_people_ids: number[];
}

