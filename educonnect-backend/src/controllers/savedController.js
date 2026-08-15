import SavedTutor from '../models/SavedTutor.js';

export async function toggleSaved(req, res) {
  try {
    const { tutorId } = req.body;
    const existing = await SavedTutor.findOne({ student: req.user._id, tutor: tutorId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ saved: false });
    }
    await SavedTutor.create({ student: req.user._id, tutor: tutorId });
    res.json({ saved: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update saved tutors' });
  }
}

export async function getSaved(req, res) {
  try {
    const saved = await SavedTutor.find({ student: req.user._id }).populate('tutor', '-password');
    res.json(saved.filter((s) => s.tutor).map((s) => s.tutor));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch saved tutors' });
  }
}
