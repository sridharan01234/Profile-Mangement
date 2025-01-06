import { PrismaClient } from "@prisma/client";

// Create Prisma client with error handling
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || 
  new PrismaClient({
    log: ['error'],
    errorFormat: 'pretty',
  }).$extends({
    query: {
      async $allOperations({ operation, args, query }) {
        try {
          return await query(args);
        } catch (error) {
          console.error(`Database error in ${operation}:`, error);
          throw error;
        }
      },
    },
  });

// Set global prisma instance in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Handle process termination
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
