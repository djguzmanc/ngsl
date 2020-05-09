import { AUXILIARY_NAME, EXCLUDE_NAME } from '../constants/name.constant';

export const placeName = (groupName: string) => {
  if (groupName === AUXILIARY_NAME || groupName === EXCLUDE_NAME) {
    return '';
  };
  return `-${groupName}`;
};
