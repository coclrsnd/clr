export interface Lead {
    
    leadstatus: string;
    organizationCode: string;
    organizationName: string;
    adharNumber: string;
    loanDate: Date;
    loanBorrower: string;
    loanType: string;
    remarks:string;
    id: number;
    securityReports:string;
    vehicleNo:string;
    leadstage:string;
    
  }
  
  export function compareLoans(c1: Lead, c2: Lead) {
    const compare = c1.id - c2.id;
  
    if (compare > 0) {
      return 1;
    } else if (compare < 0) {
      return -1;
    } else return 0;
  }
  