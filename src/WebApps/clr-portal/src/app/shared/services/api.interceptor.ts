import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, throwError } from "rxjs";
import { LoaderService } from "../components/loader/loader.service";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  errortimeout: number = 4000;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private loaderService: LoaderService,
  ) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (httpRequest.url.indexOf("GetRefreshToken") > 0) {
      this.loaderService.isLoading.next(false);
    } else {
      this.loaderService.isLoading.next(true);
    }
    return next
      .handle(httpRequest)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          let errorMessage = "";
          if (err instanceof HttpErrorResponse) {
            if ([401, 403].includes(err.status)) {
              localStorage.removeItem("Token"); // call logout from service to clear all;
              errorMessage =
                "You are not authorized to take this action. Please login again...";
              this.toastr.error(errorMessage, "", {
                enableHtml: true,
                timeOut: this.errortimeout,
                progressBar: true,
                progressAnimation: "increasing",
              });
              let navData: any = [];
              localStorage.setItem("openedNavigation", navData);
              localStorage.removeItem("Token");
              this.router.navigate(["/"]);
            }
          }
          if (err.status == 400) {
            if (err.error.Message) {
              this.toastr.error(err.error.Message, "", {
                enableHtml: true,
                timeOut: this.errortimeout,
                progressBar: true,
                progressAnimation: "increasing",
              });
            } else if (err.error.ErrorDetails) {
              this.toastr.error(err.error.ErrorDetails, "", {
                enableHtml: true,
                timeOut: this.errortimeout,
                progressBar: true,
                progressAnimation: "increasing",
              });
            } else if (err.error.ErrMsg) {
              this.toastr.error(err.error.ErrMsg, "", {
                enableHtml: true,
                timeOut: this.errortimeout,
                progressBar: true,
                progressAnimation: "increasing",
              });
            } else if (err.error.title) {
              this.toastr.error(
                "Unable to process request. Please try after sometime.",
                "",
                {
                  enableHtml: true,
                  timeOut: this.errortimeout,
                  progressBar: true,
                  progressAnimation: "increasing",
                },
              );
            } else if (err.error) {
              this.toastr.error(err.error, "", {
                enableHtml: true,
                timeOut: this.errortimeout,
                progressBar: true,
                progressAnimation: "increasing",
              });
            } else {
              this.toastr.error("Please contact administrator.", "Error", {
                enableHtml: true,
                timeOut: this.errortimeout,
                progressBar: true,
                progressAnimation: "increasing",
              });
            }
          }
          this.loaderService.isLoading.next(false);
          return throwError(() => {
            new Error(errorMessage);
          });
        }),
      )
      .pipe(
        map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
          if (evt instanceof HttpResponse) {
            this.loaderService.isLoading.next(false);
          }
          return evt;
        }),
      );
  }
}
