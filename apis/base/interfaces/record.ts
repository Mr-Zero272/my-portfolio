type BaseBaseKey = string;

export interface BaseRecord<KeyType = BaseBaseKey> extends Record<string, unknown> {
  id: KeyType;
  date_created?: string;
  date_updated?: string;
}
