using User.Domain.Common;

namespace User.Domain.Entities
{
    public class Loans : EntityBase
    {
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public string OrganizationCode { get; set; }
        public string? OrganizationName { get; set; }
        public string AdharNumber { get; set; }
        public DateTime LoanDate { get; set; }
        public string LoanBorrower { get; set; }
        public string LoanType { get; set; }
        public string? RepaymentStatus { get; set; }
         public string? Remarks { get; set; }
        public string? SecurityReports { get; set; }
        public string? VehicleNo { get; set; }
        public string?  Suretyholder1 { get; set; }
        public string?  Suretyholder1Adhar { get; set; }
        public string?  Suretyholder2 { get; set; }
        public string?  Suretyholder2Adhar { get; set; }
    }
}
