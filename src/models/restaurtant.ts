export class Restaurant {
    id: string;
    name: string;
    categories: string[];
    location: string[];
    url: string;
    image_url: string;
    price: string;
    coordinates: {latitude: number, longitude: number};
    distance: number;
}

export class Restaurants {
    restaurants: Array<Restaurant>;
}