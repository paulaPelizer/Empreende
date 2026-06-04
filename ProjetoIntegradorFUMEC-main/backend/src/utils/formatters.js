export function toUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar,
    bio: row.bio,
    phone: row.phone,
    business: row.business,
    city: row.city,
    state: row.state,
  };
}

export function toModule(row) {
  const completedLessons = Number(row.completed_lessons ?? 0);
  const lessons = Number(row.lessons ?? 4);
  const progress = Number(row.progress ?? Math.round((completedLessons / Math.max(lessons, 1)) * 100));
  const isLocked = row.is_locked === true;

  return {
    id: row.id,
    moduleOrder: Number(row.module_order ?? row.id),
    title: row.title,
    description: row.description,
    status: isLocked ? 'locked' : progress >= 100 ? 'completed' : 'in-progress',
    progress,
    lessons,
    completedLessons,
    duration: row.duration || `${Math.round(Number(row.duration_minutes ?? 60) / 60)}h`,
  };
}

export function toModuleContent(row, steps = [], activity = null, activities = {}) {
  return {
    ...toModule(row),
    sector: row.sector,
    subtitle: row.subtitle,
    videoTitle: row.video_title,
    videoUrl: row.video_url,
    pdfTitle: row.pdf_title,
    pdfUrl: row.pdf_url,
    steps,
    activity,
    activities,
  };
}

export function toActivityResponse(row) {
  return {
    id: row.id,
    moduleId: row.module_id,
    moduleOrder: row.module_order,
    moduleTitle: row.module_title,
    stepKey: row.step_key,
    stepLabel: row.step_label,
    formValues: row.form_values ?? {},
    checks: row.checks ?? {},
    submitted: row.submitted,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toDiscussion(row) {
  return {
    id: row.id,
    author: row.author,
    avatar: row.avatar,
    title: row.title,
    category: row.category,
    replies: Number(row.replies ?? 0),
    likes: Number(row.likes ?? 0),
    time: row.time_label ?? 'agora',
    excerpt: row.excerpt,
  };
}

export function toMentor(row) {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    expertise: row.expertise,
    rating: Number(row.rating ?? 0),
    totalSessions: Number(row.total_sessions ?? 0),
    avatar: row.avatar,
    bio: row.bio,
  };
}

export function toSession(row) {
  return {
    id: row.id,
    date: row.session_date,
    time: row.session_time,
    duration: `${row.duration_minutes} min`,
    topic: row.topic,
    type: row.type,
    status: row.status,
    rating: row.rating,
    notes: row.notes,
  };
}
