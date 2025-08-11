import { faker } from '@faker-js/faker';
import moment from 'moment';

const DATE_AND_TIME_FORMAT = 'YYYY/MM/DD HH:mm:ss';
const DATE_FORMAT = 'YYYY/MM/DD';

export function convertToDateAndTime(value: string) {
  return moment(value).format(DATE_AND_TIME_FORMAT);
}

export function convertToDate(value: string) {
  return moment(value).format(DATE_FORMAT);
}

export function generateValidDeliveryDate(): string {
  const start = new Date();
  start.setDate(start.getDate() + 3);
  const end = new Date();
  end.setDate(end.getDate() + 10);

  return convertToDate(faker.date.between({ from: start, to: end }).toISOString());
}
