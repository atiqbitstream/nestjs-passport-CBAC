
# NestJs Authentication & Authorization With passportjs & Role Based Access

Are you tired of worrying about user authentication and authorization in your NestJS applications and want role-based authorization? Look no further! This project provides a comprehensive, battle-tested solution for managing user access and permissions, so you can focus on building amazing apps.

Built for developers, by developers

Whether you're a solo dev or part of a team, this project is designed to help you:

1. Secure your app with robust authentication and authorization

2. Scale your solution with confidence

3. Customize access control to fit your unique needs


## API Reference

#### Create a User

```http
  POST  http://localhost:3000/users/signup
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username,password,email` | `string` | **Required**. Running database |

#### Login User

```http
  POST  http://localhost:3000/auth/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username,password`      | `string` | **Required**.  |

#### View  Profile

```http
  GET http://localhost:3000/profile
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username,password`      | `string` | **Required**. Jwt Access Token |

#### View Protected Route (Based On Role based Access)

```http
  POST http://localhost:3000/profile
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username,password`      | `string` | **Required**. Jwt Bearer Token |


#### Create an Admin

```http
  POST  http://localhost:3000/admin/signup
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username,password,email` | `string` | **Required**. Running database |

#### Login Admin

```http
  POST   http://localhost:3000/auth/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username,password`      | `string` | **Required**.  |

#### View  Profile

```http
  GET http://localhost:3000/profile
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username,password`      | `string` | **Required**. Jwt Access Token |

#### View Protected Route (Based On Role based Access)

```http
  POST http://localhost:3000/profile
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username,password`      | `string` | **Required**. Jwt Bearer Token |



## Appendix

Any additional information goes here


## Author

