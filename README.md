# Smartcar API

## About
This package is a REST API built for the Smart car coding challenge.

## Getting Started

To get started with the Smartcar API open up a terminal and clone this repo to your local environment using the following command:

```sh
git clone git@github.com:ssiperko/smartcar_challenge.git
```

Navigate to the smartcar_challenge repo, install dependencies and start the server using these commands:

```sh
cd smartcar_challenge
npm install
npm start
```

Once you have started the server you can start using it by querying 'http://localhost:5001/vehicles/'

## Endpoints

### Vehicle Information
Endpoint: GET /vehicles/:id
URL: http://localhost:5001/vehicles/:id

Sample Query:
http://localhost:5001/vehicles/1234

Sample response:
```
{
    "vin": "123123412412",
    "color": "Metallic Silver",
    "doorCount": 4,
    "driveTrain": "v8"
}
```

### Security
Endpoint: GET /vehicles/:id/doors
URL: http://localhost:5001/vehicles/:id/doors

Sample query:
http://localhost:5001/vehicles/1234/doors

Sample response:
```
[
    {
        "location": "frontRight",
        "locked": "True"
    },
    {
        "location": "backLeft",
        "locked": "False"
    },
    {
        "location": "frontLeft",
        "locked": "True"
    },
    {
        "location": "backRight",
        "locked": "False"
    }
]
```

### Fuel Range
Endpoint: GET /vehicles/:id/fuel
URL: http://localhost:5001/vehicles/:id/fuel

Sample query:
http://localhost:5001/vehicles/1234/fuel

Sample response:
```
{
    "percent": "92.17"
}
```

### Battery Range
Endpoint: GET /vehicles/:id/battery
URL: http://localhost:5001/vehicles/:id/battery

Sample query:
http://localhost:5001/vehicles/1235/battery

Sample response:
```
{
    "percent": "21.04"
}
```

### Start and Stop Engine
Endpoint: GET /vehicles/:id/engine
http://localhost:5001/vehicles/:id/engine

Sample query:
http://localhost:5001/vehicles/1235/engine

POST body:
```
{
  "action": "START"
}
```

Sample response:
```
ERROR
```

## Errors
Sometimes things go wrong. When that happens it is helpful to know what to do. Don't worry, we've got you covered. Here is a guide to error mesages you might receive from the API and what to do in each case.

### Resource not found
```
{
    "ERROR": "Resource not found. Please, check your path and try again."
}
```
When you see this message it means your query URI was malformed in some way. Usually, this is because you forgot to pass the id as a parameter, added and extra '/' somewhere or forgot a subdirectory somewhere. You should double check the URI you are using and make sure you are passing in a valid id where it is required.

### Invalid ID
```
{
    "ERROR": "ID is invalid"
}
```






## Testing
To test this package, simply navigate to the root directory in you terminal and enter:
```
npm test
```

## Contributors
| Name | Github |
| ------ | ------ |
| Steven Siperko | https://github.com/ssiperko |


## License

ISC







