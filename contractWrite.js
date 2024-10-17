import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { contractFile } from './compile.js';

const contractAbi = contractFile.abi;

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const api = process.env.API;


const role = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
const contractAddress = '0xe3868287eC6291df81f46F3db1cce0De80FD792E';

// Ethereum provider
const provider = new ethers.JsonRpcProvider(api);
const wallet = new ethers.Wallet(privateKey, provider);

async function writeContractData() {
  try {
    const MyToken = new ethers.Contract(contractAddress, contractAbi, wallet);
    console.log('Contract instance:', MyToken);
    console.log('Contract ABI:', JSON.stringify(contractAbi, null, 2)); 
    console.log(':', wallet);
    // Log ABI for inspection
    
    console.log(`Attempting to call updateQuorumNumerator from account: ${wallet.address}`);

    // Access function through interface

    
    const tx = await MyToken.grantRole(role,contractAddress);
    
    const receipt = await tx.wait();
    console.log('Transaction receipt:', receipt);

  } catch (error) {
    console.error('Error writing contract data:', error);
  }
}

writeContractData();
