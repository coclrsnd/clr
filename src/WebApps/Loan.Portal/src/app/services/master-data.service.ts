import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { CountryModel } from '../shared/models/country-model.model';
import { StateModel } from '../shared/models/state-model.model';
import { OrganizationModel } from '../shared/models/organization-model.model';
import { RegionModel } from '../shared/models/region.model';
import { StorageFacilityInterchangesModel } from '../shared/models/storage-facility-interchanges.model';
import { RailRoadModel } from '../shared/models/rail-road.model';
import { UserStatusModel } from '../shared/models/user-status.model';
import { UserTypeModel } from '../shared/models/userType.model';
import { GeocodeStation } from '../shared/models/geocode-station.model';
import { ContractRateTypeModel } from '../shared/models/contractratetype.model';
import { SwitchInSwitchOutModel } from '../shared/models/switchin-switchout.model';

@Injectable({
  providedIn: 'root',
})
export class MasterDataService {
  private baseUrl = environment.apiUrl;
  private MasterDataServiceAPIPrefix: string = 'api/Master';
  private freightRailServiceAPIPRefix:string = 'api/FreightRail';

  constructor(
    private apiCountryDataService: ApiService<CountryModel>,
    private apiStateDataService: ApiService<StateModel>,
    private apiService: ApiService<string>,
    private apiOrganizationService: ApiService<OrganizationModel>,
    private apiRegionService: ApiService<RegionModel>,
    private apiRailRoadService: ApiService<RailRoadModel>,
    private apiSFInterchangeService:ApiService<StorageFacilityInterchangesModel>,
    private apiUserTypeService: ApiService<UserTypeModel>,
    private apiUserStatusService: ApiService<UserStatusModel>,
    private apiGeocodeStationService: ApiService<GeocodeStation[]>,
    private apiSwitchInSwitchOutService: ApiService<SwitchInSwitchOutModel>
  ) {}

  getCountryList(): Observable<CountryModel[]> {
    let route: string =
      this.MasterDataServiceAPIPrefix.concat(`/GetCountryList`);
    return this.apiCountryDataService.get(route).pipe(retry(0));
  }

  /* To Get States for requested Country Id */
  getStateListByCountryId(countryID: number): Observable<StateModel[]> {
    let route: string = this.MasterDataServiceAPIPrefix.concat(
      `/GetStatesByCountryID`
    );
    return this.apiStateDataService.get(route + '/' + countryID).pipe(retry(0));
  }

  /* To Get the list of customer city */
  GetCustomersCityList(): Observable<string[]> {
    let route: string = this.MasterDataServiceAPIPrefix.concat(`/GetCity`);
    return this.apiService.get(route + '/cust').pipe(
      retry(0)
      //catchError(this.handleError)
    );
  }

  GetAllOrganizationsList(searchText: string): Observable<OrganizationModel[]> {
    let route: string = this.MasterDataServiceAPIPrefix.concat(
      `/GetOrganizationList/`
    );
    return this.apiOrganizationService.get(route + searchText).pipe(
      retry(0)
      //catchError(this.handleError)
    );
  }

  GetOrganizations(): Observable<OrganizationModel[]> {
    let route: string =
      this.MasterDataServiceAPIPrefix.concat(`/GetOrganizations/`);
    return this.apiOrganizationService.get(route).pipe(
      retry(0)
      //catchError(this.handleError)
    );
  }

  SaveAndGetOrganization(
    model: OrganizationModel
  ): Observable<OrganizationModel> {
    let route: string = this.MasterDataServiceAPIPrefix.concat(
      `/SaveAndGetOrganization/`
    );
    return this.apiOrganizationService.put(route, model).pipe(
      retry(0)
      //catchError(this.handleError)
    );
  }

  getregionList(): Observable<RegionModel[]> {
    let route: string = this.MasterDataServiceAPIPrefix.concat(`/GetRegions`);
    return this.apiRegionService.get(route).pipe(retry(0));
  }

  /* To Get Interchanges list for requested organization or/and storage facility */
  getInterchangeList(
    orgId: number,
    sfId: number
  ): Observable<StorageFacilityInterchangesModel[]> {
    let route: string =
      this.MasterDataServiceAPIPrefix.concat(`/GetInterchanges`);
    return this.apiSFInterchangeService
      .get(route + '/' + orgId + '/' + sfId)
      .pipe(retry(0));
  }

  /* To Get the list of vendor city */
  GetVendorCityList(): Observable<string[]> {
    let route: string = this.MasterDataServiceAPIPrefix.concat(`/GetCity`);
    return this.apiService.get(route + '/vendor').pipe(
      retry(0)
      //catchError(this.handleError)
    );
  }
  /* To Get All RailRoad list*/
  getRailRoadList(): Observable<RailRoadModel[]> {
    let route: string =
      this.MasterDataServiceAPIPrefix.concat(`/GetAllRailRoads`);
    return this.apiRailRoadService.get(route).pipe(retry(0));
  }

  /* To Get Regions for requested Country Id */
  GetRegionByCountryID(countryID: number): Observable<RegionModel[]> {
    let route: string = this.MasterDataServiceAPIPrefix.concat(
      `/GetRegionByCountryID`
    );
    return this.apiRegionService.get(route + '/' + countryID).pipe(retry(0));
  }

  GetUserTypes(): Observable<UserTypeModel[]> {
    let route: string = this.MasterDataServiceAPIPrefix.concat(`/GetUserTypes`);
    return this.apiUserTypeService.get(route).pipe(retry(0));
  }

  GetUserStatuses(): Observable<UserStatusModel[]> {
    let route: string =
      this.MasterDataServiceAPIPrefix.concat(`/GetUserStatuses`);
    return this.apiUserStatusService.get(route).pipe(retry(0));
  }

  GetContractRateTypes(): Observable<ContractRateTypeModel[]> {
    let route: string =
      this.MasterDataServiceAPIPrefix.concat(`/GetAllContractRateTypes`);
    return this.apiUserStatusService.get(route).pipe(retry(0));
  }

  GetSwitchInSwitchOutList(): Observable<any> {
    let route: string =
      this.MasterDataServiceAPIPrefix.concat(`/GetSwitchInSwitchOutList`);
    return this.apiSwitchInSwitchOutService.get(route).pipe(retry(0));
  }

  GetGeoCodeStationDetail(
    city: string,
    state: string,
    mark: string
  ): Observable<GeocodeStation[]> {
    let route: string =
      this.freightRailServiceAPIPRefix.concat(`/GeocodeStation?city=`);
      if(mark!=''){
        return this.apiGeocodeStationService.postWithoutModel(route+city+"&state="+state+"&mark="+mark).pipe(retry(0));
      }
   else{
    return this.apiGeocodeStationService.postWithoutModel(route+city+"&state="+state).pipe(retry(0));
   }
  }
}
