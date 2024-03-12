import { Injectable } from '@nestjs/common';
// import { CreateDewtDto } from './dto/create-dewt.dto';
// import { UpdateDewtDto } from './dto/update-dewt.dto';
import { getServiceTermContract, rlpEncodeServiceTerm } from '../common/common';
import { signTypedData, SignTypedDataVersion } from '@metamask/eth-sig-util';
import { CreateDewtDto } from './dto/create-dewt.dto';
// import Web3 from 'web3';

@Injectable()
export class DewtService {
  create(address: string, privateKey: string): string {
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
