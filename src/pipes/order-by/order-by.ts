import { Pipe, PipeTransform } from '@angular/core';
import { Event } from '../../models/event';
import { Restaurant } from '../../models/restaurtant';

/**
 * Generated class for the OrderByPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  // timeStamp: Date
  compare1(a: Event, b: Event) {
    if (a.post_date < b.post_date)
      return 1;
    if (a.post_date > b.post_date)
      return -1;
    return 0;
  }

  compare2(a: Event, b: Event) {
    if (a.meet_date < b.meet_date)
      return -1;
    if (a.meet_date > b.meet_date)
      return 1;
    return 0;
  }

  compare3(a: Restaurant, b: Restaurant) {
    if (a.distance < b.distance)
      return -1;
    if (a.distance > b.distance)
      return 1;
    return 0;
  }

  compare4(a: Event, b: Event) {
    if (a.start_time < b.start_time)
      return -1;
    if (a.start_time > b.start_time)
      return 1;
    return 0;
  }

  compare5(a: any, b: any) {
    if (a.date < b.date)
      return -1;
    if (a.date > b.date)
      return 1;
    return 0;
  }



  transform(input: Array<any>, args: string): Array<any> {
    if (args == 'post_date') {
      return input.sort(this.compare1);
    }
    if (args == 'meet_date') {
      return input.sort(this.compare2);
    }
    if (args == 'distance') {
      return input.sort(this.compare3);
    }
    if (args == 'start_time') {
      return input.sort(this.compare4);
    }

    if (args == 'schedule_date') {
      return input.sort(this.compare5);
    }
    

    console.log(args);

  }
}