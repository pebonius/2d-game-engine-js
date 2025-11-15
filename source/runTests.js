import { testTests } from "./unitTesting.test.js";

let testsFailed = 0;

const testsToRun = [{ tests: testTests, name: "test tests" }];

function runTests() {
  let testsRan = 0;
  testsToRun.forEach((testSuite) => {
    console.log(`running ${testSuite.name}`);
    testSuite.tests.forEach((test) => {
      console.log(`\trunning ${test.name}...`);
      test();
      testsRan++;
      console.log(`\t${test.name} completed`);
    });
  });
  console.log(`total tests ran: ${testsRan}`);
  console.log(`tests failed: ${testsFailed}`);
}

runTests();
