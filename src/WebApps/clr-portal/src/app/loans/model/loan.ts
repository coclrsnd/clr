export interface Loan {
  amount: number;
  status: string;
  organizationCode: string;
  organizationName: string;
  adharNumber: string;
  loanDate: Date;
  loanBorrower: string;
  loanType: string;
  remarks: string;
  id: number;
}

export function compareLoans(c1: Loan, c2: Loan) {
  const compare = c1.id - c2.id;

  if (compare > 0) {
    return 1;
  } else if (compare < 0) {
    return -1;
  } else return 0;
}
