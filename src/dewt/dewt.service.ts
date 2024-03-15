import { Injectable } from '@nestjs/common';
import { getServiceTermContract, rlpEncodeServiceTerm } from '../common/common';
import { signTypedData, SignTypedDataVersion } from '@metamask/eth-sig-util';

@Injectable()
export class DewtService {
  async create(address: string, privateKey: string): Promise<string> {
    const serviceTermContract = getServiceTermContract(address);
    const encodedData = rlpEncodeServiceTerm(serviceTermContract);
    const eip712signature = signTypedData({
      privateKey: Buffer.from(privateKey, 'hex'),
      data: serviceTermContract as any,
      version: SignTypedDataVersion.V4,
    });
    const deWT = `${encodedData}.${eip712signature.replace('0x', '')}`;
    return deWT;
  }
}
