import { normalizeRotationDegrees } from "./graphics.js";
import { doesNotThrow, throws } from "./unitTesting.js";

function normalizeRotationDegreesTest() {
  const invalidValues = ["0", "something", undefined, null, { x: 0 }, []];
  invalidValues.forEach((value) => {
    throws(() => {
      normalizeRotationDegrees(value);
    });
  });
}

export const graphicsTests = [normalizeRotationDegreesTest];
