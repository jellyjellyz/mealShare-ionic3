import { Restaurant } from "./restaurtant";

export class Event {
    key: string;
    title: string;
    description: string;
    post_date: string;
    meet_date: any;
    start_time: string;
    end_time: string;
    restaurant: Restaurant;
    coming_people_ids: string[];
    pending_people_ids: string[];
    host_id: string;
    image_url: string;
    saved_people_ids: string[];
}
