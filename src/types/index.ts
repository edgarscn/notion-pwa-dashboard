export type PropertyType =
  | 'text'
  | 'number'
  | 'select'
  | 'status'
  | 'date'
  | 'relation'
  | 'rollup'
  | 'formula'
  | 'created_time';

export type NumberFormat = 'number' | 'currency_usd' | 'currency_brl' | 'percent';

export type RollupFunction =
  | 'count'
  | 'count_unique'
  | 'sum'
  | 'average'
  | 'min'
  | 'max'
  | 'show_original';

export interface SelectOption {
  id: string;
  name: string;
  color: string; // Tailwind color class or hex string
}

export interface RelationConfig {
  targetDatabaseId: string;
  targetPropertyId?: string; // Option reciprocal property ID on target database
}

export interface RollupConfig {
  relationPropertyId: string; // ID of the relation property on current database
  targetPropertyId: string;   // ID of property on the target database to aggregate
  function: RollupFunction;
}

export interface FormulaConfig {
  expression: string; // e.g. prop("Preço") * prop("Quantidade")
}

export interface PropertySchema {
  id: string;
  name: string;
  type: PropertyType;
  options?: SelectOption[];
  numberFormat?: NumberFormat;
  relationConfig?: RelationConfig;
  rollupConfig?: RollupConfig;
  formulaConfig?: FormulaConfig;
}

export interface Teamspace {
  id: string;
  name: string;
  icon: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  teamspaceId: string;
  parentId: string | null;
  title: string;
  icon: string;
  coverUrl?: string;
  isDatabase: boolean;
  content?: string; // Rich text / Markdown / Blocks content for standard pages
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Database {
  id: string;
  pageId: string;
  title: string;
  description?: string;
  properties: PropertySchema[];
  defaultView: 'table' | 'board';
  createdAt: string;
  updatedAt: string;
}

export interface RecordItem {
  id: string;
  databaseId: string;
  values: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  order: number;
}
