import {Entity, ERModel, StringAttribute} from "../src";
import {deserializeERModel} from "../src/serialize";

describe("ERModel", async () => {

  it("serialize/deserialize", async () => {
    const erModel = new ERModel();
    await erModel.initDataSource();

    const transaction = await erModel.startTransaction();

    try {
      const entity = await erModel.create(transaction, new Entity({
        name: "TEST", lName: {en: {name: "Test"}}
      }));
      const testAttr = await entity.create(transaction, new StringAttribute({
        name: "TEST_FIELD", lName: {en: {name: "Test field"}}
      }));
      // await entity.addAttrUnique(transaction, [testAttr]);
    } finally {
      if (transaction.active) {
        await erModel.commitTransaction(transaction);
      }
    }

    const serialized = erModel.serialize();

    const erModel2 = deserializeERModel(serialized);

    expect(erModel).toEqual(erModel2);
    expect(erModel2.entities.TEST.isTree).toBeFalsy();
  });

  it("serialize/deserialize (old)", async () => {
    const erModel = new ERModel();

    erModel.add(new Entity({name: "Test", lName: {en: {name: "Test"}}}));

    const serialized = erModel.serialize();

    const erModel2 = deserializeERModel(serialized);

    expect(erModel).toEqual(erModel2);
    expect(erModel2.entities.Test.isTree).toBeFalsy();
  }, 40000);
});
