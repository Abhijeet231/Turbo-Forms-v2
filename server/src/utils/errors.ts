// Typed application errors carrying the HTTP status they should map to.
// The global errorHandler honours `statusCode`, so throwing these from a
// service produces the right response without string-matching in the handler.

export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = new.target.name;
        this.statusCode = statusCode;
    }
}

// Bad request: the submitted data failed validation (400).
export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}
