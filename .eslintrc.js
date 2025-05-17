module.exports = {
  extends: ['eslint-config-expo'],
  rules: {
    // Turn off rules that are causing issues
    "react-hooks/exhaustive-deps": "off", // Disable dependency checking for useEffect
    "import/no-unresolved": "off", // Disable unresolved imports checking
    "@typescript-eslint/no-unused-vars": ["warn", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_", 
      "ignoreRestSiblings": true 
    }]
  },
  settings: {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      },
      "typescript": {
        "project": "./tsconfig.json"
      }
    }
  }
}; 