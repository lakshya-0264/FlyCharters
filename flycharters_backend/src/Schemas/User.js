import { dbpool } from '../Databases/dbconnection.js';
import bcrypt from 'bcryptjs';

class User {
    static async findByEmail(email) {
        try {
            const [rows] = await dbpool.query(
                `SELECT 
                    id, 
                    first_name, 
                    last_name, 
                    email, 
                    password_hash, 
                    phone, 
                    is_email_verified,
                    created_at
                FROM users 
                WHERE email = ? 
                AND is_email_verified = true 
                AND failed_attempts < 5
                LIMIT 1`,
                [email]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async create(userData) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const [result] = await dbpool.query(
                `INSERT INTO users (
                    first_name, 
                    last_name, 
                    email, 
                    password_hash, 
                    phone,
                    is_email_verified,
                    failed_attempts,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, false, 0, CURRENT_TIMESTAMP)`,
                [
                    userData.first_name,
                    userData.last_name,
                    userData.email,
                    hashedPassword,
                    userData.phone
                ]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    static async updateFailedAttempts(userId, failedAttempts) {
        try {
            await dbpool.query(
                'UPDATE users SET failed_attempts = ?, last_failed_at = CURRENT_TIMESTAMP WHERE id = ?',
                [failedAttempts, userId]
            );
        } catch (error) {
            throw error;
        }
    }

    static async resetFailedAttempts(userId) {
        try {
            await dbpool.query(
                'UPDATE users SET failed_attempts = 0, last_failed_at = NULL WHERE id = ?',
                [userId]
            );
        } catch (error) {
            throw error;
        }
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

export default User; 