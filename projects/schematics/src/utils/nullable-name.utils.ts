import { AUXILIARY_NAME } from "../constants/name.constant";

export const placeName = (groupName: string) => {
  if (groupName === AUXILIARY_NAME) {
    return '';
  };
  return `-${groupName}`;
};
