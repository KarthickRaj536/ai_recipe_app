const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export const LIMITS = {
  free: {
    pantryScans: 10,
    mealRecommendations: 5,
    recipes: 3,
  },
  pro: {
    pantryScans: Infinity,
    mealRecommendations: Infinity,
    recipes: Infinity,
  },
};

export async function checkRateLimit(userId, action) {
  try {
    // Get user from Strapi
    const response = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const user = await response.json();
    const tier = user.subscriptionTier || "free";
    const limits = LIMITS[tier];

    // Check specific action limit
    switch (action) {
      case "pantry_scan":
        if (user.pantryScansUsed >= limits.pantryScans) {
          return {
            allowed: false,
            message: `You've used all ${limits.pantryScans} scans this month. Upgrade to Pro for unlimited scans!`,
            remaining: 0,
          };
        }
        return {
          allowed: true,
          remaining: limits.pantryScans - user.pantryScansUsed,
        };

      case "meal_recommendation":
        if (user.mealRecommendationsUsed >= limits.mealRecommendations) {
          return {
            allowed: false,
            message: `You've used all ${limits.mealRecommendations} recommendations this month. Upgrade to Pro!`,
            remaining: 0,
          };
        }
        return {
          allowed: true,
          remaining: limits.mealRecommendations - user.mealRecommendationsUsed,
        };

      case "recipe_create":
        if (user.recipesCreated >= limits.recipes) {
          return {
            allowed: false,
            message: `You've created ${limits.recipes} recipes this month. Upgrade to Pro for unlimited!`,
            remaining: 0,
          };
        }
        return {
          allowed: true,
          remaining: limits.recipes - user.recipesCreated,
        };

      default:
        return { allowed: true, remaining: null };
    }
  } catch (error) {
    console.error("Rate limit check error:", error);
    return {
      allowed: false,
      message: "Failed to check rate limit",
    };
  }
}

export async function incrementUsage(userId, action) {
  try {
    const fieldMap = {
      pantry_scan: "pantryScansUsed",
      meal_recommendation: "mealRecommendationsUsed",
      recipe_create: "recipesCreated",
    };

    const field = fieldMap[action];
    if (!field) return;

    // Get current value
    const userResponse = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
    });

    const user = await userResponse.json();

    // Increment
    await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        [field]: (user[field] || 0) + 1,
      }),
    });
  } catch (error) {
    console.error("Failed to increment usage:", error);
  }
}
