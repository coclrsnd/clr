export interface LoanLead {
    
    organizationCode: string;
    organizationName: string;
    adharNumber: string;
    loanDate: Date;
    loanBorrower: string;
    loanType: string;
    id: number;
    securityReports:string;
    vehicleNo:string;
    leadstage:string;
    leadstatus: string;
    leadstatusremarks:string;
    
  }
  
  export function compareLoans(c1: LoanLead, c2: LoanLead) {
    const compare = c1.id - c2.id;
  
    if (compare > 0) {
      return 1;
    } else if (compare < 0) {
      return -1;
    } else return 0;
  }
  