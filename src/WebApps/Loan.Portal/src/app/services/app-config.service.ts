import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class AppConfigService{

    private appConfig;

    constructor(private injector:Injector){ }

    loadAppConfig(){
        let http= this.injector.get(HttpClient);
        if(environment.run=='dev')
        {
            return http.get('/assets/app-config.json')
            .toPromise()
            .then(data=>{
                this.appConfig=data;
            });
        }
        else
        {
            return http.get('/assets/app-config.json')
            .toPromise()
            .then(data=>{
                this.appConfig=data;
            });
        }
    }

    get config() {
        return this.appConfig;
      }
}
