const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Step Free API",
      version: "1.0.0",
      description: "API for accessible places discovery",
    },

    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        Place: {
          type: "object",
          required: [
            "name",
            "description",
            "type",
            "area",
            "distance",
            "lat",
            "lng",
          ],
          properties: {
            _id: {
              type: "string",
              example: "60d5ec49c1234567890abcd",
            },
            name: {
              type: "string",
              example: "The Terrace Bistro",
            },
            description: {
              type: "string",
              example: "Fine French restaurant",
            },
            type: {
              type: "string",
              enum: [
                "Restaurant",
                "Hospital",
                "Mall",
                "Hotel",
                "Cafe",
                "Bank",
              ],
              example: "Restaurant",
            },
            image: {
              type: "string",
              example: "https://example.com/image.jpg",
            },
            area: {
              type: "string",
              example: "New Cairo",
            },
            distance: {
              type: "number",
              example: 0.8,
            },
            lat: {
              type: "number",
              example: 30.0500,
            },
            lng: {
              type: "number",
              example: 31.2400,
            },
            tags: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "Ramp",
                  "Elevator",
                  "Wide Entrance",
                  "Accessible Bathroom",
                  "Parking",
                  "AC",
                ],
              },
              example: ["Ramp", "Elevator"],
            },
            rating: {
              type: "number",
              minimum: 0,
              maximum: 5,
              example: 4.8,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Pagination: {
          type: "object",
          properties: {
            total: {
              type: "number",
            },
            page: {
              type: "number",
            },
            limit: {
              type: "number",
            },
            pages: {
              type: "number",
            },
          },
        },

        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
            },
            data: {
              oneOf: [
                { $ref: "#/components/schemas/Place" },
                {
                  type: "array",
                  items: { $ref: "#/components/schemas/Place" },
                },
              ],
            },
            pagination: {
              $ref: "#/components/schemas/Pagination",
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;