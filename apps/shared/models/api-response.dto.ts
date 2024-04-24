export class ApiResponse<T> {
    data?: T | null;
    error?: any;
    success = true;
    timestamp: string = new Date().toISOString();

    constructor(data: T | null = null, error?: any) {
        this.data = data;
        this.error = error;

        if (error) {
            this.success = false;
        }
    }

    static success<T>(data: T): ApiResponse<T> {
        return new ApiResponse<T>(data);
    }

    static fail<T>(error: any): ApiResponse<T> {
        return new ApiResponse<T>(null, error);
    }
}