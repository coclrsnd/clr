import { InterchangeLocations } from "./interchange-locations.model";

export class StorageFacilityInterchangesModel {
  Id: number;
  StorageFacilityId: number;
  Name: string;
  MarkCode: string;
  GrossRailRoadCapacity: number;
  //R260: string;
  UnitId: number;
  //FSAC: string;
  RailRoadId:number;
  RailRoadName:string;
  InterchangeLocations:InterchangeLocations[];
  IsActive:boolean;
}
