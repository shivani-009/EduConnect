export function normalizeUser(u) {
  if (!u) return u;
  return {
    id: u._id || u.id,
    name: u.fullName || u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    avatar: u.avatar,
    location: u.location?.address || '',
    token: u.token,
  };
}

export function normalizeTutor(t) {
  if (!t) return t;
  const [lng, lat] = t.location?.coordinates || [];
  return {
    id: t._id || t.id,
    name: t.fullName || t.name,
    subject: t.subject,
    rating: t.rating || 0,
    reviews: t.reviewCount ?? t.reviews ?? 0,
    price: t.hourlyFee ?? t.price ?? 0,
    distance: t.distance ?? null,
    experience: t.experience || 0,
    image: t.avatar || t.image,
    topRated: !!t.topRated,
    verified: !!t.verified,
    online: t.online ?? true,
    mode: t.teachingMode || t.mode || 'Online',
    bio: t.bio || '',
    expertise: t.expertise || [],
    education: t.education || [],
    certifications: t.certifications || [],
    location: {
      lat: lat ?? t.location?.lat ?? 0,
      lng: lng ?? t.location?.lng ?? 0,
      address: t.location?.address || '',
    },
  };
}

export function normalizeBooking(b) {
  if (!b) return b;
  const tutor = typeof b.tutor === 'object' ? b.tutor : null;
  return {
    id: b._id || b.id,
    tutorId: tutor?._id || b.tutor,
    tutorName: tutor?.fullName || b.tutorName,
    tutorImage: tutor?.avatar || b.tutorImage,
    subject: b.subject,
    date: b.date,
    time: b.time,
    notes: b.notes,
    status: b.status,
    createdAt: b.createdAt,
  };
}
