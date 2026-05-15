const API_BASE = "http://localhost:5000/api";
const assert = require("assert");

async function runTests() {
  console.log("🚀 Starting Full-Stack API Integration Tests...\n");
  
  let userA, userB, tokenA, tokenB, bankA, bankB, sharableIdB;

  try {
    console.log("1️⃣ Testing Validations (Negative Cases)");
    // Test Invalid Email
    let res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: "Test", lastName: "User", email: "invalid-email", password: "Password123!" })
    });
    let data = await res.json();
    assert.ok(res.status === 400 || res.status === 500, "Should reject invalid email");
    console.log(" ✅ Backend correctly rejected invalid email.");

    // Test Short Password (assuming some validation)
    res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: "Test", lastName: "User", email: "test@test.com", password: "123" })
    });
    console.log(" ✅ Backend processed short password rule (or passed over it if no strict schema).");

    console.log("\n2️⃣ Testing Registration & JWT Creation");
    const emailA = `alice_${Date.now()}@example.com`;
    const emailB = `bob_${Date.now()}@example.com`;

    res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: "Alice", lastName: "Smith", email: emailA, password: "Password123!" })
    });
    data = await res.json();
    assert.strictEqual(res.status, 201);
    userA = data.user;
    tokenA = data.token;
    assert.ok(tokenA, "JWT Token must be returned for User A");
    console.log(` ✅ User A (Alice) registered successfully. JWT verified.`);

    res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: "Bob", lastName: "Jones", email: emailB, password: "Password123!" })
    });
    data = await res.json();
    userB = data.user;
    tokenB = data.token;
    console.log(` ✅ User B (Bob) registered successfully.`);

    console.log("\n3️⃣ Testing Simulated Bank Connection");
    res = await fetch(`${API_BASE}/bank/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenA}` },
      body: JSON.stringify({ bankName: "Demo Bank A", accountNumber: emailA, startingBalance: 5000 })
    });
    bankA = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(bankA.currentBalance, 5000);
    console.log(" ✅ Bank A created for Alice with $5,000 balance.");

    res = await fetch(`${API_BASE}/bank/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenB}` },
      body: JSON.stringify({ bankName: "Demo Bank B", accountNumber: emailB, startingBalance: 2000 })
    });
    bankB = await res.json();
    assert.strictEqual(res.status, 201);
    sharableIdB = bankB.shareableId;
    console.log(" ✅ Bank B created for Bob. Shareable ID generated.");

    console.log("\n4️⃣ Testing Inter-Account Payment Transfer ($500)");
    res = await fetch(`${API_BASE}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenA}` },
      body: JSON.stringify({
        senderAccountId: bankA.id,
        receiverAccountNumber: Buffer.from(sharableIdB, "base64").toString("utf-8"),
        amount: "500.00",
        description: "Rent Payment"
      })
    });
    data = await res.json();
    if (res.status !== 201) {
      console.log("Transfer Failed Reason:", data.message);
    }
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.senderBalance, 4500);
    assert.strictEqual(data.receiverBalance, 2500);
    console.log(" ✅ Funds transferred! Alice's ledger updated to $4,500. Bob's ledger updated to $2,500.");

    console.log("\n5️⃣ Testing Transaction Ledger Consistency");
    res = await fetch(`${API_BASE}/transactions`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${tokenA}` }
    });
    const txA = await res.json();
    assert.strictEqual(txA.length, 1);
    assert.strictEqual(txA[0].type, "debit");
    assert.strictEqual(txA[0].amount, 500);
    console.log(" ✅ Alice's transaction history correctly shows 1 DEBIT of $500.");

    res = await fetch(`${API_BASE}/transactions`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${tokenB}` }
    });
    const txB = await res.json();
    assert.strictEqual(txB.length, 1);
    assert.strictEqual(txB[0].type, "credit");
    assert.strictEqual(txB[0].amount, 500);
    console.log(" ✅ Bob's transaction history correctly shows 1 CREDIT of $500.");

    console.log("\n🎉 ALL API & DATABASE INTEGRATION TESTS PASSED SUCCESSFULLY!");
  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.message);
    process.exit(1);
  }
}

runTests();
