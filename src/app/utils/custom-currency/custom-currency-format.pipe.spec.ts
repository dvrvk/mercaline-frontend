import { CustomCurrencyFormatPipe } from './custom-currency-format.pipe';

describe('CustomCurrencyFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomCurrencyFormatPipe();
    expect(pipe).toBeTruthy();
  });
});
