export class ReviewType {
  ReviewContentText: string = "";
  PlaceRate: number = 0;
  LocationReferenceID: string = "";
  LocationName: string = "";
  Address: string = "";
  GeoLocation: {
    Lat: number;
    Lng: number;
  } = { Lat: 0, Lng: 0 };
  Photos: Array<string> = [];
}

export class ReviewByCommentsType {
  ID: string = "";
  ReviewContentText: string = "";
  PlaceRate: number = 0;
  AuthorEmail: string = "";
  AuthorPicture: string = "";
  LocationReferenceID: string = "";
  LocationName: string = "";
  Address: string = "";
  GeoLocation: {
    Lat: number;
    Lng: number;
  } = { Lat: 0, Lng: 0 };
  Photos: Array<string> = [];
  Comments: Array<string> = [];
  WrittenDate: Date = new Date();
}
