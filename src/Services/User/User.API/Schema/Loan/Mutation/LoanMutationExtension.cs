using AutoMapper;
using CsvHelper.Configuration;
using CsvHelper;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using User.Api.Types;
using User.Domain.Entities;
using User.GraphQL.Extensions;
using User.Infrastructure.Persistence;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Linq;

namespace User.GraphQL.Schema.Loan.Mutation
{
    [ExtendObjectType(HotChocolate.Language.OperationType.Mutation)]
    public class LoanMutationExtension
    {
        private readonly IMapper _mapper;

        public LoanMutationExtension(IMapper mapper)
        {
            _mapper = mapper;
        }

        [UseApplicationDbContext]
        public async Task<int> SaveLoan([ScopedService] UserContext context, LoanRequestModel loanRequestInput, CancellationToken cancellationToken)
        {
            try
            {
                if (loanRequestInput.Id <= 0)
                {
                    var loan = _mapper.Map<Loans>(loanRequestInput);
                    var loanEntity = await context.Loans.AddAsync(loan);
                    await context.SaveChangesAsync();
                    return loanEntity.Entity.Id;
                }
                else
                {
                    var loan = _mapper.Map<Loans>(loanRequestInput);
                    var loanEntity = context.Loans.Update(loan);
                    await context.SaveChangesAsync();
                    return loanEntity.Entity.Id;
                }

            }
            catch (Exception ex)
            {
                throw new Exception("Error While Signing up");
            }
        }

        [UseApplicationDbContext]
        public async Task<bool> BulkLoanUpload([ScopedService] UserContext context, BulkUploadRequest bulkUploadRequest, CancellationToken cancellationToken)
        {
            try
            {
                if (bulkUploadRequest.File == null || bulkUploadRequest.File.Length == 0)
                {
                    throw new Exception("No files exist");
                }

                string json = "";

                using (var reader = new StreamReader(bulkUploadRequest.File.OpenReadStream()))
                using (var csv = new CsvReader(reader, System.Globalization.CultureInfo.InvariantCulture))
                {
                    // Read CSV records
                    var records = csv.GetRecords<dynamic>();

                    // Convert records to list
                    var recordsList = new List<dynamic>(records);

                    // Serialize records to JSON
                    json = JsonConvert.SerializeObject(recordsList);

                    // Return JSON response
                    Debug.WriteLine(json);
                }

                var organizationName = context.Organizations.Where(org=>org.Code == bulkUploadRequest.OrganizationCode).FirstOrDefault().Name;

                var loans = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Loans>>(json);
                loans.ForEach(loan =>
                {
                    loan.OrganizationCode = bulkUploadRequest.OrganizationCode;
                    loan.OrganizationName = organizationName;
                    loan.LoanDate = DateTime.SpecifyKind(loan.LoanDate, DateTimeKind.Utc);
                });

                context.Loans.AddRange(loans);
                var entity = await context.SaveChangesAsync();
                return true;

            }
            catch (Exception ex)
            {
                throw new Exception("Error While uploading");
            }
        }

    }
}
