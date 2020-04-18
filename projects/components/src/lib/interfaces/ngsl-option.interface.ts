/**
 * Describes the shape of a value label select option
 */
export interface INgslOption {
  value: any;
  label: string;
}

/**
 * Describe the type of an ngsl option
 */
export type NgslOption = INgslOption | string;
