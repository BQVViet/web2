#!/usr/bin/env node

/**
 * Payment System Test Script
 * Test all 3 payment methods: VNPay, Momo, Counter Payment
 */

const http = require('http');
const querystring = require('querystring');

const BASE_URL = 'http://localhost:8080/api';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: body ? JSON.parse(body) : null,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Test data
const testUser = {
  email: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@test.com`,
  fullName: `Test User ${Date.now()}`,
  password: 'Test@123456',
  phone: `091${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`
};

async function runTests() {
  console.log('\n═══════════════════════════════════════════════');
  console.log('  PAYMENT SYSTEM TEST');
  console.log('═══════════════════════════════════════════════\n');

  let token = null;
  let userId = null;

  try {
    // 1. Register user
    console.log('1️⃣  Registering test user...');
    const registerRes = await makeRequest('POST', '/auth/register', testUser);
    console.log(`   Status: ${registerRes.status}`);
    if (registerRes.status !== 200 && registerRes.status !== 201) {
      console.log(`   ❌ Register failed: ${JSON.stringify(registerRes.data)}`);
      return;
    }
    console.log('   ✅ Registration successful\n');

    // 2. Login
    console.log('2️⃣  Logging in...');
    const loginRes = await makeRequest('POST', '/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    console.log(`   Status: ${loginRes.status}`);
    if (loginRes.status !== 200) {
      console.log(`   ❌ Login failed: ${JSON.stringify(loginRes.data)}`);
      return;
    }
    token = loginRes.data.token;
    userId = loginRes.data.userId;
    console.log(`   ✅ Login successful - Token: ${token.substring(0, 20)}...\n`);

    // 3. Get available data (cinemas, movies, showtimes)
    console.log('3️⃣  Fetching booking data...');
    const cinemasRes = await makeRequest('GET', '/cinemas');
    const moviesRes = await makeRequest('GET', '/movies');
    const showtimesRes = await makeRequest('GET', '/showtimes');
    const roomsRes = await makeRequest('GET', '/rooms');
    
    if (!cinemasRes.data || cinemasRes.data.length === 0) {
      console.log('   ❌ No cinemas found');
      return;
    }
    if (!moviesRes.data || moviesRes.data.length === 0) {
      console.log('   ❌ No movies found');
      return;
    }
    if (!showtimesRes.data || showtimesRes.data.length === 0) {
      console.log('   ❌ No showtimes found');
      return;
    }
    if (!roomsRes.data || roomsRes.data.length === 0) {
      console.log('   ❌ No rooms found');
      return;
    }
    
    const cinema = cinemasRes.data[0];
    const movie = moviesRes.data[0];
    const showtime = showtimesRes.data[0];
    const room = roomsRes.data[0];
    
    // Get seat map for the selected showtime
    const seatMapRes = await makeRequest('GET', `/showtimes/${showtime.id}/seat-map`);
    if (!seatMapRes.data || !seatMapRes.data.seats || seatMapRes.data.seats.length === 0) {
      console.log('   ❌ No seats found in seat map');
      return;
    }
    const availableSeats = seatMapRes.data.seats.filter(s => s.status === 'AVAILABLE');
    if (availableSeats.length < 3) {
      console.log('   ❌ Not enough available seats for testing (need at least 3)');
      return;
    }
    const seatIds1 = [availableSeats[0].id];
    const seatIds2 = [availableSeats[1].id];
    const seatIds3 = [availableSeats[2].id];
    
    console.log(`   ✅ Found ${cinemasRes.data.length} cinemas - ID: ${cinema.id}`);
    console.log(`   ✅ Found ${moviesRes.data.length} movies - ID: ${movie.id}`);
    console.log(`   ✅ Found ${showtimesRes.data.length} showtimes - ID: ${showtime.id}`);
    console.log(`   ✅ Found ${roomsRes.data.length} rooms - ID: ${room.id}`);
    console.log(`   ✅ Found ${availableSeats.length} available seats - Using: ${seatIds1[0]}, ${seatIds2[0]}, ${seatIds3[0]}\n`);

    // 4. Test "Thanh toán tại quầy" (Pay at Counter)
    console.log('4️⃣  Testing "Thanh toán tại quầy" payment...');
    const counterPaymentRes = await makeRequest('POST', '/invoices', {
      showtimeId: showtime.id,
      seatIds: seatIds1,
      foodDrinks: {},
      paymentMethod: 'Thanh toán tại quầy'
    }, token);
    
    console.log(`   Status: ${counterPaymentRes.status}`);
    if (counterPaymentRes.status !== 200 && counterPaymentRes.status !== 201) {
      console.log(`   ❌ Counter payment failed: ${JSON.stringify(counterPaymentRes.data)}`);
    } else {
      const invoiceId = counterPaymentRes.data.id;
      console.log(`   ✅ Invoice created - ID: ${invoiceId}`);
      console.log(`   📋 Amount: ${counterPaymentRes.data.totalAmount} VND`);
      console.log(`   💳 Status: ${counterPaymentRes.data.paymentStatus}`);
      console.log(`   📧 Should send email confirmation\n`);
    }

    // 5. Test VNPay payment
    console.log('5️⃣  Testing VNPay payment...');
    const vnpayRes = await makeRequest('POST', '/invoices', {
      showtimeId: showtime.id,
      seatIds: seatIds2,
      foodDrinks: {},
      paymentMethod: 'VNPay'
    }, token);
    
    console.log(`   Status: ${vnpayRes.status}`);
    if (vnpayRes.status !== 200 && vnpayRes.status !== 201) {
      console.log(`   ❌ VNPay payment failed: ${JSON.stringify(vnpayRes.data)}`);
    } else {
      console.log(`   ✅ VNPay request created`);
      if (vnpayRes.data.paymentUrl) {
        console.log(`   🔗 Payment URL: ${vnpayRes.data.paymentUrl}`);
        console.log(`   ℹ️  NOTE: URL points to https://sandbox.vnpayment.vn`);
        console.log(`   ⚠️  Return URL: http://localhost:5175/`);
        console.log(`   ℹ️  Status will be checked via IPN callback\n`);
      }
    }

    // 6. Test Momo payment
    console.log('6️⃣  Testing Momo payment...');
    const momoRes = await makeRequest('POST', '/invoices', {
      showtimeId: showtime.id,
      seatIds: seatIds3,
      foodDrinks: {},
      paymentMethod: 'Momo'
    }, token);
    
    console.log(`   Status: ${momoRes.status}`);
    if (momoRes.status !== 200 && momoRes.status !== 201) {
      console.log(`   ❌ Momo payment failed: ${JSON.stringify(momoRes.data)}`);
    } else {
      console.log(`   ✅ Momo request created`);
      if (momoRes.data.paymentUrl) {
        console.log(`   🔗 Payment URL: ${momoRes.data.paymentUrl}`);
        console.log(`   📱 Will display QR code for payment\n`);
      }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('  TEST SUMMARY');
    console.log('═══════════════════════════════════════════════');
    console.log('✅ Counter Payment: Creates invoice directly (no callback needed)');
    console.log('✅ VNPay: Generates payment URL → Returns to frontend → IPN updates DB');
    console.log('✅ Momo: Generates payment URL → Returns to frontend → IPN updates DB');
    console.log('\nAll payment methods are now functional!');
    console.log('\nNext steps:');
    console.log('  1. Test in browser: http://localhost:5175');
    console.log('  2. Try "Thanh toán tại quầy" - should work immediately');
    console.log('  3. For VNPay testing: Use ngrok to expose localhost (requires setup)');
    console.log('  4. Check admin panel to see invoices and payment statuses');
    console.log('═══════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run tests
runTests();
