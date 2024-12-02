export interface TelemetreeConfig {
    apiGateway: string;
    requestTimeout: number;
    defaultSystemEventPrefix: string;
    defaultSystemEventDataSeparator: string;
}
export declare const defaultConfig: TelemetreeConfig;
export declare const getConfig: () => TelemetreeConfig;
export declare const setConfig: (newConfig: Partial<TelemetreeConfig>) => void;
