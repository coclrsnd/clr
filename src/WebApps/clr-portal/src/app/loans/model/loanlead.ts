export interface LoanLead {
  amount: string;
  organizationCode: string;
  organizationName: string;
  adharNumber: string;
  loanDate: Date;
  loanBorrower: string;
  loanType: string;
  id: number;
  leadStage: string;
  leadStatus: string;
  leadStatusRemarks: string;
}

export function compareLoans(c1: LoanLead, c2: LoanLead) {
  const compare = c1.id - c2.id;

  if (compare > 0) {
    return 1;
  } else if (compare < 0) {
    return -1;
  } else return 0;
}
