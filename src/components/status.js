export default class Status {
  constructor(args) {
    if (args instanceof Status) {
      Object.assign(this, args);
    }
  }
}
