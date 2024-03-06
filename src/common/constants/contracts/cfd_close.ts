import { getTimestamp } from '../../common';

const CFDOrderClose = {
  domain: {
    // Defining the chain aka Rinkeby testnet or Ethereum Main Net
    chainId: '0x1',
    // Give a user friendly name to the specific contract you are signing for.
    name: 'TideBit-DeFi',
    // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
    verifyingContract: '0xCAFECA5CCD019431B17B132e45e6638Ee2397be8',
    // Just let's you know the latest version. Definitely make sure the field name is correct.
    version: 'v1.0.0',
  },
  // Refers to the keys of the *types* object below.
  primaryType: 'CloseCFDOrderData',
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'string' },
      { name: 'verifyingContract', type: 'address' },
    ],
    // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
    CloseCFDOrderData: [
      { name: 'referenceId', type: 'string' },
      { name: 'quotation', type: 'Quotation' },
      { name: 'closePrice', type: 'uint256' },
      { name: 'closedType', type: 'string' },
      { name: 'closeTimestamp', type: 'uint256' },
    ],
    Quotation: [
      { name: 'instId', type: 'string' },
      { name: 'targetAsset', type: 'string' },
      { name: 'unitAsset', type: 'string' },
      { name: 'typeOfPosition', type: 'string' },
      { name: 'price', type: 'uint256' },
      { name: 'spotPrice', type: 'uint256' },
      { name: 'spreadFee', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
      { name: 'signature', type: 'string' },
    ],
  },
  // Defining the message signing data content.
  message: {
    /*
    - Anything you want. Just a JSON Blob that encodes the data you want to send
    - No required fields
    - This is DApp Specific
    - Be as explicit as possible when building out the message schema.
    */
    referenceId: `TB202303020001ETH`,
    quotation: {
      instId: 'ETH',
      targetAsset: 'ETH',
      unitAsset: 'USDT',
      typeOfPosition: 'BUY',
      price: 21023,
      spotPrice: 210232,
      spreadFee: 0,
      deadline: 2412412412,
      signature: '0x',
    },
    closePrice: 71232,
    closedType: 'BY_USER',
    closeTimestamp: getTimestamp(),
  },
};

export default CFDOrderClose;
