import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Bagian sakti untuk mematikan aturan yang cerewet
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Izinkan penggunaan 'any'
      "@typescript-eslint/no-unused-vars": "off", // Izinkan variabel yang tidak terpakai
      "@typescript-eslint/no-unsafe-assignment": "off", // Izinkan assignment yang 'liar'
      "@typescript-eslint/no-unsafe-member-access": "off", // Izinkan akses property dari 'any'
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
