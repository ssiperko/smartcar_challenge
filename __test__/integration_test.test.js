const express = require("express");

const {get_vehicle_info_by_id} = require('../resolvers/vehicleResolvers');

const request = require("supertest");

const app = express();

app.use('/vehicles/:id', get_vehicle_info_by_id);
describe("Test vehicles endpoint", () => {
   it("sends request to vehicles endpoint and gets valid response", async () => { // name
      const vehicle_data = {
         vin: '123123412412',
         color: 'Metallic Silver',
         doorCount: 4,
         driveTrain: 'v8'
       };
      const {body} = await request(app).get("/vehicles/1234/fuel");
      expect(body).toEqual(vehicle_data);
   });
   it("sends request to vehicles endpoint and throws error", async () => {
      const {body} = await request(app).get("/vehicles/1234s44/fuel");
      expect(body).toEqual({ERROR: "Internal server error"});
   });
});