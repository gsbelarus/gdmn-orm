import {SequenceAdapter} from '../rdbadapter';
import {IBaseOptions} from '../types';

export class Sequence<Adapter = SequenceAdapter> {

  private readonly _name: string;
  private readonly _adapter?: Adapter;

  constructor(options: IBaseOptions<Adapter>) {
    this._name = options.name;
    this._adapter = options.adapter;
  }

  get name(): string {
    return this._name;
  }

  get adapter(): Adapter | undefined {
    return this._adapter;
  }
}
