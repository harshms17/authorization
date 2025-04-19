# 🌐 Role-Based User Management Web App

A full-stack web application that enables seamless user registration, region-based user management by admins, and global oversight by super admins. This platform ensures secure onboarding, hierarchical control, and modular access—perfect for organizations needing a controlled user flow and approval pipeline.

---

## 🚀 Features

- 🔐 **User Registration & Login**: Secure signup/login using JWT authentication.
- 🧐 **Approval-Based Access**: New users are kept in a "pending" state until approved.
- 🛂 **Admin Role**: Admins can view and manage users in their assigned region.
- 🧠 **Super Admin Role**: Has full access to monitor and manage all users, regions, and admins.
- 📍 **Region-Based Segmentation**: Each user and admin is associated with a specific region.
- ✨ **Dynamic Role Elevation**: Approved users can be promoted to admins by a super admin.
- 🛡️ **Role-Based Authorization Middleware**: Ensures only permitted users can access protected resources.
- 📊 **User Status Management**: Admins and super admins can update user statuses (e.g., approved, suspended).
- ⚙️ **Robust API Design**: RESTful APIs built with Next.js for scalable backend logic.
- 💬 **Real-time Feedback**: Clean UI with loading indicators and error handling.
- 🧪 **Type-safe APIs with Zod & TypeScript**

---

## 🧑‍💻 Tech Stack

| Layer          | Tech Used                                |
|----------------|--------------------------------------------|
| Frontend       | React, Tailwind CSS, TypeScript            |
| Backend        | Next.js App Router, API Routes             |
| Database       | MongoDB (with Mongoose ODM)                |
| Authentication | JWT, HttpOnly Cookies                      |
| Validation     | Zod                                        |
| Hosting        | Vercel (Frontend & API) + MongoDB Atlas    |

---

## 😺 Roles Overview

### 👤 User
- Registers and waits for approval.
- Views personal dashboard once approved.

### 🧑‍💼 Admin
- Assigned a region.
- Views and manages users in their region.
- Updates user statuses within their region.

### 👑 Super Admin
- Full access to all data across all regions.
- Promotes users to admins.
- Manages both users and admins.


