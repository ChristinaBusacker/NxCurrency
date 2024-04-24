export const environment = {
    API_URL: 'http://localhost:3000/api',
    HISTORYKEY: {
        calulations: 'calculation_history',
        options: 'option_history'
    },
    CURRENCY_OPTIONS: [
        { symbol: "€", name: "Euro", decimal_digits: 2, code: "EUR" },
        { symbol: "$", name: "US Dollar", decimal_digits: 2, code: "USD" },
        { symbol: "£", name: "British Pound Sterling", decimal_digits: 2, code: "GBP" }
    ]
}