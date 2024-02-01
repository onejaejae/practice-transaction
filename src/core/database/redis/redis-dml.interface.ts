export const RedisDLMKey = 'RedisDLMKey';

export interface IRedisDLM {
  acquireLock(key: string): Promise<string>;
  tryToAcquireLock(key: string): Promise<{
    success: boolean;
    identity: string;
  }>;
  releaseLock(
    key: string,
    identity: string,
  ): Promise<{
    success: boolean;
  }>;
}
