import { HaydronPage } from './app.po';

describe('haydron App', () => {
  let page: HaydronPage;

  beforeEach(() => {
    page = new HaydronPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
