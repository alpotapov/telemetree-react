import { Transport, TransportOptions } from '../types';

export declare class TransportFactory {
    static readonly transports: Record<string, any>;
    static getTransport(name: string, options: TransportOptions): Transport;
}
