import { PropertySchema, RecordItem } from '../types';

/**
 * Simple Tokenizer & Evaluator for Notion-style formulas
 * Supports:
 * - prop("Property Name")
 * - +, -, *, /, %, ==, !=, >, <, >=, <=
 * - if(cond, thenVal, elseVal)
 * - upper(str), lower(str), round(num, decimals?), length(str), concat(str1, str2)
 */

export function evaluateFormula(
  expression: string,
  record: RecordItem,
  properties: PropertySchema[]
): any {
  if (!expression || !expression.trim()) return '';

  try {
    // 1. Create a dictionary of property names & IDs to their raw values
    const propValuesByName: Record<string, any> = {};
    const propValuesById: Record<string, any> = {};

    properties.forEach((prop) => {
      const val = record.values[prop.id];
      propValuesByName[prop.name.toLowerCase().trim()] = val;
      propValuesById[prop.id] = val;
    });

    // Helper to resolve prop("Property Name")
    const getPropVal = (propNameOrId: string): any => {
      const cleanKey = propNameOrId.trim().toLowerCase();
      if (propValuesById[propNameOrId] !== undefined) return propValuesById[propNameOrId];
      if (propValuesByName[cleanKey] !== undefined) return propValuesByName[cleanKey];
      return null;
    };

    // Replace prop("...") or prop('...') calls with value literal JSON strings
    let expr = expression.replace(/prop\s*\(\s*(['"])(.*?)\1\s*\)/gi, (_, __, propName) => {
      const val = getPropVal(propName);
      if (val === null || val === undefined) return '0';
      if (typeof val === 'number') return val.toString();
      if (typeof val === 'boolean') return val.toString();
      return JSON.stringify(String(val));
    });

    // Custom helper functions mapping
    const upper = (str: any) => String(str || '').toUpperCase();
    const lower = (str: any) => String(str || '').toLowerCase();
    const round = (num: any, decimals = 0) => {
      const n = Number(num) || 0;
      const factor = Math.pow(10, decimals);
      return Math.round(n * factor) / factor;
    };
    const length = (str: any) => String(str || '').length;
    const concat = (...args: any[]) => args.map(a => String(a || '')).join('');
    const ifFn = (cond: any, trueVal: any, falseVal: any) => (Boolean(cond) && cond !== 'false' ? trueVal : falseVal);

    // Build context object
    const context = {
      upper,
      lower,
      round,
      length,
      concat,
      if: ifFn,
    };

    // Safely evaluate simple arithmetic and function expressions
    // Replace 'if(' with 'context.if('
    expr = expr.replace(/\bif\s*\(/g, 'context.if(');
    expr = expr.replace(/\bupper\s*\(/g, 'context.upper(');
    expr = expr.replace(/\blower\s*\(/g, 'context.lower(');
    expr = expr.replace(/\bround\s*\(/g, 'context.round(');
    expr = expr.replace(/\blength\s*\(/g, 'context.length(');
    expr = expr.replace(/\bconcat\s*\(/g, 'context.concat(');

    // Evaluate in safe scope
    const resultFunc = new Function('context', `with(context) { return ${expr}; }`);
    const result = resultFunc(context);

    if (result === undefined || Number.isNaN(result)) return '';
    return result;
  } catch (err) {
    return '#ERRO!';
  }
}
