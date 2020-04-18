import { NgslOption } from '../interfaces/ngsl-option.interface';

export const getOptionLabel = (option: NgslOption): string => {
  if (typeof option === 'string') {
    return option;
  }
  return option.label;
}

export const getOptionValue = (option: NgslOption): any => {
  if (typeof option === 'string') {
    return option;
  }
  return option.value;
}
