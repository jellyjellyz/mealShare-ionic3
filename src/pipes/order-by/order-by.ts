import { Pipe, PipeTransform } from '@angular/core';
import { Event } from '../../models/event';

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
  compare1(a: Event , b: Event) {
    if (a.post_date < b.post_date)
      return 1;
    if (a.post_date > b.post_date)
      return -1;
    return 0;
  }

  compare2(a: Event , b: Event) {
    if (a.meet_date > b.meet_date)
      return 1;
    if (a.meet_date < b.meet_date)
      return -1;
    return 0;
  }

  transform(input: Array<any>, args: string) : Array<any> {
    if (args == 'post_date') {
      return input.sort(this.compare1);
    }
    if (args == 'meet_date') {
      return input.sort(this.compare2);
    }
    console.log(args);
    
  }
}