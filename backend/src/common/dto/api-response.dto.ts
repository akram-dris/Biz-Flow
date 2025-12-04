export class ApiResponseDto<T> {
    success: boolean;
    data?: T;
    message?: string;
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
    };

    static success<T>(data: T, message?: string): ApiResponseDto<T> {
        const response = new ApiResponseDto<T>();
        response.success = true;
        response.data = data;
        if (message) response.message = message;
        return response;
    }

    static paginated<T>(
        data: T[],
        total: number,
        page: number,
        limit: number,
    ): ApiResponseDto<T[]> {
        const response = new ApiResponseDto<T[]>();
        response.success = true;
        response.data = data;
        response.meta = {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
        return response;
    }
}

export class PaginationDto {
    page?: number = 1;
    limit?: number = 10;
}
