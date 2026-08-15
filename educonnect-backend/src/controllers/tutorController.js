import User from '../models/User.js';

const MILES_TO_METERS = 1609.34;

export async function getTutors(req, res) {
  try {
    const { lat, lng, radiusMiles, subject, mode, maxPrice, minRating, sort, q } = req.query;

    const query = { role: 'tutor' };

    if (q) {
      const regex = new RegExp(q, 'i');
      query.$or = [{ fullName: regex }, { subject: regex }];
    }
    if (subject) query.subject = new RegExp(subject, 'i');
    if (mode) query.$or = [...(query.$or || []), { teachingMode: mode }, { teachingMode: 'Both' }];
    if (maxPrice) query.hourlyFee = { ...(query.hourlyFee || {}), $lte: Number(maxPrice) };
    if (minRating) query.rating = { $gte: Number(minRating) };

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          $maxDistance: (Number(radiusMiles) || 25) * MILES_TO_METERS,
        },
      };
    }

    let tutorQuery = User.find(query).select('-password');

    if (!(lat && lng) || (sort && sort !== 'distance')) {
      if (sort === 'price_asc') tutorQuery = tutorQuery.sort({ hourlyFee: 1 });
      else if (sort === 'price_desc') tutorQuery = tutorQuery.sort({ hourlyFee: -1 });
      else if (sort === 'rating') tutorQuery = tutorQuery.sort({ rating: -1 });
    }

    const tutors = await tutorQuery.limit(100);

    const shaped = tutors.map((t) => {
      const obj = t.toObject();
      let distance = null;
      if (lat && lng && obj.location?.coordinates) {
        distance = haversineMiles(Number(lat), Number(lng), obj.location.coordinates[1], obj.location.coordinates[0]);
      }
      return { ...obj, distance: distance != null ? Number(distance.toFixed(1)) : null };
    });

    res.json(shaped);
  } catch (err) {
    console.error('Get tutors error:', err.message);
    res.status(500).json({ message: 'Failed to fetch tutors' });
  }
}

export async function getTutorById(req, res) {
  try {
    const tutor = await User.findOne({ _id: req.params.id, role: 'tutor' }).select('-password');
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });
    res.json(tutor);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tutor' });
  }
}

export async function updateMyTutorProfile(req, res) {
  try {
    const allowed = [
      'subject', 'qualification', 'experience', 'hourlyFee', 'bio', 'languages',
      'teachingMode', 'expertise', 'avatar',
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (req.body.location?.lat != null && req.body.location?.lng != null) {
      updates.location = {
        type: 'Point',
        coordinates: [Number(req.body.location.lng), Number(req.body.location.lat)],
        address: req.body.location.address || '',
      };
    }
    const tutor = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
    res.json(tutor);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
}

function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
