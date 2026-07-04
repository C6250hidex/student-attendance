-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS student_attendance_db;
USE student_attendance_db;

-- 2. Faculties Table
CREATE TABLE faculties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Departments Table
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    faculty_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
);

-- 4. Users Table (Shared by Admins, Lecturers, and Students)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'lecturer', 'student') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Lecturers Table (Extends Users)
CREATE TABLE lecturers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    staff_id VARCHAR(50) NOT NULL UNIQUE,
    department_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- 6. Students Table (Extends Users)
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    matric_number VARCHAR(50) NOT NULL UNIQUE,
    department_id INT,
    level VARCHAR(10),
    barcode VARCHAR(100) UNIQUE,
    qr_code VARCHAR(100) UNIQUE,
    barcode_image VARCHAR(255),
    qr_code_image VARCHAR(255),
    photo VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- 7. Courses Table
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_title VARCHAR(150) NOT NULL,
    department_id INT,
    lecturer_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(id)
);

-- 8. Attendance Sessions Table (When a lecturer starts a class)
CREATE TABLE attendance_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    lecturer_id INT NOT NULL,
    session_date DATE NOT NULL,
    status ENUM('open', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(id)
);

-- 9. Attendance Records Table
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    student_id INT NOT NULL,
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scan_method ENUM('barcode', 'qrcode') NOT NULL,
    FOREIGN KEY (session_id) REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    -- Prevent duplicate attendance: One student, one session, one entry
    UNIQUE KEY unique_attendance (session_id, student_id)
);




-- Delete the old admin if it exists
DELETE FROM users WHERE email = 'admin@school.com';



INSERT INTO faculties (name) VALUES ('Engineering');
INSERT INTO departments (name, faculty_id) VALUES ('Computer Science', 1);

-- Default Admin (Password: 20042605 - hashed using bcrypt)
USE student_attendance_db;
INSERT INTO users (full_name, email, password, role) 
VALUES ('System Admin', 'chidex6250@gmail.com', '$2a$10$CsRnuKP8l2.vtcJukG3JfODMVt.06.NS/jYviXzTqpHS.3kP7S43i', 'admin');