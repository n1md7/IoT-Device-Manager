import { HttpService } from '@nestjs/axios';
import { HttpException, Inject, Injectable, Optional } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { delay, lastValueFrom, Observable, retry, take } from 'rxjs';
import { HttpOptions } from '/src/systems/enum/http.enum';

type Options = {
  baseUrl: string;
  maxRetriesOnFail: number;
  retryDelay: number;
  timeout: number;
  headers: Record<string, string>;
};

@Injectable()
export class HttpClientService {
  private readonly baseUrl: string;
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private readonly timeout: number;
  private readonly defaultConfig: AxiosRequestConfig;

  constructor(
    private readonly httpService: HttpService,
    @Inject(HttpOptions.Options) @Optional() options: Partial<Options>,
  ) {
    this.baseUrl = options.baseUrl || '';
    this.maxRetries = options.maxRetriesOnFail || 3;
    this.retryDelay = options.retryDelay || 1000; // ms
    this.timeout = options.timeout || 5000; // 5s
    this.defaultConfig = {
      timeout: this.timeout,
      headers: options.headers || {},
    };
  }

  async get<T>(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<T>> {
    return lastValueFrom(this.handleRetryOnFailure(this.httpService.get(this.getUrl(url), this.getConfig(config))));
  }

  async post<R, D = any>(url: string, data?: D, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<R>> {
    return lastValueFrom(this.handleRetryOnFailure(this.httpService.post(this.getUrl(url), data, this.getConfig(config))));
  }

  async put<R, D = any>(url: string, data?: D, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<R>> {
    return lastValueFrom(this.handleRetryOnFailure(this.httpService.put(this.getUrl(url), data, this.getConfig(config))));
  }

  async delete<T>(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<T>> {
    return lastValueFrom(this.handleRetryOnFailure(this.httpService.delete(this.getUrl(url), this.getConfig(config))));
  }

  private handleRetryOnFailure<T>(requestObservable: Observable<AxiosResponse<T>>): Observable<AxiosResponse<T>> {
    return requestObservable.pipe(retry(this.maxRetries), delay(this.retryDelay), take(1));
  }

  private getUrl(path: string): string {
    try {
      if (!this.baseUrl) return new URL(path).toString();
      return new URL(path, this.baseUrl).toString();
    } catch (err) {
      throw new HttpException(`Invalid URL: "${this.baseUrl}/${path}"`, 500);
    }
  }

  private getConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
    return { ...this.defaultConfig, ...config };
  }
}
