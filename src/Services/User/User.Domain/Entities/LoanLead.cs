using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using User.Domain.Common;

namespace User.Domain.Entities
{
    public class LoanLead:EntityBase
    {
        public DateTime LoanDate { get; set; }
        public string LoanBorrower { get; set; }
        public string AdharNumber { get; set; }
        public string OrganizationCode { get; set; }
        public string LoanType { get; set; }
        public string leadstage { get; set; }
        public string leadstatus { get; set; }
        public string leadstatusremarks { get; set;}

    


    }
}
