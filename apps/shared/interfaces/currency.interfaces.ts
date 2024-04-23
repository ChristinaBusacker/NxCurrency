export interface FreecurrencyapiResponse {
    data: { [key: string]: Currency };
}

export interface Currency {
    symbol: string;
    name: string;
    decimal_digits: number;
    code: string;
}