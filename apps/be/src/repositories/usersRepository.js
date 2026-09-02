const db = require("../config/db");
exports.findPublicById = async (id) => {
  const rs = await db.query(
    `select id, name, email, role, preferences, avatar_url
     from users
     where id = $1`,
    [id]
  );
  return rs.rows[0] || null;
};

// lấy password để đổi mật khẩu
exports.findWithPasswordById = async (id) => {
  const rs = await db.query(
    `select id, password
     from users
     where id = $1`,
    [id]
  );
  return rs.rows[0] || null;
};

// update name + preferences
exports.updateProfile = async (id, { name, preferences }) => {
  const rs = await db.query(
    `update users
     set name = $1,
         preferences = $2
     where id = $3
     returning id, name, email, role, preferences, avatar_url`,
    [name, preferences, id]
  );
  return rs.rows[0] || null;
};

// update avatar
exports.updateAvatar = async (id, avatarUrl) => {
  const rs = await db.query(
    `update users
     set avatar_url = $1
     where id = $2
     returning id, name, email, role, preferences, avatar_url`,
    [avatarUrl, id]
  );
  return rs.rows[0] || null;
};

exports.getCurrentSession = async (userId) => {
  console.log("Fetching current session information for userId:", userId);
  const rs = await db.query(
    `select ts.id, ts.user_id, t.id as table_id, ts.session_token, t.qr_token, t.table_number
      from table_sessions ts join tables t on ts.table_id = t.id
      where ts.user_id = $1 and ts.status = 'active'`,
    [userId]
  );
  
  return rs.rows[0] || null;
};