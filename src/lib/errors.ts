export class AppError extends Error {
  constructor(
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

// If you want client-safe messages only, extend from AppError or make PublicError a separate class
export class PublicError extends AppError {
  constructor(message: string, code?: string) {
    super(message, code);
    this.name = "PublicError";
  }
}

// 🔐 Auth-related
export class AuthenticationError extends PublicError {
  constructor() {
    super("You must be logged in to view this content", "AUTH_REQUIRED");
    this.name = "AuthenticationError";
  }
}

// 📨 Email-related
export class EmailInUseError extends PublicError {
  constructor() {
    super("Email is already in use", "EMAIL_IN_USE");
    this.name = "EmailInUseError";
  }
}

// 📦 Resource lookup
export class NotFoundError extends PublicError {
  constructor() {
    super("Resource not found", "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

// ⏰ Token expiration
export class TokenExpiredError extends PublicError {
  constructor() {
    super("Token has expired", "TOKEN_EXPIRED");
    this.name = "TokenExpiredError";
  }
}

// 🔐 Login issues
export class LoginError extends PublicError {
  constructor() {
    super("Invalid email or password", "INVALID_CREDENTIALS");
    this.name = "LoginError";
  }
}

export class RateLimitError extends Error {
  constructor() {
    super("Rate limit exceeded");
    this.name = "RateLimitError";
  }
}
