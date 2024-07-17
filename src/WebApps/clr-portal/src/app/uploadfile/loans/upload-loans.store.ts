import { ComponentStore } from "@ngrx/component-store";
import { UploadFileRequest } from "../models/upload";
import { FileUploadService } from "../service/upload.service";
import { Observable } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { Injectable } from "@angular/core";

export interface UploadLoanState {
  fileUploadRequest: UploadFileRequest;
  uploadStatus?: boolean;
}

const initialState: UploadLoanState = {
  fileUploadRequest: null,
  uploadStatus: undefined,
};

@Injectable()
export class UploadStore extends ComponentStore<UploadLoanState> {
  constructor(private fileUploadService: FileUploadService) {
    super(initialState);
  }

  readonly uploadStatus$ = this.select((state) => state.uploadStatus);

  readonly upload = this.effect(
    (fileUploadRequest$: Observable<UploadFileRequest>) =>
      fileUploadRequest$.pipe(
        switchMap((fileUploadRequest) =>
          this.fileUploadService.uploadLoanFile(fileUploadRequest).pipe(
            tap((response) =>
              this.patchState((state) => ({
                uploadStatus: true,
              })),
            ),
            catchError(() => {
              this.patchState((state) => ({
                uploadStatus: false,
              }));
              return [];
            }),
          ),
        ),
      ),
  );
}
