/**
 *
 */

 export class Attribute {
   readonly name: string;
   readonly lName: string;

   constructor(name: string, lName: string) {
     this.name = name;
     this.lName = lName;
   }
 }

 export class AttributeLink extends Attribute {
 }

 export class AttributeSet extends Attribute {
 }


 export class Entity {
   readonly parent?: Entity;
   readonly relName: string;
   readonly lName: string;
   readonly attributes: Attribute[];

   constructor(parent: Entity | undefined, relName: string, lName: string) {
     this.parent = parent;
     this.relName = relName;
     this.lName = lName;
     this.attributes = [];
   }
 }