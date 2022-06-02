export * from './provider';

export interface ProviderConfig {
  url: string;
  timeout?: number;
  retry?: number;
}