class BatchModel {
  private _id: any;
  private _batch_name: any;
  private _no_of_courses: any;

  constructor(data: any) {
    this._id = data["id"];
    this._batch_name = data["batch_name"];
    this._no_of_courses = data["no_of_courses"];
  }

  public getid(): any {
    return this._id;
  }

  public setid(value: any) {
    this._id = value;
  }

  public getbatch_name(): any {
    return this._batch_name;
  }

  public setbatch_name(value: any) {
    this._batch_name = value;
  }

  public getno_of_courses(): any {
    return this._no_of_courses;
  }

  public setno_of_courses(value: any) {
    this._no_of_courses = value;
  }

  public toJson(): any {
    return {
      "id": this._id,
      "batch_name": this._batch_name,
      "no_of_courses": this._no_of_courses,
    };
  }

  public static fromJson(json: any): BatchModel {
    return new BatchModel(json);
  }
}

export default BatchModel;
