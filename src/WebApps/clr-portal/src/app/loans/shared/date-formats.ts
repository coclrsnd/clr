// src/app/loans/shared/date-formats.ts

// export const MY_DATE_FORMATS = {
//   parse: {
//     dateInput: "LL",
//   },
//   display: {
//     dateInput: "MMM DD, YYYY",
//     monthYearLabel: "MMM YYYY",
//     dateA11yLabel: "LL",
//     monthYearA11yLabel: "MMMM YYYY",
//   },
// };

export const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};