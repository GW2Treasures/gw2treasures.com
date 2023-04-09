export interface Job {
  run(data: object | undefined): Promise<string | void> | string | void;
}
