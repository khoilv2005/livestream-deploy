import { db } from "./db";
export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    return null;
  }
};

// Get user by username (with stream included)
export const getUserByUsername = async (username: string) => {
  try {
    const user = await db.user.findUnique({
      where: { username },
      include: { 
        stream: true,
        _count: {
          select: {
            followers: true
          }
        }
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

// Get user by ID (with stream included)
export const getUserByIds = async (ids: string) => {
  const user = await db.user.findUnique({
    where: { id: ids },
    include: { stream: true },
  });

  return user;
};