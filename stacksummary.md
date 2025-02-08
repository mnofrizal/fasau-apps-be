# FASAU Project Backend Stack Summary

## Tech Stack

### Core Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time**: Socket.IO
- **API Style**: REST

### Development Tools

- **Package Manager**: npm
- **Development Server**: nodemon
- **Environment Variables**: dotenv
- **CORS**: cors middleware

## Architecture

### Project Structure

```
src/
├── app.js              # Application entry point
├── controllers/        # Request handlers
├── routes/            # API route definitions
├── services/          # Business logic
└── utils/             # Utility functions
```

### Database Models

1. **User**

   - Basic user information (email, name)
   - Timestamp tracking

2. **Task**
   - Categories: MEMO, TASK, LAPORAN
   - Status: COMPLETED, CANCEL, INPROGRESS
   - Urgent flag support
   - Description and timestamps
3. **Acara (Event)**
   - Event details (title, dateTime, location)
   - Status: UPCOMING, DONE, CANCEL
   - Category and description support
4. **TaskReport**
   - Report categories: CM, PM
   - Evidence attachment support
   - Reporter information
   - Description and timestamps

## API Endpoints

### Users (/api/v1/users)

- GET / - List all users
- GET /:id - Get user by ID
- POST / - Create user
- PUT /:id - Update user
- DELETE /:id - Delete user

### Tasks (/api/v1/tasks)

- GET / - List all tasks
- GET /:id - Get task by ID
- POST / - Create task
- PUT /:id - Update task
- DELETE /:id - Delete task
- GET /status/:status - Filter tasks by status
- GET /category/:category - Filter tasks by category

### Events (/api/v1/acara)

- GET / - List all events
- GET /:id - Get event by ID
- POST / - Create event
- PUT /:id - Update event
- DELETE /:id - Delete event
- GET /status/:status - Filter events by status
- GET /upcoming/week - Get upcoming week's events

### Reports (/api/v1/report)

- GET / - List all reports
- GET /:id - Get report by ID
- POST / - Create report
- PUT /:id - Update report
- DELETE /:id - Delete report
- GET /category/:category - Filter reports by category
- GET /pelapor/:pelapor - Filter reports by reporter
- GET /search?query= - Search reports
- GET /filter/today - Get today's reports

## Real-time Features

- Socket.IO integration for live updates
- Real-time notifications on task updates
- Event-driven architecture for data synchronization

## Development Scripts

```bash
# Start production server
npm start

# Start development server with hot reload
npm run dev

# Prisma Commands
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:studio     # Open Prisma Studio
npm run prisma:seed       # Seed database

# Database Reset
npm run db:reset          # Reset database with fresh migrations
```

## Error Handling

- Global error middleware
- Standardized error responses
- 404 route handling
- Graceful shutdown support

## Security

- CORS protection
- Environment variable configuration
- Input validation through Prisma schema
