const { 
    ELECTRIC,
    NON_GAS_ERROR
} = require('../constants');

const { transform_vehicle_data, transform_door_security_data, transform_range_data } = require('../vehicle_data_transformers');

// vehicle info happy path
test('transforms vehicle data correctly', () => {
    const response = {
        'data': {
            'service': 'getVehicleInfo',
            'status': '200',
            'data': {
            'vin': { 'type': 'String', 'value': '123123412412' },
            'color': { 'type': 'String', 'value': 'Metallic Silver' },
            'fourDoorSedan': { 'type': 'Boolean', 'value': 'True' },
            'twoDoorCoupe': { 'type': 'Boolean', 'value': 'False' },
            'driveTrain': { 'type': 'String', 'value': 'v8' }
            }
        }
    };

    const result = {
        "vin": "123123412412",
        "color": "Metallic Silver",
        "doorCount": 4,
        "driveTrain": "v8"
    }
    expect(transform_vehicle_data(response)).toStrictEqual(result);
})

// Door security happy path
test('transforms door security data correctly', () => {
    const data = {
        "doors": { 
          "type": "Array", 
          "values": [ 
            {
              "location": {
                "type": "String",
                "value": "frontLeft"
              },
              "locked": {
                "type": "Boolean",
                "value": "False"
              }
            },
            {
              "location": {
                "type": "String",
                "value": "frontRight"
              },
              "locked": {
                "type": "Boolean",
                "value": "True"
              }
            },
            {
              "location": {
                "type": "String",
                "value": "backLeft"
              },
              "locked": {
                "type": "Boolean",
                "value": "False"
              }
            },
            {
              "location": {
                "type": "String",
                "value": "backRight"
              },
              "locked": {
                "type": "Boolean",
                "value": "True"
              }
            }
          ] 
        }
      };

    const result = [
        {
            "location": "frontLeft",
            "locked": "False"
        },
        {
            "location": "frontRight",
            "locked": "True"
        },
        {
            "location": "backLeft",
            "locked": "False"
        },
        {
            "location": "backRight",
            "locked": "True"
        }
    ];

    expect(transform_door_security_data(data)).toEqual(result);
});

// Vehicle info transformer received malformed response data from GM 
test('should return null for malformed fields', () => {
    const response = {
        'data': {
            'service': 'getVehicleInfo',
            'status': '200',
            'data': {
                'vin': { 'type': 'String', 'data': '123123412412' },
                'colors': { 'type': 'String', 'value': 'Metallic Silver' },
                'fourDoorSedan': { 'type': 'Boolean', 'value': 'False' },
                'twoDoorCoupe': { 'type': 'Boolean', 'value': 'False' },
                'driveTrain': null
            }
        }
    };
    const result = {
        "vin": null,
        "color": null,
        "doorCount": null,
        "driveTrain": null
    }
    expect(transform_vehicle_data(response)).toStrictEqual(result);
});

// vehicle info happy path
test('transforms vehicle data correctly', () => {
    const response = {
        tankLevel: { type: 'Null', value: '100.00' },
        batteryLevel: { type: 'Number', value: 'null' }
      };
    expect(() => {
        transform_range_data(response, ELECTRIC);
    }).toThrow(NON_GAS_ERROR);
})