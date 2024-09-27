import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://query.joystream.org/graphql",
  documents: "graphql/**/*.graphql",
  generates: {
    "./graphql/generated/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
