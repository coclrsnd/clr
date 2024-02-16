export {Loan_Query}

const Loan_Query = `query GetLoansDetails($adharNumber:String){
  loans(where: {adharNumber : {contains : $adharNumber}})
  {
    amount
    lastModifiedBy
    lastModifiedDate
    status
    organizationCode
    adharNumber
    loanDate
    loanBorrower
    loanType
    id
    createdBy
  }
}`
