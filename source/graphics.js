export const defaultFont = "Courier New";

export const drawText = (
  context,
  text,
  fontSize,
  color,
  posX,
  posY,
  font = defaultFont
) => {
  context.font = fontSize + "px " + font;
  context.fillStyle = color;
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillText(text, posX, posY);
};

export function clearContext(context) {
  context.save();
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.restore();
}

export function normalizeRotationDegrees(degrees) {
  let normalizedRotation = degrees % 360;

  if (normalizedRotation < 0) {
    normalizedRotation += 360;
  }

  return normalizedRotation;
}

export function drawRectangle(
  context,
  x,
  y,
  width,
  height,
  rotationDegrees,
  color
) {
  context.save();
  rotateAroundCenter(context, x, y, width, height, rotationDegrees);
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
  context.fill();
  context.restore();
}

export function rotateAroundCenter(
  context,
  x,
  y,
  width,
  height,
  rotationDegrees
) {
  const halfWidth = width * 0.5;
  const halfHeight = height * 0.5;
  context.translate(x + halfWidth, y + halfHeight);
  context.rotate((normalizeRotationDegrees(rotationDegrees) * Math.PI) / 180);
  context.translate(-x - halfWidth, -y - halfHeight);
}

export const drawSpriteFromSheet = (
  context,
  spriteSheet,
  spriteIndex,
  position,
  flippedX = false,
  flippedY = false,
  scaleX = 1,
  scaleY = 1,
  rotateDeg = 0
) => {
  context.save();
  context.fillStyle = "white";
  context.transform(
    flippedX ? -1 : 1,
    0,
    0,
    flippedY ? -1 : 1,
    position.x + (flippedX ? spriteSheet.tileSize : 0),
    position.y + (flippedY ? spriteSheet.tileSize : 0)
  );
  context.scale(scaleX, scaleY);
  rotateAroundCenter(
    context,
    0,
    0,
    spriteSheet.tileSize,
    spriteSheet.tileSize,
    rotateDeg
  );
  context.drawImage(
    spriteSheet.image,
    spriteSheet.tileToCol(spriteIndex) * spriteSheet.tileSize,
    spriteSheet.tileToRow(spriteIndex) * spriteSheet.tileSize,
    spriteSheet.tileSize,
    spriteSheet.tileSize,
    0,
    0,
    spriteSheet.tileSize,
    spriteSheet.tileSize
  );
  context.restore();
};

export function getCanvasCenter(canvas) {
  return { x: canvas.width * 0.5, y: canvas.height * 0.5 };
}

export function distance(pointA, pointB) {
  if (
    !Number.isInteger(pointA.x) ||
    !Number.isInteger(pointA.y) ||
    !Number.isInteger(pointB.x) ||
    !Number.isInteger(pointB.y)
  ) {
    throw new TypeError("x and y for provided values must be integers");
  }

  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}
