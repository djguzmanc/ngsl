/**
 * The object passed at `$event` whenever
 * the user scrolls the window
 */
export interface NgslVisibleEvent {
  /**
   * Scroll event
   */
  scrollEvent: Event;

  /**
   * Tells whether the element
   * is on viewport or not
   */
  visible: boolean;

  /**
   * Tells the element's vertical
   * visible percentage
   */
  vVisiblePercentage: number;

  /**
   * Tells the element's horizontal
   * visible percentage
   */
  hVisiblePercentage?: number;
}
