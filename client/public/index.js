// client/public/index.js
async function fetchHabits() {
  try {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error(await res.text());
    const users = await res.json();

    const habits = users.flatMap(u =>
      u.habits.map(h => ({ ...h, userId: u.userId }))
    );

    const ul = document.getElementById('habits');
    ul.innerHTML = '';

    habits.forEach(h => {
      const li = document.createElement('li');
      li.className = 'mb-2 flex items-center justify-between';
      li.innerHTML = `
        <span>${h.name} <em class="text-gray-600">(Frequency: ${h.frequency}, Streak: ${h.streak})</em></span>
        <div>
          <button class="edit-btn ml-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                  data-user-id="${h.userId}" data-habit-id="${h._id}">Edit</button>
          <button class="delete-btn ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  data-user-id="${h.userId}" data-habit-id="${h._id}">Delete</button>
        </div>
      `;
      ul.appendChild(li);
    });

    document.querySelectorAll('.edit-btn').forEach(b =>
      b.addEventListener('click', () => editHabit(b.dataset.userId, b.dataset.habitId))
    );
    document.querySelectorAll('.delete-btn').forEach(b =>
      b.addEventListener('click', () => deleteHabit(b.dataset.userId, b.dataset.habitId))
    );
  } catch (err) {
    alert('Failed to load habits: ' + err.message);
  }
}

/* -------------------------------------------------
   ADD HABIT
   ------------------------------------------------- */
document.getElementById('habitForm').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const frequency = document.getElementById('frequency').value;

  if (!name) return alert('Name is required');

  try {
    const res = await fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, frequency })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Add failed');

    document.getElementById('name').value = '';
    fetchHabits();
  } catch (err) {
    alert('Failed to add habit: ' + err.message);
  }
});

/* -------------------------------------------------
   EDIT
   ------------------------------------------------- */
async function editHabit(userId, habitId) {
  try {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error(await res.text());
    const users = await res.json();

    const habit = users
      .find(u => u.userId === Number(userId))
      ?.habits.find(h => h._id === habitId);
    if (!habit) throw new Error('Habit not found');

    const todayStr = new Date().toISOString().split('T')[0];
    const todayEntry = habit.history.find(
      h => new Date(h.date).toISOString().split('T')[0] === todayStr
    );
    const newCompleted = todayEntry ? !todayEntry.completed : true;

    const putRes = await fetch(`/api/habits/${userId}/${habitId}/edit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: newCompleted })
    });
    const putData = await putRes.json();
    if (!putRes.ok) throw new Error(putData.message || 'Edit failed');

    fetchHabits();
  } catch (err) {
    alert('Failed to edit habit: ' + err.message);
  }
}

/* -------------------------------------------------
   DELETE
   ------------------------------------------------- */
async function deleteHabit(userId, habitId) {
  try {
    const res = await fetch(`/api/habits/${userId}/${habitId}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Delete failed');
    fetchHabits();
  } catch (err) {
    alert('Failed to delete habit: ' + err.message);
  }
}

/* -------------------------------------------------
   INITIAL LOAD
   ------------------------------------------------- */
fetchHabits();