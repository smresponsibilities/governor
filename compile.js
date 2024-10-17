import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import solc from 'solc';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the Solidity file
const filePath = path.resolve(__dirname, 'MyGovernance.sol');

// Check if the file exists
if (!fs.existsSync(filePath)) {
  throw new Error(`File not found: ${filePath}`);
}

// Read Solidity source
const source = fs.readFileSync(filePath, 'utf8');

// Find the base path for the OpenZeppelin contracts
const basePath = path.resolve(__dirname, 'node_modules/@openzeppelin/contracts');

// Define a function to handle imports
function findImports(importPath) {
  try {
    const fullPath = path.resolve(basePath, importPath.replace('@openzeppelin/contracts/', ''));
    const content = fs.readFileSync(fullPath, 'utf8');
    return { contents: content };
  } catch (e) {
    return { error: 'File not found' };
  }
}

// Prepare the input for Solidity compiler
const input = {
  language: 'Solidity',
  sources: {
    'MyGovernance.sol': {
      content: source,
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    },
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  },
};

// Compile the Solidity code
const tempFile = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

// Check if the compilation was successful
if (!tempFile.contracts || !tempFile.contracts['MyGovernance.sol'] || !tempFile.contracts['MyGovernance.sol']['MyGovernance']) {
  throw new Error('Compilation failed or contract not found in the compiled output');
}

// Extract the compiled contract
const contractFile = tempFile.contracts['MyGovernance.sol']['MyGovernance'];


// Export the compiled contract
console.log(contractFile.metadata);
export { contractFile };