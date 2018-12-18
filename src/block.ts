import Transaction from './transaction';

interface Block {
  readonly index : number;
  readonly timestamp : number;
  readonly transactions : Array<Transaction>;
  readonly proof : number;
  readonly previousHash? : string;
}

export default Block;