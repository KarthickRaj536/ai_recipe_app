const STRAPI_FIELDS = {
// User (users-permissions)
user: {
// Built-in fields
username: "string",
email: "email",
provider: "string",
password: "password",
resetPasswordToken: "string",
confirmationToken: "string",
confirmed: "boolean",
blocked: "boolean",
role: "relation",

    // Custom fields
    clerkId: "string",
    firstName: "string",
    lastName: "string",
    imageUrl: "string",
    subscriptionTier: "enumeration", // ["free", "pro"]
    pantryScansUsed: "number",
    mealRecommendationsUsed: "number",
    recipesCreated: "number",

    // Relations
    pantry_items: "relation (oneToMany)",
    recipes: "relation (oneToMany)",
    saved_recipes: "relation (oneToMany)"

},

// Recipe
recipe: {
title: "string",
description: "richtext",
cuisine: "enumeration",
category: "enumeration",
ingredients: "json",
instructions: "json",
imageUrl: "string",
isPublic: "boolean",

    // Relations
    author: "relation (manyToOne)",
    saved_recipes: "relation (oneToMany)"

},

// Pantry Item
pantryItem: {
name: "string",
quantity: "string",
imageUrl: "string",

    // Relations
    owner: "relation (manyToOne)"

},

// Saved Recipe
savedRecipe: {
savedAt: "datetime",

    // Relations
    user: "relation (manyToOne)",
    recipe: "relation (manyToOne)"

}
};

export default STRAPI_FIELDS;
