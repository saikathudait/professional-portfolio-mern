const MONTHS = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

export const isCurrentRole = (endDate) =>
  typeof endDate === 'string' && /present|current/i.test(endDate);

export const parseExperienceDate = (value) => {
  if (!value || isCurrentRole(value)) return null;
  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct;
  const sanitized = value.replace(',', '').trim();
  const [monthLabel, yearLabel] = sanitized.split(' ');
  if (!monthLabel || !yearLabel) return null;
  const month = monthLabel.toLowerCase().slice(0, 3);
  if (MONTHS[month] === undefined) return null;
  const year = Number(yearLabel);
  if (Number.isNaN(year)) return null;
  return new Date(year, MONTHS[month], 1);
};

export const getDurationMonths = (startDate, endDate) => {
  const start = parseExperienceDate(startDate);
  const end = isCurrentRole(endDate) ? new Date() : parseExperienceDate(endDate);
  if (!start || !end) return 0;
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  return months > 0 ? months : 0;
};

export const formatDurationFromMonths = (months) => {
  if (months <= 0) return 'Less than 1 mo';
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  const parts = [];
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (remaining) parts.push(`${remaining} mo${remaining > 1 ? 's' : ''}`);
  return parts.join(' ');
};

export const getTotalExperienceLabel = (experiences = []) => {
  if (!experiences.length) return null;
  const totalMonths = experiences.reduce(
    (sum, exp) => sum + getDurationMonths(exp.startDate, exp.endDate),
    0
  );
  return formatDurationFromMonths(totalMonths);
};
