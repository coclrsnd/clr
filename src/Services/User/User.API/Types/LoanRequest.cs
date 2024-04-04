using System;

namespace User.Api.Types
{
    public class LoanRequestModel
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public string OrganizationCode { get; set; }
        public string AdharNumber { get; set; }
        public DateTime LoanDate { get; set; }
        public string LoanBorrower { get; set; }
        public string LoanType { get; set; }
    }
}
