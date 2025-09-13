import { MyPortfolioPostApiClient } from './post';

class TekgetherApiClient {
  postApi = new MyPortfolioPostApiClient();
}

export const tekgetherApi = new TekgetherApiClient();
