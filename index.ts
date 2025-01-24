import moment from 'moment';

enum LogLevel {
    INFO = 'INFO',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
    PRODUCTION = 'PRODUCTION',
}

const COLORS = {
    RESET: '\x1b[0m',
    INFO: '\u001b[34m',
    ERROR: '\u001b[31m',
    DEBUG: '\u001b[32m',
    PRODUCTION: '\u001b[32m',
    BOLD: '\x1b[1m',
    JSON: '\x1b[33m',
    BORDER: '\x1b[97m',
};

const LOG_EMOJIS = {
    [LogLevel.INFO]: '📝',
    [LogLevel.ERROR]: '🚨',
    [LogLevel.DEBUG]: '🔎',
    [LogLevel.PRODUCTION]: '🔬',
};

const BOX_TOP_LEFT = '┌';
const BOX_BOTTOM_LEFT = '└';
const BOX_HORIZONTAL = '─';
const BOX_VERTICAL = '│';
const BOX_WIDTH = 80;

export class Logger {
    private static shouldLog(level: LogLevel): boolean {
        return __DEV__ || level === LogLevel.PRODUCTION;
    }

    private static getFormattedTimestamp(): string {
        return moment().format('HH:mm:ss');
    }

    private static printMessage(message: string): void {
        console.log(message);
    }

    private static async formatMessage(level: LogLevel, message: string, data?: any): Promise<string> {
        const timestamp = `${COLORS.BORDER}[${this.getFormattedTimestamp()}]${COLORS.RESET}`;
        const emoji = LOG_EMOJIS[level];
        const color = COLORS[level] || COLORS.RESET;
        const callerInfo = `("Hello")`;

        const horizontalBorder = BOX_HORIZONTAL.repeat(BOX_WIDTH);

        let formattedMessage = `\n\n${COLORS.BORDER}${BOX_TOP_LEFT}${horizontalBorder}${COLORS.RESET}\n`;
        formattedMessage += `${COLORS.BORDER}${BOX_VERTICAL}${COLORS.RESET} ${emoji} ${color}[${level}]${COLORS.RESET} ${timestamp} ${COLORS.BORDER}[${callerInfo}]${COLORS.RESET}\n`;
        formattedMessage += `${COLORS.BORDER}${BOX_VERTICAL}${COLORS.RESET}\n`;

        const messageLines = message.split('\n');
        messageLines.forEach(line => {
            formattedMessage += `${COLORS.BORDER}${BOX_VERTICAL}${COLORS.RESET} ${color}${line}${COLORS.RESET}\n`;
        });

        formattedMessage += `\n`;

        if (data) {
            formattedMessage += `${COLORS.BORDER}${BOX_VERTICAL}${COLORS.RESET} DEBUG Content:\n`;
            formattedMessage += `${COLORS.BOLD}${COLORS.JSON}${JSON.stringify(data, null, 2)}${COLORS.RESET}\n`;
        }

        formattedMessage += `${COLORS.BORDER}${BOX_BOTTOM_LEFT}${horizontalBorder}${COLORS.RESET}\n`;

        return formattedMessage;
    }

    static async debug(message: string, data?: any): Promise<void> {
        if (this.shouldLog(LogLevel.DEBUG)) {
            const formattedMessage = await this.formatMessage(LogLevel.DEBUG, message, data);
            this.printMessage(formattedMessage);
        }
    }

    static async info(message: string, data?: any): Promise<void> {
        if (this.shouldLog(LogLevel.INFO)) {
            const formattedMessage = await this.formatMessage(LogLevel.INFO, message, data);
            this.printMessage(formattedMessage);
        }
    }

    static async error(message: string, data?: any): Promise<void> {
        if (this.shouldLog(LogLevel.ERROR)) {
            const formattedMessage = await this.formatMessage(LogLevel.ERROR, message, data);
            this.printMessage(formattedMessage);
        }
    }

    static async production(message: string, data?: any): Promise<void> {
        if (!__DEV__) {
            const formattedMessage = await this.formatMessage(LogLevel.PRODUCTION, message, data);
            this.printMessage(formattedMessage);
        }
    }
}
