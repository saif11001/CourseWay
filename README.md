# CourseWay

CourseWay is an educational project that demonstrates how to build a RESTful API for managing courses and users using **Node.js, Express, and MongoDB**.

---

## Features
- User authentication (Register, Login, Logout) with JWT.
- Course management (Add, Update, Delete, View).
- Enroll/Unenroll students in courses.
- Role-based access control (User & Admin).
- Pagination and search functionality.
- File upload support (for users and courses).

---

## Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** JWT, bcrypt  
- **Other Tools:** Multer, dotenv  

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/YourUsername/aCourseWay.git
   cd CourseWay

2. Create a .env file and add the following variables:
   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   
3. Start the server:
   ```bash
   npm start

## API Endpoints (Examples)
#### Auth

   POST /api/auth/register
   POST /api/auth/login

#### Courses
   GET /api/courses
   GET /api/courses/:Id
   POST /api/courses
   PATCH /api/courses/:id
   DELETE /api/courses/:id

## Future Improvements

   Add a web-based Dashboard.
   Integrate Stripe for online payments.
   Add notifications system.



