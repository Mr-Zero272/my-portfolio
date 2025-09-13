import { IPost } from '../interfaces';
import { MyPortfolioCrudApiClient } from './crud';

export class MyPortfolioPostApiClient extends MyPortfolioCrudApiClient<IPost> {
  constructor() {
    super({ resource: 'posts' });
  }
}
