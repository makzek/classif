import { browser, by, element } from 'protractor';

export class EosNgPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('eos-root h1')).getText();
  }
}
