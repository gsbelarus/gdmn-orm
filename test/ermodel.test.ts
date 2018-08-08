import { Entity, ERModel } from '../src/ermodel';
import { deserializeERModel } from '../src/serialize';

it("erModel", () => {

  const erModel = new ERModel();

  erModel.add(
    new Entity(
      undefined,
      'Test',
      { en: { name: 'Test' }},
      false,
      []
    )
  );

  const serialized = erModel.serialize();

  const erModel2 = deserializeERModel(serialized);

  expect(erModel).toEqual(erModel2);
  expect(erModel2.entities.Test.isTree).toBeFalsy();
}, 40000);
