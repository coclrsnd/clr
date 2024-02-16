import { Injectable } from '@angular/core';
import { Observable,retry } from 'rxjs';
import { SaveSearchModel } from '../shared/models/save-search.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SavedSearchService {
  public SavedSearchApiRoutePrefix:string="api/SavedSearch";
  constructor(private apiSavedSearchService: ApiService<SaveSearchModel>) { }

  SaveSearch(saveSearchModel:SaveSearchModel):Observable<SaveSearchModel>{
    let route: string = this.SavedSearchApiRoutePrefix.concat(`/SaveSearch`);
    return this.apiSavedSearchService.post(route, saveSearchModel).pipe(
      retry(0),
      //catchError(this.handleError)
    )
  }

  GetAllSavedSearch():Observable<SaveSearchModel[]>{
    let route: string = this.SavedSearchApiRoutePrefix.concat(`/GetAllSavedSearch`);
    return this.apiSavedSearchService.get(route).pipe(
      retry(0),
      //catchError(this.handleError)
    )
  }

  GetSavedSearchForDashboard():Observable<SaveSearchModel[]>{
    let route: string = this.SavedSearchApiRoutePrefix.concat(`/GetSavedSearchForDashboard`);
    return this.apiSavedSearchService.get(route).pipe(
      retry(0),
      //catchError(this.handleError)
    )
  }
}
