class StudentModel {
  private _id: any;
  private _roll_no: any;
  private _email: any;
  private _course_name: any;
  private _course_url: any;
  private _course_duration: any;
  private _platform: any;
  private _course_completion_date: any;
  private _upload_certificate: any;
  private _batch: any;
  private _course_mode: any;
  private _user_id: any;

  constructor(data: any) {
    this._id = data["id"];
    this._roll_no = data["roll_no"];
    this._email = data["email"];
    this._course_name = data["course_name"];
    this._course_url = data["course_url"];
    this._course_duration = data["course_duration"];
    this._platform = data["platform"];
    this._course_completion_date = data["course_completion_date"];
    this._upload_certificate = data["upload_certificate"];
    this._batch = data["batch"];
    this._course_mode = data["course_mode"];
    this._user_id = data["user_id"];
  }

  public getid(): any {
    return this._id;
  }

  public setid(value: any) {
    this._id = value;
  }

  public getroll_no(): any {
    return this._roll_no;
  }

  public setroll_no(value: any) {
    this._roll_no = value;
  }

  public getemail(): any {
    return this._email;
  }

  public setemail(value: any) {
    this._email = value;
  }

  public getcourse_name(): any {
    return this._course_name;
  }

  public setcourse_name(value: any) {
    this._course_name = value;
  }

  public getcourse_url(): any {
    return this._course_url;
  }

  public setcourse_url(value: any) {
    this._course_url = value;
  }

  public getcourse_duration(): any {
    return this._course_duration;
  }

  public setcourse_duration(value: any) {
    this._course_duration = value;
  }

  public getplatform(): any {
    return this._platform;
  }

  public setplatform(value: any) {
    this._platform = value;
  }

  public getcourse_completion_date(): any {
    return this._course_completion_date;
  }

  public setcourse_completion_date(value: any) {
    this._course_completion_date = value;
  }

  public getupload_certificate(): any {
    return this._upload_certificate;
  }

  public setupload_certificate(value: any) {
    this._upload_certificate = value;
  }

  public getbatch(): any {
    return this._batch;
  }

  public setbatch(value: any) {
    this._batch = value;
  }

  public getcourse_mode(): any {
    return this._course_mode;
  }

  public setcourse_mode(value: any) {
    this._course_mode = value;
  }

  public getuser_id(): any {
    return this._user_id;
  }

  public setuser_id(value: any) {
    this._user_id = value;
  }

  public toJson(): any {
    return {
      "id": this._id,
      "roll_no": this._roll_no,
      "email": this._email,
      "course_name": this._course_name,
      "course_url": this._course_url,
      "course_duration": this._course_duration,
      "platform": this._platform,
      "course_completion_date": this._course_completion_date,
      "upload_certificate": this._upload_certificate,
      "batch": this._batch,
      "course_mode": this._course_mode,
      "user_id": this._user_id,
    };
  }

  public static fromJson(json: any): StudentModel {
    return new StudentModel(json);
  }
}

export default StudentModel;
