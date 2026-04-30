const db = require("../db");

// GET PROFILE
exports.getProfile = (req, res) => {
  const userId = req.params.userId;

  const sql = "SELECT * FROM profiles WHERE user_id = ? LIMIT 1";

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const profile = result[0] || null;

    // parse JSON safely
    if (profile) {
      profile.talents = profile.talents ? JSON.parse(profile.talents) : [];
      profile.spiritual_gifts = profile.spiritual_gifts ? JSON.parse(profile.spiritual_gifts) : [];
    }

    return res.json(profile);
  });
};

// CREATE OR UPDATE (UPSERT)
exports.saveProfile = (req, res) => {
  const data = req.body;

  if (!data.user_id) {
    return res.status(400).json({ message: "user_id required" });
  }

  const sql = `
    INSERT INTO profiles (
      user_id,
      phone,
      gender,
      date_of_birth,
      address,
      city,
      \`union\`,
      church,
      conference,
      profession,
      membership_status,
      talents,
      spiritual_gifts,
      profile_picture
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      phone = VALUES(phone),
      gender = VALUES(gender),
      date_of_birth = VALUES(date_of_birth),
      address = VALUES(address),
      city = VALUES(city),
      \`union\` = VALUES(\`union\`),
      church = VALUES(church),
      conference = VALUES(conference),
      profession = VALUES(profession),
      membership_status = VALUES(membership_status),
      talents = VALUES(talents),
      spiritual_gifts = VALUES(spiritual_gifts),
      profile_picture = VALUES(profile_picture)
  `;

  const values = [
    data.user_id,
    data.phone || null,
    data.gender || null,
    data.date_of_birth || null,
    data.address || null,
    data.city || null,
    data.union || null,
    data.church || null,
    data.conference || null,
    data.profession || null,
    data.membership_status || "Active",
    JSON.stringify(data.talents || []),
    JSON.stringify(data.spiritual_gifts || []),
    data.profile_picture || null,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("PROFILE SAVE ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    return res.json({
      success: true,
      message: "Profile saved successfully",
    });
  });
};