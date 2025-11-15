import { normalizeRotationDegrees } from "./graphics.js";
import { doesNotThrow, throws, is } from "./unitTesting.js";

function normalizeRotationDegreesValidValuesTest() {
  const validValues = [-120, 0, 1, 90, 3232879243];
  validValues.forEach((value) => {
    doesNotThrow(() => {
      normalizeRotationDegrees(value);
    });
  });
}

function normalizeRotationDegreesInvalidValuesTest() {
  const invalidValues = ["0", "something", undefined, null, { x: 0 }, []];
  invalidValues.forEach((value) => {
    throws(() => {
      normalizeRotationDegrees(value);
    });
  });
}

function normalizeRotationDegreesNormalizesDegrees() {
  is(normalizeRotationDegrees(360), 0);
  is(normalizeRotationDegrees(365), 5);
  is(normalizeRotationDegrees(3605), 5);
  is(normalizeRotationDegrees(-360), 0);
  is(normalizeRotationDegrees(-365), 355);
  is(normalizeRotationDegrees(-3605), 355);
}

export const graphicsTests = [
  normalizeRotationDegreesValidValuesTest,
  normalizeRotationDegreesInvalidValuesTest,
  normalizeRotationDegreesNormalizesDegrees,
];
