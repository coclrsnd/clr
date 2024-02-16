export class SaveSearchModel {
    Id:number;
    Name:string;
    ScreenName:string;
    LastRun:Date|null;
    EffectiveDate:Date|null;
    ExpiryDate:Date|null;
    SavedBy:number;
    SearchCriteria:string;
    NavigateUrl:string;
}
