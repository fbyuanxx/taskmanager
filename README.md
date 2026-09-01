# Learning Resource Library

A MERN-stack prototype for managing learning resource links, user profiles, and administrator-controlled user accounts. The project was developed for **IFN636 Software Life Cycle Management** and demonstrates requirements analysis, UI/UX design, role-based access control, iterative development, and Git-based version control.

## Project links

- [GitHub repository](https://github.com/fbyuanxx/taskmanager)
- **Deployed application:** add the EC2 public URL here before the marking window
- [Jira project board](https://connect-team-pxwuo5u1.atlassian.net/jira/software/projects/LEAR/boards/5?filter=&groupBy=none&atlOrigin=eyJpIjoiNWY3NTI1YmE1NTcyNDlmOTkyMThhMDJkY2U3YzE4N2QiLCJwIjoiaiJ9)
- [Figma prototype](https://www.figma.com/design/6k4rVGw8JobgZigftmgGuL/Learning-Resource-Library?node-id=0-1&t=s4lw4VjWOvb9hFiE-1)
- [System design diagrams (Draw.io)](https://drive.google.com/file/d/1UGM5V0b2Bh4IIT6fpy1ztuVGV3TbA6HN/view?usp=sharing)

## Project purpose

Students and self-learners often discover useful learning materials across many websites and platforms. This project provides a central library where users can organise links to those resources, while administrators manage access to the system.

## Current features

### Authentication and profiles

- Register with required-field, email-format, and password-confirmation validation
- Log in with JWT authentication
- Keep the authenticated session after a browser refresh using `localStorage`
- Log out and clear the locally stored session
- View and update name, email, university, and address
- Prevent disabled users from logging in or accessing protected API routes

### Resource Link Management

- Save a learning resource with a title, description, category, tags, and HTTP(S) URL
- View resource links belonging to the authenticated user
- Open saved resources in a new browser tab
- Edit and delete resource links
- Persist resource metadata in MongoDB

### Administrator user management

- View registered users and their profile details
- Enable or disable user accounts
- Prevent an administrator from disabling their own account
- Protect administrator endpoints with role-based middleware

## Planned scope

The project roadmap includes:

- Persistent file upload and storage
- Search and filtering by keyword, category, and tag
- Resource viewing and downloading
- Sharing requests with administrator approval or rejection
- EC2 deployment and end-to-end workflow verification

AI recommendations, summarisation, automatic tagging, analytics, collaborative editing, and in-browser resource editing are outside the current prototype scope.

## Technology stack

- **Frontend:** React 18, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens and bcrypt
- **Development tools:** Nodemon, Concurrently, Git, GitHub, Jira, Figma, and Draw.io

## Project structure

```text
taskmanagerv1/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Authentication, resource, and admin logic
│   ├── middleware/      # JWT and administrator authorization
│   ├── models/          # User and ResourceLink schemas
│   ├── routes/          # REST API routes
│   └── server.js        # Express application entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Navigation and resource-link forms
│       ├── context/     # Authentication state
│       └── pages/       # Login, register, profile, resources, admin
├── package.json         # Root development scripts
└── README.md
```

## Prerequisites

Install or prepare:

- [Node.js](https://nodejs.org/en) 20 LTS and npm
- [MongoDB Atlas](https://www.mongodb.com/atlas) or a local MongoDB instance
- [Git](https://git-scm.com/)

## Local setup

1. Clone the repository:

   ```bash
   git clone https://github.com/fbyuanxx/taskmanager.git
   cd taskmanager
   ```

2. Install the root, backend, and frontend dependencies:

   ```bash
   npm run install-all
   ```

3. Create `backend/.env` and add your own values:

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/learning-resource-library
   JWT_SECRET=replace_with_a_long_random_secret
   PORT=5001
   ```

   For MongoDB Atlas, replace `MONGO_URI` with the connection string supplied by Atlas. Do not commit this file or expose its credentials.

4. Start the frontend and backend together:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000/register](http://localhost:3000/register) in a browser. The React development server proxies `/api` to `http://localhost:5001`; production uses one Nginx origin for both the frontend and `/api`.

## Available scripts

Run these commands from the project root:

| Command | Purpose |
| --- | --- |
| `npm run install-all` | Install dependencies for the root, backend, and frontend packages |
| `npm run dev` | Run the backend with Nodemon and start the React development server |
| `npm start` | Run the backend with Node and start the React development server |

Additional commands:

```bash
npm run build --prefix frontend
npm test --prefix frontend
npm test --prefix backend
```

## API overview

All resource, profile, and administrator requests require a bearer token unless noted otherwise.

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a user | Public |
| `POST` | `/api/auth/login` | Log in | Public |
| `GET` | `/api/auth/profile` | Get the current profile | Authenticated |
| `PUT` | `/api/auth/profile` | Update the current profile | Authenticated |
| `GET` | `/api/resources` | List the current user's resource links | Authenticated |
| `POST` | `/api/resources` | Create a resource link | Authenticated |
| `PUT` | `/api/resources/:id` | Update a resource link | Authenticated |
| `DELETE` | `/api/resources/:id` | Delete a resource link | Authenticated |
| `GET` | `/api/admin/users` | List registered users | Administrator |
| `PATCH` | `/api/admin/users/:id/status` | Enable or disable a user | Administrator |
| `GET` | `/api/health` | Check that the API process is responding | Public |

Newly registered users have `isAdmin: false` by default. For local administrator testing, update the intended test account's `isAdmin` field to `true` directly in your development MongoDB database, then log in again so the returned session data reflects the role.

## Demonstrated end-to-end workflow

The marking workflow is:

1. Register a user account.
2. Log in with the new account.
3. Save a learning resource with a title, description, category, tags, and URL.
4. Refresh the resource list to demonstrate database persistence.
5. Open the resource link, edit its metadata, and then delete it.
6. Log out and verify that protected API operations require authentication.

This is the complete coherent workflow implemented for the sample application. Binary file upload remains outside the current scope; the application manages resource links and their metadata.

## EC2 manual deployment

The production layout is `Nginx -> React static build` and `Nginx /api -> Express on 127.0.0.1:5001 -> MongoDB Atlas`. Follow [GIT_AND_EC2_DEPLOYMENT_GUIDE_CN.md](./GIT_AND_EC2_DEPLOYMENT_GUIDE_CN.md) for the complete manual procedure.

Before deployment:

1. Launch an Ubuntu EC2 instance in the required public subnet and attach only the course-approved instance profile. Install Node.js 20 LTS rather than an experimental/current Node.js release.
2. Restrict SSH port 22 to the administrator's IP. Allow public inbound traffic only on ports 80 and 443; do not expose ports 5001 or 27017.
3. Clone the repository and install backend and frontend dependencies.
4. Copy `backend/.env.example` to `backend/.env`, enter production values directly on EC2, and run `chmod 600 backend/.env`.
5. Run `npm run build --prefix frontend`, manage the Express process with PM2, and configure Nginx to serve `frontend/build` and proxy `/api` to `127.0.0.1:5001`.
6. Verify `/api/health`, registration, login, resource-link create/read/update/delete, refresh persistence, and logout through the public URL.

The deployment is manual; CI/CD is not required. Keep the EC2 instance and public URL available throughout the marking window.

## Notes

- The application is an educational prototype and is not production-ready.
- The backend uses port `5001` by default. Nginx is the only public entry point in production.
- Keep `.env`, MongoDB credentials, and JWT secrets out of source control.
- Never commit EC2 private keys, AWS credentials, generated frontend builds, or production database connection strings.

## Author

**Boyuan Fu** — IFN636 Software Life Cycle Management
