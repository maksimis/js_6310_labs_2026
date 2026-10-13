export const calculateBounce = (angleDeg, speed) => {
  const rad = (angleDeg * Math.PI) / 180;
  const vx = Number((speed * Math.cos(rad)).toFixed(2));
  const vy = Number((speed * Math.sin(rad)).toFixed(2));

  let bounceType = 'боковой стенки';
  let nextVx = -vx;
  let nextVy = vy;
  let explanation =
    'При столкновении с вертикальной стеной меняется только горизонтальная проекция скорости (vx = -vx), ' +
    'а угол отражения равен углу падения.';

  if (Math.abs(vy) > Math.abs(vx)) {
    bounceType = 'платформы/верхней границы';
    nextVx = vx;
    nextVy = -vy;
    explanation =
      'При столкновении с платформой или потолком инвертируется вертикальная проекция (vy = -vy). ' +
      'Смещение точки касания от центра платформы задает новый угол вылета.';
  }

  return {
    vx,
    vy,
    bounceType,
    nextVx,
    nextVy,
    explanation,
    summary:
      `Мяч запущен под углом ${angleDeg}° со скоростью ${speed} px/c.\n` +
      `Вектор движения: (vx: ${vx}, vy: ${vy}).\n` +
      `Отскок от: ${bounceType}.\n` +
      `Новый вектор: (vx: ${nextVx}, vy: ${nextVy}).\n\n` +
      `📚 Механика: ${explanation}`
  };
};

export const renderAsciiTrajectory = (angleDeg) => {
  const isUp = angleDeg > 0 && angleDeg < 180;
  const isRight = (angleDeg >= 0 && angleDeg < 90) || angleDeg > 270;

  const inVector = isUp ? (isRight ? '^/' : '\\^') : (isRight ? 'v\\' : '/v');
  const outVector = isUp ? (isRight ? '\\^' : '^/') : (isRight ? '/v' : 'v\\');

  return [
    '+----------------------+',
    '|      Breakout        |',
    '|        Стена         |',
    '|          |           |',
    `|    ${inVector}    |    ${outVector}    |`,
    '|     \\    |    /      |',
    '|      \\   |   /       |',
    '|       \\  |  /        |',
    '|        \\ | /         |',
    '|         \\|/          |',
    '|          *           |',
    `|     (Угол: ${String(angleDeg).padStart(3, ' ')}°)      |`,
    '+----------------------+'
  ].join('\n');
};