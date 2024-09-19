export class UserWithPermissions {
    id: number;
    username: string;
    password? : string;
    email: string;
    role: string;
    isActive: boolean;
    permissions?: string[];  // Optional permissions field
  }
  