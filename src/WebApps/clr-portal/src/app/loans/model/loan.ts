export interface Loan {
  amount: number;
  status: string;
  organizationCode: string;
  organizationName: string;
  adharNumber: string;
  loanDate: Date;
  loanBorrower: string;
  loanType: string;
  repaymentStatus: string;
  remarks:string;
  id: number;
  securityReports:string;
  vehicleNo:string;
  suretyholder1Adhar:string;
  suretyholder2Adhar:string;
  suretyholder1:string;
  suretyholder2:string;
}

export function compareLoans(c1: Loan, c2: Loan) {
  const compare = c1.id - c2.id;

  if (compare > 0) {
    return 1;
  } else if (compare < 0) {
    return -1;
  } else return 0;
}
