using User.Domain.Common;

namespace User.Domain.Entities
{
    public class Loans : EntityBase
    {
        public decimal Amount { get; set; }
        public int Status { get; set; }
        public string OrganizationCode { get; set; }
        public string AdharNumber { get; set; }
        public DateTime LoanDate { get; set; }
        public string LoanBorrower { get; set; }
        public string LoanType { get; set; }
    }
}
