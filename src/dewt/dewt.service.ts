import { Injectable } from '@nestjs/common';
// import { CreateDewtDto } from './dto/create-dewt.dto';
// import { UpdateDewtDto } from './dto/update-dewt.dto';
import { getServiceTermContract, rlpEncodeServiceTerm } from '../common/common';
import { signTypedData, SignTypedDataVersion } from '@metamask/eth-sig-util';
import { CreateDewtDto } from './dto/create-dewt.dto';
// import Web3 from 'web3';

@Injectable()
export class DewtService {
  async create(createDewtDto: CreateDewtDto) {
    const serviceTermContract = getServiceTermContract(createDewtDto.address);
    const encodedData = rlpEncodeServiceTerm(serviceTermContract);
    const eip712signature = signTypedData({
      privateKey: Buffer.from(createDewtDto.privatekey, 'hex'),
      data: serviceTermContract as any,
      version: SignTypedDataVersion.V4,
    });
    const deWT = `${encodedData}.${eip712signature.replace('0x', '')}`;
    return deWT;
  }

  findAll() {
    return `This action returns all dewt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dewt`;
  }

  // update(id: number, updateDewtDto: UpdateDewtDto) {
  //   return `This action updates a #${id} dewt`;
  // }

  remove(id: number) {
    return `This action removes a #${id} dewt`;
  }
}
