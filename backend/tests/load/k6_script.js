import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export let options = {
    stages: [
        { duration: '30s', target: 10 }, // Ramp up to 10 users
        { duration: '1m', target: 50 },  // Stay at 50 users
        { duration: '30s', target: 0 },  // Ramp down
    ],
};

const BASE_URL = 'http://localhost:8000/api/v1';

// Headers for JSON
const params = {
    headers: {
        'Content-Type': 'application/json',
    },
};

// Simulation of a Ride Flow
export default function () {
    // 1. Create Passenger User & Login (Mocking login for simplicity or assume token)
    // In real load test, we might pre-generate tokens or use a login endpoint.
    // For this script, let's assume we can register/login.

    // Register Passenger
    const passengerEmail = `passenger_${uuidv4()}@loadtest.com`;
    const passengerPass = "password";

    let res = http.post(`${BASE_URL}/auth/register`, JSON.stringify({
        email: passengerEmail,
        password: passengerPass,
        user_type: "passenger",
        phone: `119${Math.floor(Math.random() * 100000000)}`
    }), params);

    check(res, { 'passenger registered': (r) => r.status === 200 || r.status === 201 });

    // Login Passenger
    let loginRes = http.post(`${BASE_URL}/auth/login/access-token`, {
        username: passengerEmail,
        password: passengerPass
    });

    check(loginRes, { 'passenger logged in': (r) => r.status === 200 });
    const passengerToken = loginRes.json('access_token');
    const passengerHeader = { headers: { 'Authorization': `Bearer ${passengerToken}`, 'Content-Type': 'application/json' } };

    // 2. Request Ride
    const rideReq = {
        origin: {
            address: "Av Paulista, 1000",
            latitude: -23.56,
            longitude: -46.65
        },
        destination: {
            address: "Ibirapuera Park",
            latitude: -23.58,
            longitude: -46.65
        },
        vehicle_category: "standard" // Assuming model structure
    };

    // Wait, API expects flat structure
    const rideReqFlat = {
        origin_address: "Av Paulista, 1000",
        origin_lat: -23.56,
        origin_lon: -46.65,
        destination_address: "Ibirapuera Park",
        destination_lat: -23.58,
        destination_lon: -46.65,
        category: "standard"
    };

    let rideRes = http.post(`${BASE_URL}/rides/request`, JSON.stringify(rideReqFlat), passengerHeader);
    check(rideRes, { 'ride requested': (r) => r.status === 200 });

    if (rideRes.status === 200) {
        const rideId = rideRes.json('id');

        // 3. Driver Acceptance (Mocking a driver)
        // We need a driver token. In load test, maybe we have a pool of drivers?
        // Or we register one on the fly (expensive).
        // Let's register a driver on the fly for correctness.

        const driverEmail = `driver_${uuidv4()}@loadtest.com`;
        let dRes = http.post(`${BASE_URL}/auth/register`, JSON.stringify({
            email: driverEmail,
            password: "password",
            user_type: "driver",
            phone: `119${Math.floor(Math.random() * 100000000)}`
        }), params);

        let dLoginRes = http.post(`${BASE_URL}/auth/login/access-token`, {
            username: driverEmail,
            password: "password"
        });
        const driverToken = dLoginRes.json('access_token');
        const driverHeader = { headers: { 'Authorization': `Bearer ${driverToken}`, 'Content-Type': 'application/json' } };

        // Create Driver Profile
        http.post(`${BASE_URL}/drivers/`, JSON.stringify({
            full_name: "Driver Load",
            cpf: "12345678900",
            phone: "11999999999",
            cnh_number: "1234567890",
            cnh_category: "B",
            cnh_expiry_date: "2030-01-01",
            vehicle: {
                license_plate: "ABC-1234",
                renavam: "123456789",
                brand: "Fiat",
                model: "Uno",
                year: 2020,
                color: "White",
                category: "standard",
                seats: 4,
                crlv_number: "123",
                crlv_expiry_date: "2030-01-01"
            }
        }), driverHeader);

        // Verify Online Status (Update Locations)
        // Loop a few times to simulate movement?

        // Accept Ride
        sleep(1);
        let acceptRes = http.post(`${BASE_URL}/rides/${rideId}/accept`, {}, driverHeader);
        check(acceptRes, { 'ride accepted': (r) => r.status === 200 });

        // Arriving
        sleep(1);
        http.post(`${BASE_URL}/rides/${rideId}/arriving`, {}, driverHeader);

        // Start Ride
        sleep(1);
        http.post(`${BASE_URL}/rides/${rideId}/start`, {}, driverHeader);

        // Finish Ride
        sleep(2);
        let finishRes = http.post(`${BASE_URL}/rides/${rideId}/finish`, {}, driverHeader);
        check(finishRes, { 'ride finished': (r) => r.status === 200 });

        // Confirm Cash Payment (if applicable)
        // But default might be Pix. 
        // If we want to test Cash, we should specify payment_method in request.

    }

    sleep(1);
}
