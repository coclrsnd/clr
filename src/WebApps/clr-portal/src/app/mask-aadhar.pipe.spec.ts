import { MaskAadharPipe } from './mask-aadhar.pipe';

describe('MaskAadharPipe', () => {
  it('create an instance', () => {
    const pipe = new MaskAadharPipe();
    expect(pipe).toBeTruthy();
  });
});
