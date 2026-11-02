export function heroMotion(x = -1000, y = -1000) {
  const offset = (cx, cy) => {
    const dx = x - cx, dy = y - cy;
    const strength = Math.max(0, 1 - Math.hypot(dx, dy) / 330);
    return { x: dx * .04 * strength, y: dy * .04 * strength };
  };
  const scissors = offset(118, 156);
  const clipper = offset(524, 268);
  return { scissors, clipper };
}
