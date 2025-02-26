# Setting Up a Simple NestJS API

To set up a simple NestJS API, follow these steps:

1. **Install Node.js and npm**: Ensure you have Node.js and npm installed on your machine. You can download them from the official Node.js website.

2. **Install NestJS CLI**: Open your terminal and run the following command to install the NestJS CLI globally:
   ```bash
   npm install -g @nestjs/cli
   ```

3. **Create a New NestJS Project**: Use the NestJS CLI to create a new project. Navigate to the directory where you want to create your project and run:
   ```bash
   nest new project-name
   ```
   Replace `project-name` with your desired project name.

4. **Navigate to the Project Directory**: Once the project is created, navigate to the project directory:
   ```bash
   cd project-name
   ```

5. **Start the Development Server**: Start the NestJS development server to ensure everything is set up correctly:
   ```bash
   npm run start:dev
   ```
   You should see the server running, typically on `localhost:3000`.

6. **Create Your First Endpoint**: Open the `src/app.controller.ts` file and modify the `AppController` to include a simple endpoint. For example:
   ```typescript
   import { Controller, Get } from '@nestjs/common';
   import { AppService } from './app.service';

   @Controller()
   export class AppController {
     constructor(private readonly appService: AppService) {}

     @Get()
     getHello(): string {
       return this.appService.getHello();
     }
   }
   ```
   This creates a GET endpoint at the root path (`/`).

7. **Test the Endpoint**: With the server running, open a web browser and navigate to `localhost:3000`. You should see the response from your endpoint.

That's it! You now have a very simple NestJS API up and running.

## Follow-Up Questions:
- Would you like to add more endpoints to your NestJS API?
- Are you interested in setting up a database connection with your NestJS API?
- Do you need help with deploying your NestJS API to a production environment?

