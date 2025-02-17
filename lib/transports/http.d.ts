import { Transport, TransportOptions } from '../types';

export declare const defaultHttpTransportOptions: (apiKey: string, method?: string) => TransportOptions;
export declare class HTTPTransport implements Transport {
    protected _options: TransportOptions;
    constructor(_options: TransportOptions);
    setOptions(options: TransportOptions): void;
    send(apiGateway: string, method: 'POST' | 'GET', payload?: string): Promise<Response>;
}
