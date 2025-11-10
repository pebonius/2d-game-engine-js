export function clearContext(context) {
  context.reset();
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = "black";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
}

export function drawRectangle(context, x, y, width, height, rotationDegrees, color) {
  context.save();
  rotateAroundCenter(context, x, y, width, height, rotationDegrees);
  context.rect(x, y, width, height);
  context.fillStyle = color;
  context.fill();
  context.restore();
}

export function rotateAroundCenter(context, x, y, width, height, rotationDegrees) {
  const halfWidth = width * 0.5;
  const halfHeight = height * 0.5;
  context.translate(x + halfWidth, y + halfHeight);
  context.rotate((rotationDegrees * Math.PI) / 180);
  context.translate(-x - halfWidth, -y - halfHeight);
}

export function getCanvasCenter(canvas) {
  return { x: canvas.width * 0.5, y: canvas.height * 0.5 };
}
