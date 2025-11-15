export function is(receivedValue, expectedValue) {
  if (receivedValue === expectedValue) {
    console.log(
      `\t\texpected ${expectedValue}, received ${receivedValue} - OK 🟢`
    );
    return true;
  }
  console.log(
    `\t\texpected ${expectedValue}, received ${receivedValue} - NOK ❌`
  );
  testsFailed++;
  return false;
}

export function are(valuesToTest, expectedValue) {
  let result = true;

  valuesToTest.forEach((element) => {
    if (!is(element, expectedValue)) {
      result = false;
    }
  });

  return result;
}

export function areOutputs(valuesToTest, functionToTest, expectedValue) {
  valuesToTest.forEach((element) => {
    const optionalQuote = typeof element === "string" ? '"' : "";

    console.log(
      `\t\texpect ${functionToTest.name}(${optionalQuote}${element}${optionalQuote}) to be ${expectedValue}`
    );
    is(functionToTest(element), expectedValue);
  });
}

export function throws(functionToTest) {
  try {
    functionToTest();
  } catch (error) {
    console.log(`\t\tdid throw error - OK 🟢`);
    return true;
  }
  console.log(`\t\tdid not throw error - NOK ❌`);
  testsFailed++;
  return false;
}

export function doesNotThrow(functionToTest) {
  try {
    functionToTest();
  } catch (error) {
    console.log(`\t\tdid throw error - NOK ❌`);
    testsFailed++;
    return false;
  }
  console.log(`\t\tdid not throw error - OK 🟢`);
  return true;
}
