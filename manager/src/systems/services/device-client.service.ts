import { Injectable } from '@nestjs/common';
import { HttpClientService } from '/src/systems/services/http-client.service';

type StatusResponse = {
  active: boolean;
  time: number;
};

type OffResponse = {
  active: false;
};

type OnResponse = StatusResponse & {
  active: true;
};

type InfoResponse = {
  name: string;
  version: string;
  description?: string | null;
  disk: {
    used: number;
    total: number;
    occupied: `${number}%`;
  };
};

@Injectable()
export class DeviceClientService {
  constructor(private readonly http: HttpClientService) {}

  async fetchDeviceInfo(ipAddress: string) {
    return await this.http.get<InfoResponse>(`${ipAddress}/api/info`);
  }

  async fetchDeviceStatus(ipAddress: string) {
    return await this.http.get<StatusResponse>(`${ipAddress}/api/status`);
  }

  async startSwitch(ipAddress: string, min: number, sec: number) {
    return await this.http.get<OnResponse>(`${ipAddress}/api/on?min=${min}&sec=${sec}`);
  }

  async stopSwitch(ipAddress: string) {
    return await this.http.get<OffResponse>(`${ipAddress}/api/off`);
  }
}
