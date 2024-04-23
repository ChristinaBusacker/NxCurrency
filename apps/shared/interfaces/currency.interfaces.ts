export interface FreecurrencyapiResponse<T> {
    data: { [key: string]: T };
}

export interface Currency {
    symbol: string;
    name: string;
    decimal_digits: number;
    code: string;
}