using System;

namespace ConferencePlanner.GraphQL.Types
{
    public class LoanLeadRequestModel
    {
        public int Id { get; set; }
        public DateTime LoanDate { get; set; }
        public string LoanBorrower { get; set; }
        public string AdharNumber { get; set; }
        public string OrganizationCode { get; set; }
        public string? LoanType { get; set; }
        public string? LeadStage { get; set; }
        public string? LeadStatus { get; set; }
        public string ?LeadStatusRemarks { get; set; }
        public int? Amount { get; set;}


    }
}

