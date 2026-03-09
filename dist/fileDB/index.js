"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
exports.getTable = getTable;
const schema_1 = require("./schema");
Object.defineProperty(exports, "registerSchema", { enumerable: true, get: function () { return schema_1.registerSchema; } });
const tableFactory_1 = require("./tableFactory");
function getTable(tableName) {
    const schema = (0, schema_1.getSchema)(tableName);
    return (0, tableFactory_1.createTable)(tableName, schema);
}
//# sourceMappingURL=index.js.map