declare enum LogLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    DEBUG = "debug"
}
declare class Logger {
    private static level;
    static setLevel(level: LogLevel): void;
    private static log;
    private static shouldLog;
    static error(message: string, meta?: object): void;
    static warn(message: string, meta?: object): void;
    static info(message: string, meta?: object): void;
    static debug(message: string, meta?: object): void;
}
export { Logger, LogLevel };
