using HotChocolate.Types;

namespace User.Api.Types
{
    public class BulkUploadRequest
    {
        public string OrganizationCode { get; set; }
        public IFile File { get; set; } = null;

    }
}
