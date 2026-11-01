export const services = [
  { id: 'signature-haircut', name: 'Signature Haircut', description: 'Consultation, tailored haircut and a styled finish.', duration: 40, price: 120, image: 'signature-haircut.jpg', alt: 'Barber shaping a client’s hair with scissors' },
  { id: 'skin-fade', name: 'Skin Fade', description: 'A close fade with a smooth transition and precise edges.', duration: 45, price: 140, image: 'skin-fade.jpg', alt: 'Barber blending a close fade with clippers' },
  { id: 'beard-trim', name: 'Beard Trim & Shape', description: 'Length control, balanced shaping and defined contours.', duration: 25, price: 70, image: 'beard-trim.jpg', alt: 'Barber carefully shaping a client’s beard' },
  { id: 'hot-towel-shave', name: 'Hot Towel Shave', description: 'A traditional shave with warm towels and a soothing finish.', duration: 30, price: 90, image: 'hot-towel-shave.jpg', alt: 'Traditional razor shave at a barber studio' },
  { id: 'haircut-beard', name: 'Haircut & Beard', description: 'A tailored haircut paired with beard shaping and styling.', duration: 65, price: 180, image: 'haircut-beard.jpg', alt: 'Hair and beard grooming in a barber’s chair' },
  { id: 'buzz-cut', name: 'Buzz Cut', description: 'An even clipper cut with a clean neckline and edges.', duration: 25, price: 80, image: 'buzz-cut.jpg', alt: 'Barber cutting short hair with professional clippers' },
  { id: 'wash-style', name: 'Wash & Style', description: 'A refreshing wash and styling suited to your haircut.', duration: 20, price: 50, image: 'wash-style.jpg', alt: 'A client’s hair being washed at a salon basin' },
  { id: 'scalp-detox', name: 'Scalp Detox', description: 'A cleansing scalp treatment with a light massage.', duration: 30, price: 100, image: 'scalp-detox.jpg', alt: 'Gentle cleansing and massage of a client’s scalp' }
];
export const barbers = [
  { name: 'Amir', role: 'Senior Barber', description: 'Skin fades, textured crops and precise outlines. A sharp eye for the finishing details.' },
  { name: 'Rami', role: 'Beard Specialist', description: 'Beard shaping, clean contours and hot towel shaving. Considered care, from start to finish.' },
  { name: 'Zayn', role: 'Style Barber', description: 'Classic scissor cuts, longer hairstyles and everyday styling. Good shape that works beyond the chair.' }
];
export const whatsappUrl = 'https://www.whatsapp.com/';
export function todayInDubai(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = type => parts.find(part => part.type === type).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function validateBooking(values, today = todayInDubai()) {
  const errors = {};
  if (!values.name.trim() || values.name.trim().length > 80) errors.name = 'Enter your name (up to 80 characters).';
  const digits = values.phone.replace(/\D/g, '');
  if (!/^[+\d][\d\s().-]*$/.test(values.phone.trim()) || digits.length < 7 || digits.length > 15) errors.phone = 'Enter a phone number with 7–15 digits. You can include + and a country code.';
  if (!services.some(service => service.id === values.service)) errors.service = 'Choose a service.';
  if (!['Any barber', ...barbers.map(barber => barber.name)].includes(values.barber)) errors.barber = 'Choose a barber.';
  if (values.date && (!/^\d{4}-\d{2}-\d{2}$/.test(values.date) || Number.isNaN(Date.parse(values.date)) || new Date(`${values.date}T12:00:00Z`).toISOString().slice(0, 10) !== values.date || values.date < today)) errors.date = 'Choose today or a future date.';
  return errors;
}
