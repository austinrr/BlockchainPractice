import crypto from 'crypto';
// import axios, { AxiosResponse } from 'axios';
// import { URL } from 'url';

import Block from './Block';
import Transaction from './Transaction';

class Chain {
    chain : Array<Block>;
    currentTransactions : Array<Transaction>;
    nodes : Set<string>;

    constructor() {

        this.chain = [];
        this.currentTransactions = [];
        this.nodes = new Set();
    
        // Create the genesis block
        this.newBlock(100, '1');
      }

    newBlock (proof : number, previousHash? : string) : Block {
        const block : Block = {
            proof,
            index: this.chain.length,
            timestamp: Date.now(),
            transactions: this.currentTransactions || [],
            previousHash: previousHash ? previousHash : this.hash(this.lastBlock())
        }

        this.currentTransactions = [];
        this.chain.push(block);
        return block;
    }

    /**
     * Generate transaction and add to current array
     * @param {string} sender
     * @param {string} recipient
     * @param {number} amount
     */
    newTransaction (sender : string, recipient : string, amount : number) {
        const transaction : Transaction = {
            sender: sender,
            recipient: recipient,
            amount: amount
        };

        this.currentTransactions.push(transaction);
        return this.lastBlock().index + 1;
    }

    hash (block : Block) : string {
        const blockString = JSON.stringify(block);
        return crypto
            .createHash('sha256')
            .update(blockString)
            .digest('hex');
    }

    lastBlock () : Block {
        const lastIndex = this.chain.length - 1;
        return this.chain[lastIndex >= 0 ? lastIndex : 0];
    }

    static validProof (lastProof : number, proof : number) : boolean {
        const resolutation = '0000';
        const guess : string = `${ lastProof }${ proof }`;
        const guessHash : string = crypto
          .createHash('sha256')
          .update(guess)
          .digest('hex');
    
        return guessHash.startsWith(resolutation);
    }

    proofOfWork (lastProof : number) : number {
        let proof = 0;

        while (!Chain.validProof(lastProof, proof)) {
            proof++;
        }

        return proof;
    }
}

export default Chain;