import {Entity, ERModel} from "../src";
import {deserializeERModel} from "../src/serialize";

it("erModel", () => {

  const erModel = new ERModel();

  erModel.add(new Entity({name: "Test", lName: {en: {name: "Test"}}}));

  const serialized = erModel.serialize();

  const erModel2 = deserializeERModel(serialized);

  expect(erModel).toEqual(erModel2);
  expect(erModel2.entities.Test.isTree).toBeFalsy();
}, 40000);
