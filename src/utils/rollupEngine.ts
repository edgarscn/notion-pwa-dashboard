import { RecordItem, RollupConfig, PropertySchema } from '../types';

export function calculateRollupValue(
  record: RecordItem,
  rollupConfig: RollupConfig | undefined,
  targetRecords: RecordItem[],
  targetProperties: PropertySchema[]
): any {
  if (!rollupConfig) return '';
  const { relationPropertyId, targetPropertyId, function: fn } = rollupConfig;

  // Get linked record IDs from relation property
  const linkedIds: string[] = record.values[relationPropertyId] || [];
  if (!Array.isArray(linkedIds) || linkedIds.length === 0) {
    return fn === 'count' ? 0 : '';
  }

  // Filter target records that are linked
  const linkedRecords = targetRecords.filter((tr) => linkedIds.includes(tr.id));
  if (linkedRecords.length === 0) {
    return fn === 'count' ? 0 : '';
  }

  // Find target property schema
  const targetProp = targetProperties.find((p) => p.id === targetPropertyId);

  // Extract values
  const values = linkedRecords.map((tr) => {
    const raw = tr.values[targetPropertyId];
    if (targetProp?.type === 'select' || targetProp?.type === 'status') {
      const option = targetProp.options?.find((o) => o.id === raw || o.name === raw);
      return option ? option.name : raw;
    }
    return raw;
  }).filter((v) => v !== undefined && v !== null && v !== '');

  switch (fn) {
    case 'count':
      return linkedIds.length;

    case 'count_unique':
      return new Set(values).size;

    case 'sum': {
      const numericVals = values.map(v => Number(v)).filter(v => !isNaN(v));
      return numericVals.reduce((acc, curr) => acc + curr, 0);
    }

    case 'average': {
      const numericVals = values.map(v => Number(v)).filter(v => !isNaN(v));
      if (numericVals.length === 0) return 0;
      const sum = numericVals.reduce((acc, curr) => acc + curr, 0);
      return Math.round((sum / numericVals.length) * 100) / 100;
    }

    case 'min': {
      const numericVals = values.map(v => Number(v)).filter(v => !isNaN(v));
      return numericVals.length > 0 ? Math.min(...numericVals) : '';
    }

    case 'max': {
      const numericVals = values.map(v => Number(v)).filter(v => !isNaN(v));
      return numericVals.length > 0 ? Math.max(...numericVals) : '';
    }

    case 'show_original':
    default:
      return values.join(', ');
  }
}
