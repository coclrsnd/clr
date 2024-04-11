import { Injectable } from '@angular/core';
import { UploadFileRequest } from '../models/upload';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class FileUploadService {
  constructor(private httpClient: HttpClient) { }

  LOAN_BULK_UPLOAD = `mutation BulkLoanUpload($bulkUploadRequest: BulkUploadRequestInput!) {
    bulkLoanUpload(bulkUploadRequest: $bulkUploadRequest)
  }
  `;

  public uploadLoanFile(fileUploadRequest: UploadFileRequest) {

    const variables = {
        file: fileUploadRequest.file,
        organizationCode: fileUploadRequest.OrgCode
    }

    const body = {
      query: `mutation BulkLoanUpload($bulkUploadRequest: BulkUploadRequestInput!) {
        bulkLoanUpload(input: { bulkUploadRequest: $bulkUploadRequest }) {
          boolean
        }
      }
      `,
      variables: {
        bulkUploadRequest: {
          organizationCode: fileUploadRequest.OrgCode,
          file: null
        }
      }
    };

    const formData = new FormData();

    formData.append('operations', JSON.stringify(body))
    formData.append('map', JSON.stringify({ '0' : ['variables.bulkUploadRequest.file'] }))
    formData.append('0', fileUploadRequest.file)
    const headers = new HttpHeaders({
      'GraphQL-Preflight': '1'
    });
    return this.httpClient.post<any>(environment.apiUrl, formData,{headers:headers});
  }

}
