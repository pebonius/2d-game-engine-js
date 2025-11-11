export default class Debug {
  /**
   * The static log() method from this class should be used for logging in the game
   * to avoid memory leaks.
   */
  constructor() {}
  static log(obj) {
    if (!isRunningLocally()) {
      return;
    }
    try {
      console.log(obj.toString());
    } catch (error) {
      console.log("trying to Debug log an object caused the following error:");
      console.log(error);
    }
  }
}
