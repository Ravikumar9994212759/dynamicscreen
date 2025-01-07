// lib/localization.js
import { L10n, setCulture, setCurrencyCode, loadCldr } from '@syncfusion/ej2-base';
import frFRLocalization from '../components/locale.json'; // Adjust path as needed
import cagregorian from '../components/ca-gregorian.json';
import currencies from '../components/currencies.json';
import numbers from '../components/numbers.json';
import timeZoneNames from '../components/timeZoneNames.json';
import numberingSystems from '../components/numberingSystems.json';

export const setupFrenchLocalization = () => {
  setCulture('fr-FR');
  setCurrencyCode('EUR');
  loadCldr(cagregorian, currencies, numbers, timeZoneNames, numberingSystems);
  L10n.load({
    'fr-FR': frFRLocalization,
  });
};

export const setupEnglishLocalization = () => {
  setCulture('en-US');
  setCurrencyCode('USD');
};
