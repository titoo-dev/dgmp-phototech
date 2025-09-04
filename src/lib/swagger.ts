import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Phototech API",
        version: "1.0.0",
        description: "API documentation for Phototech project management system",
      },
      servers: [
        {
          url: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
          description: "Development server"
        }
      ],
      tags: [
        {
          name: "Entreprises",
          description: "Company management endpoints"
        },
        {
          name: "Projects",
          description: "Project management endpoints"
        },
        {
          name: "Rapports",
          description: "Report management endpoints"
        },
        {
          name: "Team Leaders",
          description: "Team leader management endpoints"
        },
        {
          name: "Utilisateurs",
          description: "User management endpoints"
        },
        {
          name: "Dashboard",
          description: "Dashboard statistics endpoints"
        }
      ]
    },
  });
  return spec;
};