- [AtiqBytes](https://github.com/AtiqBytes)
## Badges

Add badges from somewhere like: [shields.io](https://shields.io/)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.


## Demo



## Deployment

To deploy this project run

```bash
  npm run start:dev
```


## Documentation

1.  [Jwt](https://jwt.io/)

2.  [Passport Js](https://docs.nestjs.com/recipes/passport)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file. You can customize it the way you want :

`DB_PORT='5432'`

`DB_USERNAME='postgres'`

`DB_PASSWORD='root'`

`DB_DATABASE='passportdb'`








#### Q: Why am I getting a "403 Forbidden" error when accessing a protected route?

A: This usually happens when the user does not have the required role to access the route. Ensure that the `@Roles()` decorator is correctly applied to the route, and that the RolesGuard is verifying the roles correctly. Check that the user's role is included in the JWT payload when generating the token in `auth.service.ts`. Log the roles in the RolesGuard to ensure the correct roles are being checked, and verify that the roles are passed as an array in both the JWT payload and the user object.

#### Q: Why is roles.includes or roles.find throwing an error in RolesGuard?

A: This error occurs when roles is not an array, and you're trying to call array methods like includes() or find() on a non-array value. Ensure that the roles passed from the `@Roles()` decorator and in the JWT payload are arrays. In the RolesGuard, add a check to ensure roles is an array using `Array.isArray()`:


```typescript
if (!roles || !Array.isArray(roles)) {
  return true;  // No roles required, allow access
}
```

#### Q: Why is the role not included in the JWT token after login?

A: This happens when the role is not included in the payload when generating the JWT token in AuthService. Ensure that the role is part of the user object when generating the JWT in auth.service.ts:

```typescript
const payload = { username: user.username, sub: user.userId, roles: [user.role] };
```

Also, make sure that the roles are properly included when validating the token in jwt.strategy.ts:
```typescript
return { userId: payload.sub, username: payload.username, roles: payload.roles };
```

#### Q: Why is the admin login not working while user login works?

A: This can happen if the authentication logic is only checking the UsersService and not the AdminService when validating the user credentials. Ensure that in auth.service.ts, you're checking both the UsersService for regular users and the AdminService for admins:

```typescript
const user = await this.userService.findOne(username);
if (!user) {
  const admin = await this.adminService.findOne(username);
  // Check admin login
}
```

#### Q: Why is the RolesGuard always receiving ['admin'] in the roles variable, even for users?

A: This happens if the @Roles() decorator is hardcoded or incorrectly set, causing the guard to always receive the same role. Ensure that the @Roles() decorator is correctly applied on routes and dynamically sets roles based on the expected access level:
```typescript
@Roles('admin')  // For admin routes
@Roles('user')   // For user routes
```

#### Q: Why is the user.roles field undefined in the RolesGuard?

A: This occurs if the roles are not being properly set or returned in the validate method of jwt.strategy.ts. Ensure that the validate function in jwt.strategy.ts returns the roles array from the JWT payload:

```typescript
async validate(payload: any) {
  return { userId: payload.sub, username: payload.username, roles: payload.roles };
}
```

#### Q: Why am I getting Unauthorized during login even though the credentials are correct?

A: This might happen if the validateUser method in AuthService is not correctly validating credentials or if the password comparison using bcrypt fails. Verify that the user exists in the database by checking the UsersService and AdminService in validateUser, and ensure that bcrypt.compare() is properly comparing the plain-text password with the hashed password stored in the database.

#### Q: Why is the JWT token expiring too quickly (after 60 seconds)?

A: The expiration time of the JWT token is controlled by the expiresIn option in AuthService. If set too low, the token will expire quickly. Adjust the expiresIn value in the generateAccessToken method to a higher value if needed:

```typescript
return this.jwtService.sign(payload, { expiresIn: '3600s' });  // 1 hour
```

#### Q: Why is the refresh token not working properly or not returning a new access token?

A: This could happen if the refresh token is not validated correctly or if the validateRefreshToken method in AuthService is not correctly implemented. Ensure that the refresh token is properly validated in validateRefreshToken:

```typescript
const payload = this.jwtService.verify(token);
```
Check that the refresh token has a longer expiresIn value than the access token, and ensure the correct user data is returned from the refresh token validation.


## Features

- Role-Based Access Control
- JSON Web Token Authentication
- Customizable Authentication Flow
- Environment Variable Configuration
- Database Support
- Error Handling and Logging
- Cross-Platform Compatibility

## Feedback

If you have any feedback, please reach out to me at https://www.linkedin.com/in/atiq-ur-rehman-1314712aa/


## 🚀 About Me
I'm a full stack developer...

wokring in Angular | 
NestJs | 
Django |
Amazon Aws
# Hi, I'm Atiq Ur Rehman! 👋


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/AtiqBytes)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/atiq-ur-rehman-1314712aa/)



## Other Common Github Profile Sections
👩‍💻 I'm currently working on Backend

🧠 I'm currently learning NestJs

👯‍♀️ I'm looking to collaborate on full Stack Projects

🤔 I'm looking for help with getting Internship



## 🛠 Skills
Typescript, Javascript, HTML, CSS, Python


## Installation

Install my-project with npm

```bash
  cd my-project
  npm install 
  
```
    
## Lessons Learned

## Authorization with Enum Files:

Files Involved: role.enum.ts
- I learned that defining roles in an enum file like roles.enum.ts allows for effective role management.
-  By using enums, I can define roles such as admin and user and integrate these roles into the system consistently.
-   This ensures that roles are standardized across the application, especially when used in role-based access control.

## Role Management in User and Admin Entities:

Files Involved: user.entity.ts, admin.entity.ts

- I added a role column to both the User and Admin entities.
- This column helps assign a specific role to each user or admin in the system.
-  When retrieving users from the database, this role is included in the JWT token to handle role-based authorization.

## Defining Roles in DTOs:

Files Involved: create-user.dto.ts, create-admin.dto.ts

- I ensured that when creating users or admins, the role attribute is included in the DTOs (Data Transfer Objects).
-  This guarantees that the role is part of the request structure when creating new users or admins, making the role available for authorization checks.

##  Role Decorator and Guard:

Files Involved: roles.decorator.ts, roles.guard.ts
- I created a Roles decorator (roles.decorator.ts) to specify which roles are allowed to access specific routes. 
- The decorator allows me to define which roles (e.g., admin or user) are required to access a route.
- The RolesGuard (roles.guard.ts) then enforces these role requirements.
-  Initially, I faced issues when the guard failed due to roles.includes not being a function, but I fixed this by ensuring roles was always an array.
-  
## Handling Admin and User Login with JWT:

Files Involved: auth.service.ts, jwt.strategy.ts, local.strategy.ts

- I implemented a system where both admins and users can log in using the same authentication service.
-  Initially, I faced an issue where only user logins were working because I was only checking UsersService for validation.
-   I solved this by adding a check for AdminService in AuthService, ensuring that both admins and users can log in and receive their respective JWT tokens.

## Issues Faced:

## Fixing JWT Payload and Role Encoding:

Files Involved: auth.service.ts, jwt.strategy.ts

- I encountered an issue where the role was not included in the JWT payload, which caused the role guard to fail.
-  To resolve this, I updated the generateAccessToken and generateRefreshToken methods in auth.service.ts to include the user's role in the JWT payload.
-   Additionally, I fixed the JwtStrategy to ensure the roles were extracted correctly from the token payload.

## Role-Based Route Protection and 403 Forbidden Issue:

Files Involved: app.controller.ts, roles.guard.ts

- When trying to access the /profile route, I encountered a 403 Forbidden error even though the correct roles were assigned.
-  This was due to the roles not being properly included in the JWT or not being correctly handled in the JwtStrategy.
-   Once I ensured that the roles were properly extracted and passed through the RolesGuard, the issue was resolved, and admins were able to access admin-only routes.

##  Improper Roles Handling in Roles Guard:

Files Involved: roles.guard.ts

- The RolesGuard initially threw errors like roles.includes is not a function.
-  This happened because roles was not always an array.
-  After adding checks to ensure roles was an array, I was able to resolve the issue and properly enforce role-based access control. I also learned to log the roles and user.roles to debug these types of issues effectively.

## JWT Role Handling and Forbidden Resource:

Files Involved: roles.guard.ts, jwt.strategy.ts

- Another issue arose when I consistently received a Forbidden resource error after login.
- The problem was that the roles in the JWT payload were not correctly handled in the RolesGuard or JwtStrategy.
-  I learned to ensure that the roles are properly encoded in the JWT and extracted correctly during validation to allow access to routes based on roles.

## Testing Role Guards and Fixing Access Issues:

Files Involved: app.controller.ts, roles.guard.ts

- After resolving the role-based access issues, I tested the functionality by creating separate routes for users and admins, applying the @Roles() decorator to protect the routes.
-  By using Postman to test login and accessing the protected routes, I confirmed that only admins could access admin-only routes and users could not.

  
  


## License

[MIT](https://choosealicense.com/licenses/mit/)


![Logo](https://docs.nestjs.com/assets/logo-small-gradient.svg)


## Related

Here are some related projects

[Awesome README](https://github.com/matiassingers/awesome-readme)


## Running Tests

To run tests, run the following command

```bash
  npm run test
```
unit tests : 
 ```
 
 npm run test
 ```

 e2e tests : 
```
$ npm run test:e2e
```
test coverage: 
```

 npm run test:cov
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/AtiqBytes/passport-jwt-nestjs.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start:dev
```

