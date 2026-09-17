import { Database, FilterGroup, FilterOperator, FilterRule, PropertySchema, RecordItem, SortRule } from '../types';
import { evaluateFormula } from './formulaEngine';
import { calculateRollupValue } from './rollupEngine';

/**
 * Resolves the computed or raw display value of a property for a record
 */
export function getPropertyCalculatedValue(
  record: RecordItem,
  property: PropertySchema,
  properties: PropertySchema[],
  allDatabases: Database[],
  allRecords: RecordItem[]
): any {
  if (!property) return null;

  if (property.type === 'formula') {
    if (!property.formulaConfig?.expression) return '';
    return evaluateFormula(property.formulaConfig.expression, record, properties);
  }

  if (property.type === 'rollup') {
    if (!property.rollupConfig) return '';
    const relationProp = properties.find((p) => p.id === property.rollupConfig?.relationPropertyId);
    const targetDbId = relationProp?.relationConfig?.targetDatabaseId;
    const targetDb = allDatabases.find((d) => d.id === targetDbId);
    const targetRecords = allRecords.filter((r) => r.databaseId === targetDbId);
    return calculateRollupValue(
      record,
      property.rollupConfig,
      targetRecords,
      targetDb?.properties || []
    );
  }

  const rawVal = record.values[property.id];
  return rawVal !== undefined ? rawVal : null;
}

/**
 * Checks if a value is considered empty
 */
function isEmptyValue(val: any): boolean {
  if (val === null || val === undefined || val === '') return true;
  if (Array.isArray(val) && val.length === 0) return true;
  return false;
}

/**
 * Evaluates a single filter rule against a property value
 */
export function evaluateFilterRule(val: any, property: PropertySchema, rule: FilterRule): boolean {
  if (rule.operator === 'is_empty') {
    return isEmptyValue(val);
  }
  if (rule.operator === 'is_not_empty') {
    return !isEmptyValue(val);
  }

  // If value is empty and operator is not empty check, return false
  if (isEmptyValue(val)) return false;

  const ruleValStr = String(rule.value ?? '').toLowerCase().trim();
  const ruleNum = Number(rule.value);

  // If property value is an array (multi-select, relations)
  if (Array.isArray(val)) {
    const valStrings = val.map((v) => String(v).toLowerCase().trim());

    switch (rule.operator) {
      case 'equals':
        return valStrings.includes(ruleValStr) || valStrings.join(', ') === ruleValStr;
      case 'not_equals':
        return !valStrings.includes(ruleValStr);
      case 'contains':
        return valStrings.some((v) => v.includes(ruleValStr));
      case 'not_contains':
        return !valStrings.some((v) => v.includes(ruleValStr));
      case 'starts_with':
        return valStrings.some((v) => v.startsWith(ruleValStr));
      case 'ends_with':
        return valStrings.some((v) => v.endsWith(ruleValStr));
      default:
        return false;
    }
  }

  // Scalar numeric comparison for numbers and numeric formula results
  if (property.type === 'number' || typeof val === 'number') {
    const numVal = Number(val);
    if (!isNaN(numVal) && rule.value !== '' && !isNaN(ruleNum)) {
      switch (rule.operator) {
        case 'equals':
          return numVal === ruleNum;
        case 'not_equals':
          return numVal !== ruleNum;
        case 'greater_than':
          return numVal > ruleNum;
        case 'less_than':
          return numVal < ruleNum;
        case 'greater_than_or_equal':
          return numVal >= ruleNum;
        case 'less_than_or_equal':
          return numVal <= ruleNum;
      }
    }
  }

  // String / default comparison
  const valStr = String(val).toLowerCase().trim();

  switch (rule.operator) {
    case 'equals':
      return valStr === ruleValStr;
    case 'not_equals':
      return valStr !== ruleValStr;
    case 'contains':
      return valStr.includes(ruleValStr);
    case 'not_contains':
      return !valStr.includes(ruleValStr);
    case 'starts_with':
      return valStr.startsWith(ruleValStr);
    case 'ends_with':
      return valStr.endsWith(ruleValStr);
    case 'greater_than':
      return valStr > ruleValStr;
    case 'less_than':
      return valStr < ruleValStr;
    case 'greater_than_or_equal':
      return valStr >= ruleValStr;
    case 'less_than_or_equal':
      return valStr <= ruleValStr;
    default:
      return true;
  }
}

/**
 * Filters records based on quick search query and active filter group rules
 */
export function filterRecords(
  records: RecordItem[],
  properties: PropertySchema[],
  filterGroup: FilterGroup,
  searchQuery: string,
  allDatabases: Database[],
  allRecords: RecordItem[]
): RecordItem[] {
  let result = records;

  // 1. Quick search query across all text / multi-select / title fields
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    result = result.filter((rec) => {
      return properties.some((prop) => {
        const val = getPropertyCalculatedValue(rec, prop, properties, allDatabases, allRecords);
        if (isEmptyValue(val)) return false;
        if (Array.isArray(val)) {
          return val.some((v) => String(v).toLowerCase().includes(query));
        }
        return String(val).toLowerCase().includes(query);
      });
    });
  }

  // 2. Filter group rules
  if (!filterGroup || filterGroup.rules.length === 0) {
    return result;
  }

  return result.filter((rec) => {
    const ruleResults = filterGroup.rules.map((rule) => {
      const prop = properties.find((p) => p.id === rule.propertyId);
      if (!prop) return true;
      const val = getPropertyCalculatedValue(rec, prop, properties, allDatabases, allRecords);
      return evaluateFilterRule(val, prop, rule);
    });

    if (filterGroup.conjunction === 'or') {
      return ruleResults.some((res) => res === true);
    }
    // Default 'and'
    return ruleResults.every((res) => res === true);
  });
}

/**
 * Sorts records sequentially by multiple sort rules
 */
export function sortRecords(
  records: RecordItem[],
  properties: PropertySchema[],
  sortRules: SortRule[],
  allDatabases: Database[],
  allRecords: RecordItem[]
): RecordItem[] {
  if (!sortRules || sortRules.length === 0) {
    return records;
  }

  return [...records].sort((a, b) => {
    for (const rule of sortRules) {
      const prop = properties.find((p) => p.id === rule.propertyId);
      if (!prop) continue;

      const valA = getPropertyCalculatedValue(a, prop, properties, allDatabases, allRecords);
      const valB = getPropertyCalculatedValue(b, prop, properties, allDatabases, allRecords);

      const emptyA = isEmptyValue(valA);
      const emptyB = isEmptyValue(valB);

      // Handle empty values (push empty values to bottom)
      if (emptyA && !emptyB) return 1;
      if (!emptyA && emptyB) return -1;
      if (emptyA && emptyB) continue;

      let comparison = 0;

      // Numeric comparison
      if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      } else {
        const numA = Number(valA);
        const numB = Number(valB);
        if (!isNaN(numA) && !isNaN(numB) && String(valA).trim() !== '' && String(valB).trim() !== '') {
          comparison = numA - numB;
        } else {
          // String locale comparison
          const strA = Array.isArray(valA) ? valA.join(', ') : String(valA);
          const strB = Array.isArray(valB) ? valB.join(', ') : String(valB);
          comparison = strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
        }
      }

      if (comparison !== 0) {
        return rule.direction === 'asc' ? comparison : -comparison;
      }
    }
    return 0;
  });
}
