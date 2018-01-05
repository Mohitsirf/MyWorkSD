export default class ArrayUtils {

  static contains(hay: any[], niddle: any, key: string | null = null): boolean {
    if (!key) {
      return hay.indexOf(niddle) !== -1;
    }

    for (const item of hay) {
      if (key in hay && hay[key] === niddle[key]) {
        return true;
      }
    }

    return false;
  }
}
