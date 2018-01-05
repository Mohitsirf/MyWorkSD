export default class ObjectUtils {

  static sortByKey(items: any[], key: string, direction = 'asc') {
    if (!key || !direction) {
      return items;
    }


    return items.sort((a, b) => {
      const propertyA: number | string = a[key];
      const propertyB: number | string = b[key];

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (direction === 'asc' ? 1 : -1);
    });
  }
}
