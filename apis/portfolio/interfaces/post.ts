import { BaseRecord } from '@/apis/base';

export interface IPost extends BaseRecord {
  title: string;
  content?: string;
}
