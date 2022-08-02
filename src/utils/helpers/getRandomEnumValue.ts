import { getRandomNumber } from './getRandomNumber';

export const getRandomEnumValue = <T>(anyEnum: T): T[keyof T] => {
  const enumValues: T[keyof T][] = Object.values(anyEnum);
  const randomIndexForEnum = getRandomNumber(enumValues.length - 1);

  return enumValues[randomIndexForEnum];
};
