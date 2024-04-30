module.exports = {
  extensions: ["ts"],
  spec: ["**/*.spec.*"],
  "node-option": [
    "experimental-specifier-resolution=node",
    "loader=ts-node/esm"
  ]
}