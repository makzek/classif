import { EosNgPage } from './app.po';

describe('eos-ng App', () => {
  let page: EosNgPage;

  beforeEach(() => {
    page = new EosNgPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to eos!!');
  });
});
