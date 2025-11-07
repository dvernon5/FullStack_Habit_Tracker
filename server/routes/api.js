// server/routes/api.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

/* -------------------------------------------------
   GET /api/users
   ------------------------------------------------- */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

/* -------------------------------------------------
   POST /api/habits  –  ONLY name + frequency
   ------------------------------------------------- */
router.post('/habits', async (req, res) => {
  const { name, frequency } = req.body;

  // ---- VALIDATION ----
  if (!name?.trim() || !frequency) {
    return res.status(400).json({ message: 'name and frequency are required' });
  }

  try {
    const newUser = new User({
      habits: [{
        name: name.trim(),
        frequency,
        history: [{ date: new Date(), completed: false }],
        streak: 0
      }]
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error('POST /habits error:', err);
    res.status(500).json({ message: 'Failed to create habit', error: err.message });
  }
});

/* -------------------------------------------------
   PUT /api/habits/:userId/:habitId/edit
   ------------------------------------------------- */
router.put('/habits/:userId/:habitId/edit', async (req, res) => {
  const uid = Number(req.params.userId);
  if (isNaN(uid)) return res.status(400).json({ message: 'Invalid userId' });

  const { completed } = req.body;

  try {
    const user = await User.findOne({ userId: uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const habit = user.habits.id(req.params.habitId);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const todayStr = new Date().toISOString().split('T')[0];
    let todayEntry = habit.history.find(
      h => new Date(h.date).toISOString().split('T')[0] === todayStr
    );

    if (!todayEntry) {
      todayEntry = { date: new Date(), completed: false };
      habit.history.unshift(todayEntry);
    }

    todayEntry.completed = completed !== undefined ? completed : !todayEntry.completed;
    habit.streak = calculateStreak(habit.history, habit.frequency);
    habit.updatedAt = new Date();

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to edit habit' });
  }
});

/* -------------------------------------------------
   DELETE /api/habits/:userId/:habitId
   ------------------------------------------------- */
router.delete('/habits/:userId/:habitId', async (req, res) => {
  const uid = Number(req.params.userId);
  if (isNaN(uid)) return res.status(400).json({ message: 'Invalid userId' });

  try {
    const user = await User.findOne({ userId: uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const habit = user.habits.id(req.params.habitId);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    user.habits.pull({ _id: req.params.habitId });
    await user.save();
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete habit' });
  }
});

/* -------------------------------------------------
   Streak calculator
   ------------------------------------------------- */
function calculateStreak(history, frequency) {
  if (!history?.length) return 0;
  const today = new Date(); today.setHours(0,0,0,0);
  const sorted = history.slice().sort((a,b) => new Date(b.date) - new Date(a.date));
  const mostRecent = new Date(sorted[0].date); mostRecent.setHours(0,0,0,0);
  if (mostRecent.getTime() !== today.getTime()) return 0;

  let streak = 0, last = null;
  for (const e of sorted) {
    const cur = new Date(e.date); cur.setHours(0,0,0,0);
    if (last === null) {
      if (e.completed) { streak = 1; last = cur; } else return 0;
    } else {
      let expected;
      if (frequency === 'Daily') { expected = new Date(last); expected.setDate(expected.getDate()-1); }
      else if (frequency === 'Weekly') { expected = new Date(last); expected.setDate(expected.getDate()-7); }
      else if (frequency === 'Monthly') { expected = new Date(last); expected.setMonth(expected.getMonth()-1); expected.setDate(last.getDate()); }

      if (cur.getTime() === expected.getTime() && e.completed) { streak++; last = cur; }
      else break;
    }
  }
  return streak;
}

module.exports = router;