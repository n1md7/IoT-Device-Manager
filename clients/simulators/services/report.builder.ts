import type { Status } from '../enums/status.enum.ts';

export class ReportBuilder {
  private status = '';
  private code = '';
  private type = 'SWITCH';
  private name = '';
  private version = '1';
  private value = 0;

  addStatus(status: Status) {
    this.status = status;

    return this;
  }

  addCode(code: string) {
    this.code = code;

    return this;
  }

  addType(type: string) {
    this.type = type;

    return this;
  }

  addName(name: string) {
    this.name = name;

    return this;
  }

  addVersion(version: string) {
    this.version = version;

    return this;
  }

  addValue(value: number) {
    this.value = value;

    return this;
  }

  toJSON() {
    return {
      status: this.status,
      code: this.code,
      type: this.type,
      name: this.name,
      version: this.version,
      value: this.value,
    };
  }

  toCSV() {
    return [
      this.status,
      this.code,
      this.type,
      this.name,
      this.version,
      this.value,
    ].join(',');
  }

  reset() {
    this.status = '';
    this.code = '';
    this.type = '';
    this.name = '';
    this.version = '1';
    this.value = 0;

    return this;
  }
}
