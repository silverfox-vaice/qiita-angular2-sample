import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: "orderby" })
export class OrderByPipe implements PipeTransform {
  transform(array: Array < Object > , args: Array < string > ): Array < Object > {
    if(!array) {
      return
    }
    var key = args[0];
    var type = args[1];
    var more = 1;
    var less = -1;
    if(type == 'desc') {
      more = -1;
      less = 1;
    }
    array.sort((a: any, b: any) => {
      if(a[key] < b[key]) {
        return less;
      } else if(a[key] > b[key]) {
        return more;
      } else {
        return 0;
      }
    });
    return array;
  }
}
