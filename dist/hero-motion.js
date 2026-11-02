export function heroMotion(x = -1000, y = -1000) {
  const offset = (cx, cy) => {
    const dx = x - cx, dy = y - cy;
    const strength = Math.max(0, 1 - Math.hypot(dx, dy) / 330);
    return { x: dx * .08 * strength, y: dy * .08 * strength };
  };
  const scissors = offset(118, 156);
  const clipper = offset(524, 268);
  const sx = 118 + scissors.x, sy = 156 + scissors.y;
  const ex = 524 + clipper.x, ey = 268 + clipper.y;
  return { scissors, clipper, path: `M${sx} ${sy} C${sx + 125} ${sy} ${ex - 175} ${ey + 55} ${ex} ${ey}` };
}
