export class CreateSmsDto {
  public type: string;
  public contentType: string;
  public countryCode: string;
  public from: string;
  public content: string;
  public messages: Array<object>;
}
