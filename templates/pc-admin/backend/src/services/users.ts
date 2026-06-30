import { pool } from "../db/mysql";
import { hashPassword } from "../utils/password";
import getFormatDate from "../utils/date";

export interface UserRow {
  id: number;
  user_code: string;
  login_name: string;
  password_hash: string;
  display_name: string;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  dept_id: number | null;
  post_id: number | null;
  status: number;
  last_login_at: string | null;
  created_by: number | null;
  created_at: string;
  updated_by: number | null;
  updated_at: string;
  deleted: number;
}

export interface RoleSummary {
  id: number;
  roleCode: string;
  roleName: string;
}

export interface UserProfile {
  id: number;
  userCode: string;
  username: string;
  nickname: string;
  phone: string | null;
  email: string | null;
  avatar: string | null;
  deptId: number | null;
  deptName: string | null;
  postId: number | null;
  postName: string | null;
  status: number;
  roles: RoleSummary[];
}

export interface UserListItem {
  id: number;
  userCode: string;
  username: string;
  nickname: string;
  phone: string | null;
  email: string | null;
  status: number;
  createdAt: string;
}

function toProfile(
  row: UserRow & { dept_name?: string | null; post_name?: string | null },
  roles: RoleSummary[] = []
): UserProfile {
  return {
    id: row.id,
    userCode: row.user_code,
    username: row.login_name,
    nickname: row.display_name,
    phone: row.phone,
    email: row.email,
    avatar: row.avatar_url,
    deptId: row.dept_id,
    deptName: row.dept_name ?? null,
    postId: row.post_id,
    postName: row.post_name ?? null,
    status: row.status,
    roles,
  };
}

function toListItem(row: UserRow): UserListItem {
  return {
    id: row.id,
    userCode: row.user_code,
    username: row.login_name,
    nickname: row.display_name,
    phone: row.phone,
    email: row.email,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function findUserByLoginName(
  loginName: string
): Promise<UserRow | null> {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE login_name = ? AND deleted = 0 LIMIT 1`,
    [loginName]
  );
  const resultRows = rows as UserRow[];
  return resultRows[0] || null;
}

export async function getUserById(id: number): Promise<UserRow | null> {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE id = ? AND deleted = 0 LIMIT 1`,
    [id]
  );
  const resultRows = rows as UserRow[];
  return resultRows[0] || null;
}

export async function getUserRoles(userId: number): Promise<RoleSummary[]> {
  const [rows] = await pool.execute(
    `SELECT r.id, r.role_code, r.role_name
     FROM roles r
     INNER JOIN user_roles ur ON ur.role_id = r.id
     WHERE ur.user_id = ? AND ur.deleted = 0 AND r.deleted = 0 AND r.status = 1`,
    [userId]
  );

  return (rows as Array<{ id: number; role_code: string; role_name: string }>).map(
    (row) => ({
      id: row.id,
      roleCode: row.role_code,
      roleName: row.role_name,
    })
  );
}

export async function getUserProfile(
  userId: number
): Promise<UserProfile | null> {
  const [rows] = await pool.execute(
    `SELECT u.*, d.dept_name, p.post_name
     FROM users u
     LEFT JOIN departments d ON d.id = u.dept_id AND d.deleted = 0
     LEFT JOIN posts p ON p.id = u.post_id AND p.deleted = 0
     WHERE u.id = ? AND u.deleted = 0 LIMIT 1`,
    [userId]
  );
  const resultRows = rows as Array<
    UserRow & { dept_name?: string | null; post_name?: string | null }
  >;
  const user = resultRows[0];
  if (!user) return null;

  const roles = await getUserRoles(userId);
  return toProfile(user, roles);
}

export async function updateLastLoginAt(userId: number): Promise<void> {
  await pool.execute(`UPDATE users SET last_login_at = NOW() WHERE id = ?`, [
    userId,
  ]);
}

export async function createUser(
  username: string,
  password: string
): Promise<void> {
  const time = await getFormatDate();
  await pool.execute(
    `INSERT INTO users
       (user_code, login_name, password_hash, display_name, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, 1, ?, ?)`,
    [username, username, hashPassword(password), username, time, time]
  );
}

export async function searchUsers(
  page: number,
  size: number
): Promise<UserListItem[]> {
  const offset = size * (page - 1);
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE deleted = 0 ORDER BY id DESC LIMIT ? OFFSET ?`,
    [size, offset]
  );
  return (rows as UserRow[]).map(toListItem);
}

export async function searchUsersByUsername(
  username: string
): Promise<UserListItem[]> {
  const [rows] = await pool.query(
    `SELECT * FROM users
     WHERE deleted = 0 AND login_name LIKE ?
     ORDER BY id DESC`,
    [`%${username}%`]
  );
  return (rows as UserRow[]).map(toListItem);
}

export async function updateUser(id: number, username: string): Promise<void> {
  await pool.execute(
    `UPDATE users
     SET login_name = ?, display_name = ?, updated_at = NOW()
     WHERE id = ? AND deleted = 0`,
    [username, username, id]
  );
}

export async function deleteUser(id: number): Promise<void> {
  await pool.execute(
    `UPDATE users SET deleted = 1, updated_at = NOW() WHERE id = ?`,
    [id]
  );
}
